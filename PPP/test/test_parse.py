import zipfile, xml.etree.ElementTree as ET
z = zipfile.ZipFile('PPP/TWRP C3B2 - Procurement Package Plan.xlsx')

# Simulate what parseXlsx does
# 1. Read sharedStrings
ss_xml = z.read('xl/sharedStrings.xml')
# Parse shared strings
siRe = '<si>([\s\S]*?)<\/si>'
import re
si_list = re.findall(siRe, ss_xml.decode())
shared = []
for inner in si_list:
    tRe = '<t[^>]*>([\s\S]*?)<\/t>'
    txt = ''.join(re.findall(tRe, inner))
    shared.append(txt)
print(f'shared strings parsed: {len(shared)}')

# 2. Read workbook.xml
wb_xml = z.read('xl/workbook.xml').decode()
# Parse sheets
sheetRe = r'<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"'
import re
sheets = re.findall(sheetRe, wb_xml)
print(f'Sheets found: {sheets}')

# 3. Read relationships
rels_xml = z.read('xl/_rels/workbook.xml.rels').decode()
relRe = r'<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"'
rels = re.findall(relRe, rels_xml)
relMap = {r[0]: r[1] for r in rels}
print(f'Relationships: {relMap}')

# 4. Build sheet map
sheetMap = {}
for name, rid in sheets:
    target = relMap.get(rid, '')
    if target:
        if target.startswith('/'):
            target = target[1:]
        elif not target.startswith('xl/'):
            target = 'xl/' + target.replace('./','')
    sheetMap[name] = target
    print(f'  {name} -> {target}')

# 5. Check if files exist in ZIP
for name, path in sheetMap.items():
    exists = path in z.namelist()
    print(f'  {name} ({path}): {"EXISTS" if exists else "MISSING"}')