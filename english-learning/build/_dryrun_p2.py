import csv, json, sys, re
csv.field_size_limit(sys.maxsize)
DIR="C:/Users/frank/WorkBuddy/workbuddy/english-learning"

# 1) load ECDICT exactly like the generator
ec={}
with open(DIR+'/build/ecdict.csv',encoding='utf-8',errors='replace') as f:
    for row in csv.DictReader(f):
        w=row['word'].strip().lower()
        if w not in ec: ec[w]=row
print("ECDICT loaded", len(ec))

def has_real(row):
    # a "full explanation" = ECDICT gives a non-empty ZH translation AND EN definition
    zh=(row.get('translation') or '').strip()
    en=(row.get('definition') or '').strip()
    return bool(zh) and bool(en)

# 2) P2 word list from the actual pack
p2=json.load(open(DIR+'/content/freq-2k.json',encoding='utf-8'))
words=[w['word'] for w in p2['words'] if w.get('word')]
cur_def=sum(1 for w in p2['words'] if w.get('def'))
print("P2 total entries:", len(words), "| currently with def:", cur_def)

# 3) simulate the generator lookup (base + simple inflections)
ALTS=lambda w:[w+'s',w+'es',w+'ed',w+'ing',(w[:-1]+'ing' if w.endswith('e') else w+'ing')]
real=0; fillable_new=0; already=0; miss=[]
for w in words:
    row=ec.get(w.lower())
    if not row:
        for a in ALTS(w):
            if ec.get(a.lower()): row=ec[a.lower()]; break
    if row and has_real(row):
        real+=1
        if w in [x['word'] for x in p2['words'] if x.get('def')]:
            already+=1
        else:
            fillable_new+=1
    else:
        miss.append(w)

print("After ECDICT backfill:")
print("  entries that WILL have a real ZH+EN explanation:", real)
print("  of those, currently already had def:", already)
print("  newly filled by backfill:", fillable_new)
print("  entries with NO ECDICT coverage (would need placeholder):", len(words)-real)
print("  -> real-def coverage:", round(100*real/len(words),1), "%")
if miss:
    print("  miss sample:", miss[:25])
