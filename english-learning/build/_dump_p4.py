import json
d=json.load(open('build/p4_words_raw.json',encoding='utf-8'))
words=list(d.keys())
nawl_tail=words[:156]
coca=words[156:]
# print COCA words grouped, with pos, for easy selection
with open('build/_p4_list.txt','w',encoding='utf-8') as f:
    f.write("=== NAWL TAIL (156) ===\n")
    for w in nawl_tail: f.write(f"{w}\t{d[w][1]}\n")
    f.write("\n=== COCA (644) ===\n")
    for w in coca: f.write(f"{w}\t{d[w][1]}\n")
print("wrote build/_p4_list.txt with", len(words), "words")
