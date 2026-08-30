import json, csv, sys
csv.field_size_limit(sys.maxsize)
d=json.load(open('build/p4_words_raw.json',encoding='utf-8'))
words=list(d.keys())[156:]
bad_words={'bullshit','asshole','fuckin','suck','rape','racist','sexy','eric','nigeria','syria','hollywood','microsoft','iphone'}
left=[w for w in words if w in bad_words]
print("explicit bad left:", left)
ec={}
for row in csv.DictReader(open('build/ecdict.csv',encoding='utf-8',errors='replace')):
    ec[row['word'].strip().lower()]=row
mark=['（男子名','（女子名','（人名','（姓氏','（地名','（国名','港市）','州','苏维埃','苏联','（神）','教皇','爵士']
flag=[(w,(ec.get(w,{}).get('translation') or '')[:30]) for w in words if any(m in (ec.get(w,{}).get('translation') or '') for m in mark)]
print("marker-flagged left:", len(flag))
for w,t in flag[:40]: print("  ",w,t)
