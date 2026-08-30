import csv, sys
csv.field_size_limit(sys.maxsize)
want={'francisco','sydney','manchester','wilson','hong','soviet','irish','ages','anniversary','deaths','depends','drawn','fees','hidden','invited','letting','marine','officially','pounds','princess','puts','regions','represented','seats','stayed','suffering','tries','wondering'}
with open('build/ecdict.csv',encoding='utf-8',errors='replace') as f:
    for row in csv.DictReader(f):
        w=row['word'].strip().lower()
        if w in want:
            print(w, "| pos=",repr(row['pos']), "| tr=",repr((row['translation'] or '')[:60]))
