import zipfile, xml.etree.ElementTree as ET
z = zipfile.ZipFile('PPP/TWRP C3B2 - Procurement Package Plan.xlsx')
ss_xml = z.read('xl/sharedStrings.xml')
root = ET.fromstring(ss_xml)
ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
si = root.findall('.//main:si', ns)
print(f'sharedStrings count: {len(si)}')
for i, s in enumerate(si[:10]):
    t = s.find('.//main:t', ns)
    print(f'  [{i}] {t.text if t is not None else "(empty)"}')