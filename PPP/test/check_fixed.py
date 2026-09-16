import zipfile, struct
z = zipfile.ZipFile('PPP/TWRP C3B2 - Procurement Package Plan_fixed.xlsx')
for info in z.infolist():
    if 'worksheet' in info.filename or 'sharedStrings' in info.filename:
        print(f'{info.filename}: compress_type={info.compress_type}, file_size={info.file_size}, compress_size={info.compress_size}')

# Check EOCD
data = open('PPP/TWRP C3B2 - Procurement Package Plan_fixed.xlsx', 'rb').read()
bytes_data = bytearray(data)
EOCD_SIG = 0x06054b50
eocd = -1
for i in range(len(bytes_data)-22, max(0, len(bytes_data)-65558), -1):
    if bytes_data[i] == 0x50 and bytes_data[i+1] == 0x4B and bytes_data[i+2] == 0x05 and bytes_data[i+3] == 0x06:
        eocd = i
        break
print(f'EOCD at: {eocd}')
if eocd >= 0:
    dv = memoryview(bytes_data)
    cd_count = struct.unpack('<H', dv[eocd+10:eocd+12])[0]
    cd_offset = struct.unpack('<I', dv[eocd+16:eocd+20])[0]
    print(f'CD count: {cd_count}, offset: {cd_offset}')
    p = cd_offset
    for i in range(cd_count):
        if struct.unpack('<I', dv[p:p+4])[0] != 0x02014b50:
            break
        comp_method = struct.unpack('<H', dv[p+10:p+12])[0]
        comp_size = struct.unpack('<I', dv[p+20:p+24])[0]
        fname_len = struct.unpack('<H', dv[p+28:p+30])[0]
        extra_len = struct.unpack('<H', dv[p+30:p+32])[0]
        comment_len = struct.unpack('<H', dv[p+32:p+34])[0]
        local_offset = struct.unpack('<I', dv[p+42:p+46])[0]
        name = dv[p+46:p+46+fname_len].tobytes().decode('utf-8')
        if 'worksheet' in name or 'shared' in name:
            print(f'  {name} method={comp_method} offset={local_offset}')
        p += 46 + fname_len + extra_len + comment_len