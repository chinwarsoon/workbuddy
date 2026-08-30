import json, re
d=json.load(open('build/p4_words_raw.json',encoding='utf-8'))
words=list(d.keys())
print("COCA first 40:", words[156:196])
sus=[w for w in words if re.search(r'(州|（地名|（国)', (d[w][2] or ''))]
print("proper-noun suspects:", sus)
# show a few sample entries to eyeball quality
for w in words[156:166]:
    e=d[w]
    print(w, e[1], "| zh:", e[2], "| en:", e[3][:60], "| ex:", e[4][:50])
