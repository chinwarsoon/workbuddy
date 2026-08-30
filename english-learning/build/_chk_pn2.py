import json, re
d=json.load(open('build/p4_words_raw.json',encoding='utf-8'))
words=list(d.keys())[156:]
mark=['州','（地名','（国名','港市）','（男子名','（女子名','（姓氏','（人名','苏维埃','苏联']
bad=[(w,d[w][2]) for w in words if any(m in (d[w][2] or '') for m in mark)]
print("marker-based proper nouns left:", len(bad))
for w,t in bad[:30]: print("  ",w,t[:40])
print("first 25 COCA:", words[:25])
