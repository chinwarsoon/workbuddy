import csv, json, sys, re
csv.field_size_limit(sys.maxsize)

nawl=[w.strip() for w in open('build/nawl.txt',encoding='utf-8') if w.strip()]
take = nawl[:800]
print("NAWL total", len(nawl), "taking", len(take))

ec={}
with open('build/ecdict.csv',encoding='utf-8',errors='replace') as f:
    r=csv.DictReader(f)
    for row in r:
        w=row['word'].strip().lower()
        if w not in ec:
            ec[w]=row
print("ECDICT loaded", len(ec))

# ---- phonetic glyph normalization ----
PHON_MAP={'ә':'ə','ɛ':'e','ˌ':'','ʾ':''}
def norm_phone(p):
    if not p: return ''
    for k,v in PHON_MAP.items(): p=p.replace(k,v)
    return p.strip()
def clean(s):
    s=(s or '').replace('\r',' ').replace('\n',' ').strip()
    return s

# ---- POS detection from a definition/translation string ----
# order longer tokens FIRST so 'vt.' is not captured as 'v.'
# NOTE: no trailing \b ('.' is non-word, so \b after '.' fails); require space/dot/end after the tag
POS_RE=re.compile(r'^\s*(?:\([^)]*\)\s*)?(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)', re.I)
ANY_POS_RE=re.compile(r'(?:^|[\s,;])(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)', re.I)
ABBREV={'n.':'n.','v.':'v.','vt.':'v.','vi.':'v.','adj.':'adj.','a.':'adj.','adv.':'adv.',
        'prep.':'prep.','conj.':'conj.','int.':'int.','abbr.':'abbr.','art.':'art.','pron.':'pron.'}
DISCIPLINE_RE=re.compile(r'\[[^\]]*\]')  # e.g. [计] [医] [网络]

def detect_pos(s):
    if not s: return ''
    # 1) leading pos, optionally preceded by a discipline tag like "(statistics) "
    m=POS_RE.match(s)
    if m: return ABBREV.get(m.group(1).lower(),'')
    # 2) any " n. " / " v. " / " adj. " token anywhere in the string
    m2=ANY_POS_RE.search(s)
    if m2: return ABBREV.get(m2.group(1).lower(),'')
    return ''

def strip_pos(s):
    return POS_RE.sub('', s or '').strip()

# ---- EN definition: take first sense, drop pos + discipline tags ----
def en_def(s):
    s=(s or '').replace('\r',' ').replace('\\n','\n')
    if not s.strip(): return ''
    # first SENSE = first line (ECDICT separates senses by newlines)
    first=s.split('\n')[0].strip()
    # drop leading pos if present
    m=POS_RE.match(first)
    if m: first=POS_RE.sub('', first, count=1).strip()
    first=DISCIPLINE_RE.sub('', first).strip()
    first=first.strip(' .;')
    # ensure single spaces
    first=re.sub(r'\s+',' ',first).strip()
    # truncate to a readable length at a clause boundary
    if len(first)>160:
        cut=re.split(r'(?<=[a-z])[;,)]', first)
        first=cut[0].strip()
        if len(first)>160: first=first[:157].rsplit(' ',1)[0]
    return first[:200]

INLINE_POS_RE=re.compile(r'(?:^|[\s,，、])(vt\.|vi\.|v\.|n\.|adj\.|adv\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)\s*')
# ---- ZH translation: first 1-2 senses, drop discipline tags + residual pos ----
def zh_def(s):
    s=(s or '').replace('\r',' ').replace('\n',' ').replace('\\n',' ').replace('\t',' ')
    s=re.sub(r'\s+',' ',s).strip()
    if not s: return ''
    # strip leading pos like "n. " or "vt. "
    s=re.sub(r'^[a-zA-Z]+\.\s*','',s).strip()
    s=DISCIPLINE_RE.sub('', s).strip()
    # drop any inline residual pos tokens like "vi. 流行" or "vt. "
    s=INLINE_POS_RE.sub('', s)
    s=re.sub(r'\s+',' ',s).strip()
    # take first two comma-separated senses
    parts=[p.strip() for p in s.split(',') if p.strip()]
    if not parts: return ''
    out=', '.join(parts[:2])
    return out[:60]

