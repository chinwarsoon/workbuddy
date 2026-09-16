import zipfile, xml.etree.ElementTree as ET
z = zipfile.ZipFile('PPP/TWRP C3B2 - Procurement Package Plan.xlsx')
rels_xml = z.read('xl/_rels/workbook.xml.rels')
root = ET.fromstring(rels_xml)
ns = {'rel': 'http://schemas.openxmlformats.org/package/2006/relationships'}
for rel in root.findall('.//rel:Relationship', ns):
    rid = rel.get('Id')
    rtype = rel.get('Type')
    target = rel.get('Target')
    print(f'Id={rid} Type={rtype} Target={target}')

# Check sheet XML files
for name in ['sheet1.xml', 'sheet2.xml', 'sheet3.xml']:
    xml = z.read(f'xl/worksheets/{name}')
    root = ET.fromstring(xml)
    ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    dim = root.find('.//main:dimension', ns)
    print(f'{name}: dimension={dim.get("ref") if dim is not None else "none"}')
    # count rows
    sd = root.find('.//main:sheetData', ns)
    if sd is not None:
        rows = len(list(sd))
        print(f'{name}: row count={rows}')
    else:
        print(f'{name}: NO sheetData')
EOF