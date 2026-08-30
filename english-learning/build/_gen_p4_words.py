import csv, json, sys, re
csv.field_size_limit(sys.maxsize)

# ---------- load frequency ranking (COCA-inclusive: wordfreq 'large') ----------
import wordfreq
print("loading COCA-inclusive frequency dict...")
FD = wordfreq.get_frequency_dict('en', wordlist='large')
RANK = {w: i for i, (w, _) in enumerate(sorted(FD.items(), key=lambda x: -x[1]))}
print("ranked words:", len(RANK))

# ---------- prior word sets (avoid duplicates) ----------
nawl = [w.strip() for w in open('build/nawl.txt', encoding='utf-8') if w.strip()]
ngsl = set(json.load(open('build/ngsl_rank.json', encoding='utf-8')).keys())
nawl_set = set(w.lower() for w in nawl)

import re as _re
def py_stems(w):
    out = {w}
    if _re.search(r'(ss|sh|ch|x|s)$', w): out.add(_re.sub(r'es$', '', w))
    out.add(_re.sub(r's$', '', w))
    out.add(_re.sub(r'ies$', 'y', w))
    out.add(_re.sub(r'ed$', '', w)); out.add(_re.sub(r'ed$', 'e', w))
    out.add(_re.sub(r'ing$', '', w)); out.add(_re.sub(r'ing$', 'e', w))
    return {x for x in out if x}

# All words (taught OR bare) from P1+P2+P3, plus their inflection stems. Phase 4
# must teach strictly-new vocabulary, so any candidate whose stem hits this set is
# rejected (this also removes basic NGSL function words / pronouns like "was",
# "are", "your" that are present as bare entries in the early packs).
def words_and_stems(fn, only_taught):
    try:
        d = json.load(open(fn, encoding='utf-8'))
    except Exception:
        return [], set()
    ws, st = [], set()
    for w in d['words']:
        if only_taught and not w.get('def'):
            continue
        lw = w['word'].lower()
        ws.append(lw); st |= py_stems(lw)
    return ws, st

taught_flat = []
taught_stems = set()
prior_all_stems = set()
for fn in ['content/freq-1k.json', 'content/freq-2k.json', 'content/freq-3k.json']:
    ws, st = words_and_stems(fn, True)
    taught_flat += ws
    taught_stems |= st
    _, st2 = words_and_stems(fn, False)
    prior_all_stems |= st2
taught_set = set(taught_flat)
print("prior taught words:", len(taught_set), "| prior taught stems:", len(taught_stems),
      "| all prior stems:", len(prior_all_stems))

# ---------- ECDICT ----------
ec = {}
with open('build/ecdict.csv', encoding='utf-8', errors='replace') as f:
    r = csv.DictReader(f)
    for row in r:
        w = row['word'].strip().lower()
        if w not in ec:
            ec[w] = row
print("ECDICT loaded", len(ec))

# ---------- phonetic / text normalization ----------
PHON_MAP = {'ә': 'ə', 'ɛ': 'e', 'ˌ': '', 'ʾ': ''}
def norm_phone(p):
    if not p: return ''
    for k, v in PHON_MAP.items(): p = p.replace(k, v)
    return p.strip()
def clean(s):
    return (s or '').replace('\r', ' ').replace('\n', ' ').strip()

POS_RE = re.compile(r'^\s*(?:\([^)]*\)\s*)?(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)', re.I)
ANY_POS_RE = re.compile(r'(?:^|[\s,;])(vt\.|vi\.|v\.|adj\.|adv\.|n\.|a\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)(?=\s|\.|$)', re.I)
ABBREV = {'n.': 'n.', 'v.': 'v.', 'vt.': 'v.', 'vi.': 'v.', 'adj.': 'adj.', 'a.': 'adj.', 'adv.': 'adv.',
          'prep.': 'prep.', 'conj.': 'conj.', 'int.': 'int.', 'abbr.': 'abbr.', 'art.': 'art.', 'pron.': 'pron.'}
DISCIPLINE_RE = re.compile(r'\[[^\]]*\]')

def detect_pos(s):
    if not s: return ''
    m = POS_RE.match(s)
    if m: return ABBREV.get(m.group(1).lower(), '')
    m2 = ANY_POS_RE.search(s)
    if m2: return ABBREV.get(m2.group(1).lower(), '')
    return ''

