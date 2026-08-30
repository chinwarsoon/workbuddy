import csv, json, sys, re
csv.field_size_limit(sys.maxsize)
DIR="C:/Users/frank/WorkBuddy/workbuddy/english-learning"

# ---- load ECDICT (same source as P3/P4) ----
ec={}
with open(DIR+'/build/ecdict.csv',encoding='utf-8',errors='replace') as f:
    for row in csv.DictReader(f):
        w=row['word'].strip().lower()
        if w not in ec: ec[w]=row
print("ECDICT loaded", len(ec))

# ---- phonetic / text helpers (from P3) ----
PHON_MAP={'ә':'ə','ɛ':'e','ˌ':'','ʾ':''}
def norm_phone(p):
    if not p: return ''
    for k,v in PHON_MAP.items(): p=p.replace(k,v)
    return p.strip()
def clean(s):
    return (s or '').replace('\r',' ').replace('\n',' ').strip()

POS_RE=re.compile(r'^\s*(?:\([^)]*\)\s*)?(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)', re.I)
ANY_POS_RE=re.compile(r'(?:^|[\s,;])(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)', re.I)
ABBREV={'n.':'n.','v.':'v.','vt.':'v.','vi.':'v.','adj.':'adj.','a.':'adj.','adv.':'adv.',
        'prep.':'prep.','conj.':'conj.','int.':'int.','abbr.':'abbr.','art.':'art.','pron.':'pron.'}
DISCIPLINE_RE=re.compile(r'\[[^\]]*\]')
def detect_pos(s):
    if not s: return ''
    m=POS_RE.match(s)
    if m: return ABBREV.get(m.group(1).lower(),'')
    m2=ANY_POS_RE.search(s)
    if m2: return ABBREV.get(m2.group(1).lower(),'')
    return ''
def en_def(s):
    s=(s or '').replace('\r',' ').replace('\\n','\n')
    if not s.strip(): return ''
    first=s.split('\n')[0].strip()
    m=POS_RE.match(first)
    if m: first=POS_RE.sub('', first, count=1).strip()
    first=DISCIPLINE_RE.sub('', first).strip().strip(' .;')
    first=re.sub(r'\s+',' ',first).strip()
    if len(first)>160:
        cut=re.split(r'(?<=[a-z])[;,)]', first)
        first=cut[0].strip()
        if len(first)>160: first=first[:157].rsplit(' ',1)[0]
    return first[:200]
INLINE_POS_RE=re.compile(r'(?:^|[\s,，、])(vt\.|vi\.|v\.|n\.|adj\.|adv\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)\s*')
def zh_def(s):
    s=(s or '').replace('\r',' ').replace('\n',' ').replace('\\n',' ').replace('\t',' ')
    s=re.sub(r'\s+',' ',s).strip()
    if not s: return ''
    s=re.sub(r'^[a-zA-Z]+\.\s*','',s).strip()
    s=DISCIPLINE_RE.sub('', s).strip()
    s=INLINE_POS_RE.sub('', s)
    s=re.sub(r'\s+',' ',s).strip()
    parts=[p.strip() for p in s.split(',') if p.strip()]
    if not parts: return ''
    return ', '.join(parts[:2])[:60]
pos_emoji={'n.':'📦','v.':'🔧','adj.':'⭐','adv.':'⏩','prep.':'🔗','conj.':'🔗','int.':'💬','abbr.':'🔤'}

# ---- example templates (compact; P2 is mid-frequency, no RICH pool needed) ----
N_TEMPL=("The {w} plays a key role in this area.","We studied the {w} in detail.","This {w} helps explain the result.")
V_TEMPL=("Researchers {w} the data carefully.","We need to {w} a clear answer.","They {w} the samples before testing.")
ADJ_TEMPL=("This is {art} {w} example of the method.","The result is {w} and reliable.","We chose {art} {w} approach to the problem.")
ADV_TEMPL=("The value changes {w} over time.","The process works {w} as expected.")
ZH_N=("该{w}在这一领域起关键作用。","我们详细研究了这个{w}。","这个{w}有助于解释结果。")
ZH_V=("研究人员仔细{w}了数据。","我们需要{w}一个明确的答案。","他们在测试前{w}了样本。")
ZH_ADJ=("这是该方法一个{w}的例子。","结果是{w}且可靠的。","我们选用了{w}的方法。")
ZH_ADV=("数值随时间{w}变化。","过程如预期般{w}进行。")
def with_article(word): return ('an ' if word[0].lower() in 'aeiou' else 'a ')
def make_examples(word,pos,seed):
    if pos=='v.':   a,b=V_TEMPL[seed%3].format(w=word), ZH_V[seed%3].format(w=word)
    elif pos=='adj.':
        art=with_article(word)
        a=ADJ_TEMPL[seed%3].format(w=word, art=art); b=ZH_ADJ[seed%3].format(w=word)
    elif pos=='adv.':a,b=ADV_TEMPL[seed%2].format(w=word), ZH_ADV[seed%2].format(w=word)
    else:           a,b=N_TEMPL[seed%3].format(w=word), ZH_N[seed%3].format(w=word)
    return a, b, a

ALTS=lambda w:[w+'s',w+'es',w+'ed',w+'ing',(w[:-1]+'ing' if w.endswith('e') else w+'ing')]

# ---- load P2 pack (canonical word list) ----
pack=json.load(open(DIR+'/content/freq-2k.json',encoding='utf-8'))
words=pack['words']
print("P2 entries:", len(words))

cur_def=sum(1 for w in words if w.get('def'))
miss=[]
for i,w in enumerate(words):
    word=w['word']
    row=ec.get(word.lower())
    if not row:
        for a in ALTS(word):
            if ec.get(a.lower()): row=ec[a.lower()]; break
    if not row:
        miss.append(word); continue
    ph=norm_phone(clean(row['phonetic']))
    ipa='/' + ph + '/' if ph else ''
    pos=clean(row['pos']) or detect_pos(row['definition']) or detect_pos(row['translation'])
    pos=ABBREV.get(pos.lower(), pos) if pos else ''
    if not pos:
        en_lead=en_def(row['definition']).lower()
        if en_lead.startswith('to ') or en_lead.startswith('an act') or en_lead.startswith('the act'):
            pos='v.'
        elif en_lead.startswith(('a. ','adj.','an ','the ','any ','some ')):
            pos='adj.' if en_lead.startswith(('a. ','adj.')) else 'n.'
        elif en_lead.startswith(('in a ','with ')):
            pos='adv.'
        else:
            pos='n.'
    zh=zh_def(row['translation']) or '（常用词）'
    en=en_def(row['definition']) or 'a common English word.'
    emoji=pos_emoji.get(pos,'📘')
    ex,exzh,exEn=make_examples(word,pos,i)
    w['ipa']=ipa; w['pos']=pos; w['def']=zh; w['defEn']=en
    w['ex']=ex; w['exzh']=exzh; w['exEn']=exEn; w['emoji']=emoji

# ---- write back both copies ----
out=json.dumps(pack, ensure_ascii=False, indent=1)
open(DIR+'/content/freq-2k.json','w',encoding='utf-8').write(out)
open(DIR+'/pwa/content/freq-2k.json','w',encoding='utf-8').write(out)
real=sum(1 for w in pack['words'] if w.get('def'))
print('generated', len(pack['words']), '| with ZH def:', real, '| missing:', len(miss))
if miss: print('miss sample:', miss[:20])