pos_emoji={'n.':'📦','v.':'🔧','adj.':'⭐','adv.':'⏩','prep.':'🔗','conj.':'🔗','int.':'💬','abbr.':'🔤'}

# ---- context-rich example templates by POS (deterministic pick) ----
N_TEMPL=(
 "The {w} plays a key role in this area.",
 "We studied the {w} in detail.",
 "This {w} helps explain the result.",
)
V_TEMPL=(
 "Researchers {w} the data carefully.",
 "We need to {w} a clear answer.",
 "They {w} the samples before testing.",
)
ADJ_TEMPL=(
 "This is {art} {w} example of the method.",
 "The result is {w} and reliable.",
 "We chose {art} {w} approach to the problem.",
)
ADV_TEMPL=(
 "The value changes {w} over time.",
 "The process works {w} as expected.",
)
# Chinese mirrors (roughly literal, grammatically loose but natural)
ZH_N=("该{w}在这一领域起关键作用。","我们详细研究了这个{w}。","这个{w}有助于解释结果。")
ZH_V=("研究人员仔细{w}了数据。","我们需要{w}一个明确的答案。","他们在测试前{w}了样本。")
ZH_ADJ=("这是该方法一个{w}的例子。","结果是{w}且可靠的。","我们选用了{w}的方法。")
ZH_ADV=("数值随时间{w}变化。","过程如预期般{w}进行。")

# ---- richer example pool for the top-200 high-frequency NAWL words ----
# 8 sentences per POS, with natural academic/通用 collocations. seed picks one;
# paired zh mirror is chosen by the SAME index so en/zh stay aligned.
RICH_N=(
 ("The {w} of the system was carefully documented.","该{w}的形成过程被仔细记录。"),
 ("We collected the {w} from multiple sources.","我们从多个来源收集了这个{w}。"),
 ("This {w} explains why the result changed.","这个{w}解释了结果为何改变。"),
 ("A clear {w} helps readers follow the argument.","清晰的{w}能帮助读者理解论点。"),
 ("The {w} between the two groups was significant.","两组之间的{w}非常显著。"),
 ("Our model depends on a single {w}.","我们的模型依赖一个核心{w}。"),
 ("The study reports a new {w} for daily use.","该研究报告了一个可日常使用的{w}。"),
 ("Teachers value this {w} in real classrooms.","教师在真实课堂中重视这个{w}。"),
)
RICH_V=(
 ("Scientists {w} the samples under strict conditions.","科学家在严格条件下{w}样本。"),
 ("We {w} the answer by comparing both methods.","我们通过比较两种方法{w}答案。"),
 ("The team will {w} the plan next semester.","团队将在下学期{w}该计划。"),
 ("Students {w} the text before writing the essay.","学生在写作前{w}文本。"),
 ("New tools let us {w} the problem faster.","新工具让我们更快速地{w}问题。"),
 ("They {w} evidence to support the claim.","他们{w}证据来支持这一主张。"),
 ("Researchers {w} a link between sleep and memory.","研究者{w}睡眠与记忆之间的关联。"),
 ("You can {w} the result with a simple test.","你可以用一个简单测试{w}结果。"),
)
RICH_ADJ=(
 ("This is {art} {w} idea worth testing.","这是一个值得验证的{w}想法。"),
 ("The {w} data confirmed our hypothesis.","{w}的数据证实了我们的假设。"),
 ("We need {art} {w} solution for the clinic.","我们需要一个适用于临床的{w}方案。"),
 ("Her {w} explanation made the topic clear.","她{w}的解释让主题变得清晰。"),
 ("A {w} method improves learning outcomes.","{w}的方法改善了学习成效。"),
 ("The result remained {w} across all trials.","结果在所有试验中保持{w}。"),
 ("That {w} design won the teaching award.","那个{w}设计赢得了教学奖项。"),
 ("We found {art} {w} pattern in the responses.","我们在回答中发现了一个{w}模式。"),
)
RICH_ADV=(
 ("The score improved {w} after training.","训练后分数{w}提升。"),
 ("The machine learns {w} from feedback.","机器从反馈中{w}学习。"),
 ("We measured the change {w} and precisely.","我们{w}且精确地测量了变化。"),
 ("The system reacts {w} to new inputs.","系统对新输入{w}做出反应。"),
 ("Time passed {w} as the experiment ran.","随着实验进行，时间{w}流逝。"),
 ("Children answered {w} once they understood.","一旦理解，孩子们便{w}作答。"),
 ("The model generalized {w} to new data.","模型对新数据{w}泛化。"),
 ("Results were reported {w} in the paper.","论文中{w}报告了结果。"),
)