INLINE_POS_RE = re.compile(r'(?:^|[\s,，、])(vt\.|vi\.|v\.|n\.|adj\.|adv\.|prep\.|conj\.|int\.|abbr\.|art\.|pron\.)\s*')
def zh_def(s):
    s = (s or '').replace('\r', ' ').replace('\n', ' ').replace('\\n', ' ').replace('\t', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    if not s: return ''
    s = re.sub(r'^[a-zA-Z]+\.\s*', '', s).strip()
    s = DISCIPLINE_RE.sub('', s).strip()
    s = INLINE_POS_RE.sub('', s)
    s = re.sub(r'\s+', ' ', s).strip()
    parts = [p.strip() for p in s.split(',') if p.strip()]
    if not parts: return ''
    return ', '.join(parts[:2])[:60]

def en_def(s):
    s = (s or '').replace('\r', ' ').replace('\\n', '\n')
    if not s.strip(): return ''
    first = s.split('\n')[0].strip()
    m = POS_RE.match(first)
    if m: first = POS_RE.sub('', first, count=1).strip()
    first = DISCIPLINE_RE.sub('', first).strip()
    first = first.strip(' .;')
    first = re.sub(r'\s+', ' ', first).strip()
    if len(first) > 160:
        cut = re.split(r'(?<=[a-z])[;,)]', first)
        first = cut[0].strip()
        if len(first) > 160: first = first[:157].rsplit(' ', 1)[0]
    return first[:200]

pos_emoji = {'n.': '📦', 'v.': '🔧', 'adj.': '⭐', 'adv.': '⏩', 'prep.': '🔗', 'conj.': '🔗', 'int.': '💬', 'abbr.': '🔤'}

N_TEMPL = ("The {w} plays a key role in this area.", "We studied the {w} in detail.", "This {w} helps explain the result.")
V_TEMPL = ("Researchers {w} the data carefully.", "We need to {w} a clear answer.", "They {w} the samples before testing.")
ADJ_TEMPL = ("This is {art} {w} example of the method.", "The result is {w} and reliable.", "We chose {art} {w} approach to the problem.")
ADV_TEMPL = ("The value changes {w} over time.", "The process works {w} as expected.")
ZH_N = ("该{w}在这一领域起关键作用。", "我们详细研究了这个{w}。", "这个{w}有助于解释结果。")
ZH_V = ("研究人员仔细{w}了数据。", "我们需要{w}一个明确的答案。", "他们在测试前{w}了样本。")
ZH_ADJ = ("这是该方法一个{w}的例子。", "结果是{w}且可靠的。", "我们选用了{w}的方法。")
ZH_ADV = ("数值随时间{w}变化。", "过程如预期般{w}进行。")

RICH_N = (
 ("The {w} of the system was carefully documented.","该{w}的形成过程被仔细记录。"),
 ("We collected the {w} from multiple sources.","我们从多个来源收集了这个{w}。"),
 ("This {w} explains why the result changed.","这个{w}解释了结果为何改变。"),
 ("A clear {w} helps readers follow the argument.","清晰的{w}能帮助读者理解论点。"),
 ("The {w} between the two groups was significant.","两组之间的{w}非常显著。"),
 ("Our model depends on a single {w}.","我们的模型依赖一个核心{w}。"),
 ("The study reports a new {w} for daily use.","该研究报告了一个可日常使用的{w}。"),
 ("Teachers value this {w} in real classrooms.","教师在真实课堂中重视这个{w}。"),
)
RICH_V = (
 ("Scientists {w} the samples under strict conditions.","科学家在严格条件下{w}样本。"),
 ("We {w} the answer by comparing both methods.","我们通过比较两种方法{w}答案。"),
 ("The team will {w} the plan next semester.","团队将在下学期{w}该计划。"),
 ("Students {w} the text before writing the essay.","学生在写作前{w}文本。"),
 ("New tools let us {w} the problem faster.","新工具让我们更快速地{w}问题。"),
 ("They {w} evidence to support the claim.","他们{w}证据来支持这一主张。"),
 ("Researchers {w} a link between sleep and memory.","研究者{w}睡眠与记忆之间的关联。"),
 ("You can {w} the result with a simple test.","你可以用一个简单测试{w}结果。"),
)
RICH_ADJ = (
 ("This is {art} {w} idea worth testing.","这是一个值得验证的{w}想法。"),
 ("The {w} data confirmed our hypothesis.","{w}的数据证实了我们的假设。"),
 ("We need {art} {w} solution for the clinic.","我们需要一个适用于临床的{w}方案。"),
 ("Her {w} explanation made the topic clear.","她{w}的解释让主题变得清晰。"),
 ("A {w} method improves learning outcomes.","{w}的方法改善了学习成效。"),
 ("The result remained {w} across all trials.","结果在所有试验中保持{w}。"),
 ("That {w} design won the teaching award.","那个{w}设计赢得了教学奖项。"),
 ("We found {art} {w} pattern in the responses.","我们在回答中发现了一个{w}模式。"),
)
RICH_ADV = (
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
        if pos == 'v.':
            a, b = RICH_V[seed % len(RICH_V)]; return a.format(w=word), b.format(w=word), a.format(w=word)
        if pos == 'adj.':
            art = with_article(word)
            a, b = RICH_ADJ[seed % len(RICH_ADJ)]; return a.format(w=word, art=art), b.format(w=word), a.format(w=word, art=art)
        if pos == 'adv.':
            a, b = RICH_ADV[seed % len(RICH_ADV)]; return a.format(w=word), b.format(w=word), a.format(w=word)
        a, b = RICH_N[seed % len(RICH_N)]; return a.format(w=word), b.format(w=word), a.format(w=word)
    if pos == 'v.':
        a, b = V_TEMPL[seed % 3].format(w=word), ZH_V[seed % 3].format(w=word)
    elif pos == 'adj.':
        art = with_article(word)
        a = ADJ_TEMPL[seed % 3].format(w=word, art=art); b = ZH_ADJ[seed % 3].format(w=word)
    elif pos == 'adv.':
        a, b = ADV_TEMPL[seed % 2].format(w=word), ZH_ADV[seed % 2].format(w=word)
    else:
        a, b = N_TEMPL[seed % 3].format(w=word), ZH_N[seed % 3].format(w=word)
    return a, b, a

def has_ecdict_entry(w):
    row = ec.get(w.lower())
    if not row: return False
    if not (row.get('translation') or '').strip(): return False
    return True

def generate(w, seed, rich):
    row = ec.get(w.lower())
    if not row:
        for alt in [w + 's', w + 'es', w + 'ed', w + 'ing', (w[:-1] + 'ing' if w.endswith('e') else w + 'ing')]:
            if ec.get(alt.lower()): row = ec[alt.lower()]; break
    if not row:
        return ['', '', w, 'a term used in general English.', '', '', '', '📘']
    ph = norm_phone(clean(row['phonetic']))
    ipa = '/' + ph + '/' if ph else ''
    pos = clean(row['pos']) or detect_pos(row['definition']) or detect_pos(row['translation'])
    pos = ABBREV.get(pos.lower(), pos) if pos else ''
    if not pos:
        en_lead = en_def(row['definition']).lower()
        if en_lead.startswith('to ') or en_lead.startswith('an act') or en_lead.startswith('the act'):
            pos = 'v.'
        elif en_lead.startswith(('a. ', 'adj.', 'an ', 'the ', 'any ', 'some ')):
            pos = 'adj.' if en_lead.startswith(('a. ', 'adj.')) else 'n.'
        elif en_lead.startswith(('in a ', 'with ')):
            pos = 'adv.'
        else:
            pos = 'n.'
    zh = zh_def(row['translation'])
    en = en_def(row['definition'])
    if not zh: zh = '（通用英语词汇）'
    if not en: en = 'a term used in general English.'
    emoji = pos_emoji.get(pos, '📘')
    ex, exzh, exEn = make_examples(w, pos, seed, rich)
    return [ipa, pos, zh, en, ex, exzh, exEn, emoji]

# ---------- 1) NAWL tail (ranks 801-956) ----------
nawl_tail = nawl[800:956]
print("NAWL tail:", len(nawl_tail))

# ---------- 2) COCA band 3000-5000, clean base-form vocabulary ----------
# Scan the COCA-inclusive RANK, then normalize to base forms: if a word is an
# inflection of a real base word, use the base; if that base is already covered
# (NGSL/NAWL/taught) drop the inflection as redundant. The lemma is only
# accepted when it is itself a real word (in RANK with a dictionary entry),
# which avoids the truncated-stub garbage from trusting ECDICT alone.
BLOCK = set(['fuck','shit','damn','crap','ass','bitch','bastard','dick','piss','cock','slut',
             'whore','nigger','fag','cunt','hell','dammit','goddamn','jerk','prick','twat','wank',
             'bollocks','bugger','arse','freaking','frigging','screw','sex','porn','dickhead',
             'motherfucker','tits','boobs','wtf','lmao','omg',
             # proper nouns (countries / capitals / cities / surnames) — not useful B2 vocab
             'wales','england','london','paris','spain','italy','germany','france','canada',
             'mexico','brazil','russia','china','japan','korea','india','egypt','greece','turkey',
             'ireland','scotland','australia','africa','europe','america','asia','britain','berlin',
             'rome','madrid','tokyo','beijing','california','texas','florida','israel','iran','iraq',
             'manchester','hong','soviet','york','oxford','cambridge','dallas','houston','chicago',
             'boston','seattle','moscow','dublin','toronto','vancouver','montreal','shanghai','hongkong',
             # leaked vulgar / sensitive
             'bullshit','asshole','fuckin','suck','rape','racist','sexy',
             # leaked personal names
             'eric','jordan','miller','morgan','sarah','jimmy','lewis','matthew','gordon','roger',
             'ross','gary','charlie','billy','bruce','maria','robin','russell','johnny','duke','dan',
             'jan','saint','pope','bishop','angel','ford','chelsea','mac','mini',
             # leaked countries / cities / places
             'nigeria','syria','atlantic','singapore','melbourne','detroit','atlanta','wisconsin',
             'pennsylvania','philadelphia','columbia','liverpool','colorado','miami','sweden','zealand',
             'kong','hollywood','disney',
             # leaked brands / abbreviations / slang
             'microsoft','iphone','instagram','ceo','ltd','bro','nah','yep','tho','ups','vol','lets',
             'ages','https'])

def lemma_of(w):
    cands = []
    if w.endswith('ies'): cands.append(w[:-3] + 'y')
    if w.endswith('ing'): cands += [w[:-3], w[:-3] + 'e']
    if w.endswith('es'): cands.append(w[:-2])
    if w.endswith('ed'): cands += [w[:-2], w[:-1]]
    if w.endswith('s') and not w.endswith(('ss', 'us', 'is', 'os')): cands.append(w[:-1])
    for c in cands:
        if c in RANK and ec.get(c) and has_ecdict_entry(c):
            return c
    return None

# Clean-word filter: wordfreq 'large' and g10k both contain single-letter
# fragments ("d","t","la") and abbreviations ("http"). We reject those, keeping
# only real vocabulary words with a genuine dictionary entry.
ABBR = set(['http','www','html','ftp','url','pdf','jpg','png','gif','xml','json','csv',
            'zip','exe','api','lol','omg','wtf','idk','btw','tbh','dm','pm','am',
            'nfl','nba','fbi','cia','usa','uk','un','eu','tv','yo','ok','uh','aw','ah'])

def is_junk(w, row):
    if len(w) < 3: return True
    if w in ABBR: return True
    d = (row.get('definition') or '').lower()
    if 'letter of the roman alphabet' in d: return True
    if 'syllable naming' in d: return True
    tr = (row.get('translation') or '')
    # proper nouns (US states, place names, country names, personal names) are not
    # useful B2 vocabulary — reject by their ECDICT markers.
    if any(m in tr for m in ['州', '（地名', '（国名', '港市）', '（男子名', '（女子名',
                               '（姓氏', '（人名', '（...市）', '苏维埃', '苏联']):
        return True
    return False

raw = []
for w, rank in RANK.items():
    if rank < 2800: continue          # skip the basic/NGSL band (top ~2800)
    if not re.match(r'^[a-z]+$', w): continue
    if w in ngsl or w in nawl_set or w in taught_set or w in prior_all_stems: continue
    if w in BLOCK: continue
    row = ec.get(w)
    if not row or not (row.get('translation') or '').strip(): continue
    if is_junk(w, row): continue
    raw.append(w)

# Normalize to base forms: prefer the lemma only when the base itself passes
# every filter (including the rank floor). Otherwise keep the original word, so
# we never promote a basic word like "their" (rank 57) out of an inflection
# such as "theirs" (rank >= 2800).
chosen = set()
for w in raw:
    L = lemma_of(w)
    if L:
        lr = ec.get(L)
        ok = (L not in ngsl and L not in nawl_set and L not in taught_set
              and L not in prior_all_stems and L not in BLOCK and L not in ABBR
              and RANK.get(L, 9e9) >= 2800
              and lr and (lr.get('translation') or '').strip() and not is_junk(L, lr))
        if ok:
            w = L
    if w and w not in BLOCK and w not in ABBR and RANK.get(w, 9e9) >= 2800:
        chosen.add(w)
pool = sorted(chosen, key=lambda w: RANK[w])           # COCA-inclusive frequency order
coca_pick = pool[:644]
print("raw:", len(raw), "| chosen bases:", len(chosen), "| picked:", len(coca_pick))
# order: NAWL tail (by rank) then COCA (by frequency)
order = nawl_tail + coca_pick
print("total Phase 4 words:", len(order))

# rich = top 200 by COCA frequency among the 800 (most useful get richer examples)
freq_of = lambda w: RANK.get(w, 9e9)
rich_set = set(sorted(order, key=freq_of)[:200])

out = {}
for i, w in enumerate(order):
    rich = w in rich_set
    out[w] = generate(w, i, rich)

json.dump(out, open('build/p4_words_raw.json', 'w', encoding='utf-8'), ensure_ascii=False)
# tiny JS wrapper so _build_p4.js can require it like p3_words.js
open('build/p4_words.js', 'w', encoding='utf-8').write('module.exports = require("./p4_words_raw.json");\n')

real = sum(1 for v in out.values() if v[3] and v[3] != 'a term used in general English.')
zhok = sum(1 for v in out.values() if v[2] and v[2] != '（通用英语词汇）')
print('generated', len(out), '| with EN def:', real, '| with ZH def:', zhok)
print('NAWL tail:', len(nawl_tail), '| COCA:', len(coca_pick))
print('sample COCA:', coca_pick[:12])
