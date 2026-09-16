import zipfile
z = zipfile.ZipFile('PPP/TWRP C3B2 - Procurement Package Plan.xlsx')
ss = z.read('xl/sharedStrings.xml')
print(f'sharedStrings.xml length: {len(ss)} bytes')
wb = z.read('xl/workbook.xml')
print(f'workbook.xml: {wb.decode()[:500]}')