def with_article(word):
    return ('an ' if word[0].lower() in 'aeiou' else 'a ')

def make_examples(word, pos, seed, rich=False):
    if rich:
        if pos=='v.':
            a,b=RICH_V[seed%len(RICH_V)]; return a.format(w=word), b.format(w=word), a.format(w=word)
        if pos=='adj.':
            art=with_article(word)
            a,b=RICH_ADJ[seed%len(RICH_ADJ)]; return a.format(w=word,art=art), b.format(w=word), a.format(w=word,art=art)
        if pos=='adv.':
            a,b=RICH_ADV[seed%len(RICH_ADV)]; return a.format(w=word), b.format(w=word), a.format(w=word)
        a,b=RICH_N[seed%len(RICH_N)]; return a.format(w=word), b.format(w=word), a.format(w=word)
    # fallback: original compact templates
    if pos=='v.':   a,b=V_TEMPL[seed%3].format(w=word), ZH_V[seed%3].format(w=word)
    elif pos=='adj.':
        art=with_article(word)
        a=ADJ_TEMPL[seed%3].format(w=word, art=art); b=ZH_ADJ[seed%3].format(w=word)
    elif pos=='adv.':a,b=ADV_TEMPL[seed%2].format(w=word), ZH_ADV[seed%2].format(w=word)
    else:           a,b=N_TEMPL[seed%3].format(w=word), ZH_N[seed%3].format(w=word)
    return a, b, a

TOP200=set(take[:200])   # top-200 by NAWL rank get richer examples

out={}
miss=[]
for i,w in enumerate(take):
    row=ec.get(w.lower())
    if not row:
        # try simple inflections
        for alt in [w+'s', w+'es', w+'ed', w+'ing', (w[:-1]+'ing' if w.endswith('e') else w+'ing')]:
            if ec.get(alt.lower()): row=ec[alt.lower()]; break
    if not row:
        e=['','',w,'a term used in academic or technical contexts.','','','', '📘']; miss.append(w); out[w]=e; continue
    ph=norm_phone(clean(row['phonetic']))
    ipa='/' + ph + '/' if ph else ''
    # POS: prefer ECDICT pos; else derive from definition
    pos=clean(row['pos']) or detect_pos(row['definition']) or detect_pos(row['translation'])
    pos=ABBREV.get(pos.lower(), pos) if pos else ''
    # infer pos from English definition lead word if still unknown
    if not pos:
        en_lead=en_def(row['definition']).lower()
        if en_lead.startswith('to ') or en_lead.startswith('an act') or en_lead.startswith('the act'):
            pos='v.'
        elif en_lead.startswith(('a. ','adj.','an ','the ','any ','some ')):
            pos='adj.' if en_lead.startswith(('a. ','adj.')) else 'n.'
        elif en_lead.startswith(('in a ','with ')):
            pos='adv.'
        else:
            pos='n.'  # academic words are overwhelmingly nouns
    zh=zh_def(row['translation'])
    en=en_def(row['definition'])
    if not zh: zh='（学术/技术词汇）'
    if not en: en='a term used in academic or technical contexts.'
    emoji=pos_emoji.get(pos,'📘')
    rich = w in TOP200
    ex,exzh,exEn=make_examples(w,pos,i,rich)
    out[w]=[ipa,pos,zh,en,ex,exzh,exEn,emoji]

json.dump(out, open('build/p3_words_raw.json','w',encoding='utf-8'), ensure_ascii=False)
real=sum(1 for v in out.values() if v[3])
print('generated', len(out), '| with EN def:', real, '| with ZH def:', sum(1 for v in out.values() if v[2]), '| missing:', len(miss))
if miss: print('missing sample:', miss[:20])
