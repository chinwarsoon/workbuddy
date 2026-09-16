import zipfile
z = zipfile.ZipFile('PPP/TWRP C3B2 - Procurement Package Plan.xlsx')
for info in z.infolist():
    if 'worksheet' in info.filename or 'sharedStrings' in info.filename:
        print(f'{info.filename}: compress_type={info.compress_type} (0=stored, 8=deflate), file_size={info.file_size}, compress_size={info.compress_size}')