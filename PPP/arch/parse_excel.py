import zipfile
import xml.etree.ElementTree as ET
import re

def col_to_idx(ref):
    """Convert Excel column ref (A, Z, AA) to 0-based index"""
    letters = re.match(r'[A-Z]+', ref).group()
    idx = 0
    for ch in letters:
        idx = idx * 26 + (ord(ch) - 64)
    return idx - 1

with zipfile.ZipFile('TWRP C3B2 - Procurement Package Plan.xlsx', 'r') as z:
    print('=== ZIP Contents ===')
    for name in z.namelist():
        print(f'  {name}')
    
    # Read workbook.xml
    wb_xml = z.read('xl/workbook.xml')
    root = ET.fromstring(wb_xml)
    ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    sheets = root.findall('.//main:sheet', ns)
    print('\n=== Sheets ===')
    sheet_map = {}
    for s in sheets:
        name = s.get('name')
        rid = s.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
        print(f'  Name: "{name}", r:id: {rid}')
        sheet_map[name] = rid
    
    # Read rels to get sheet paths
    rels_xml = z.read('xl/_rels/workbook.xml.rels')
    rels_root = ET.fromstring(rels_xml)
    rel_ns = {'rel': 'http://schemas.openxmlformats.org/package/2006/relationships'}
    rel_map = {}
    for rel in rels_root.findall('rel:Relationship', rel_ns):
        rel_map[rel.get('Id')] = rel.get('Target')
    
    print('\n=== Sheet Paths ===')
    for name, rid in sheet_map.items():
        target = rel_map.get(rid, '')
        if target.startswith('/'):
            target = target[1:]
        elif not target.startswith('xl/'):
            target = 'xl/' + target.replace('./', '')
        print(f'  "{name}" -> {target}')
        sheet_map[name] = target
    
    # Find code sheet
    code_sheet_name = None
    ppp_sheet_name = None
    for name in sheet_map:
        if 'code' in name.lower():
            code_sheet_name = name
        if 'ppp' in name.lower():
            ppp_sheet_name = name
    
    print(f'\nCode sheet: {code_sheet_name}')
    print(f'PPP sheet: {ppp_sheet_name}')
    
    # Read shared strings
    shared_strings = []
    try:
        ss_xml = z.read('xl/sharedStrings.xml')
        ss_root = ET.fromstring(ss_xml)
        for si in ss_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            t = si.find('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
            shared_strings.append(t.text if t is not None else '')
    except:
        pass
    
    # Parse a sheet
    def parse_sheet(sheet_path):
        xml = z.read(sheet_path)
        root = ET.fromstring(xml)
        ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        rows = {}
        for row_elem in root.findall('.//main:row', ns):
            r = int(row_elem.get('r'))
            row_data = {}
            for c in row_elem.findall('main:c', ns):
                ref = c.get('r')
                col_idx = col_to_idx(ref)
                t_attr = c.get('t')
                v_elem = c.find('main:v', ns)
                if v_elem is not None:
                    val = v_elem.text
                    if t_attr == 's' and val.isdigit():
                        val = shared_strings[int(val)] if int(val) < len(shared_strings) else val
                    row_data[col_idx] = val
            rows[r] = row_data
        # Convert to grid
        max_row = max(rows.keys()) if rows else 0
        max_col = max((max(r.keys()) for r in rows.values()), default=0)
        grid = []
        for r in range(1, max_row + 1):
            row_arr = [None] * (max_col + 1)
            if r in rows:
                for c, v in rows[r].items():
                    row_arr[c] = v
            grid.append(row_arr)
        return grid
    
    # Parse code sheet
    if code_sheet_name:
        print(f'\n=== Code Sheet: {code_sheet_name} ===')
        code_grid = parse_sheet(sheet_map[code_sheet_name])
        for i, row in enumerate(code_grid):
            if row[0] is not None or (len(row) > 1 and row[1] is not None):
                print(f'  Row {i+1}: A="{row[0]}"  B="{row[1] if len(row) > 1 else ""}"')
    
    # Parse PPP sheet header row
    if ppp_sheet_name:
        print(f'\n=== PPP Sheet: {ppp_sheet_name} (first 3 rows) ===')
        ppp_grid = parse_sheet(sheet_map[ppp_sheet_name])
        for i, row in enumerate(ppp_grid[:3]):
            vals = [str(v) if v is not None else '' for v in row[:20]]
            print(f'  Row {i+1}: {vals}')