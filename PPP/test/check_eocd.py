import zipfile
z = zipfile.ZipFile('PPP/TWRP C3B2 - Procurement Package Plan.xlsx')

# Check EOCD and central directory manually
import struct
data = open('PPP/TWRP C3B2 - Procurement Package Plan.xlsx', 'rb').read()
bytes_data = bytearray(data)

# Find EOCD signature (0x06054b50)
EOCD_SIG = 0x06054b50
eocd = -1
for i in range(len(bytes_data)-22, max(0, len(bytes_data)-65558), -1):
    if bytes_data[i] == 0x50 and bytes_data[i+1] == 0x4B and bytes_data[i+2] == 0x05 and bytes_data[i+3] == 0x06:
        eocd = i
        break

print(f'EOCD found at offset: {eocd}')
if eocd >= 0:
    dv = memoryview(bytes_data)
    cd_count = struct.unpack('<H', dv[eocd+10:eocd+12])[0]
    cd_offset = struct.unpack('<I', dv[eocd+16:eocd+20])[0]
    print(f'Central dir count: {cd_count}')
    print(f'Central dir offset: {cd_offset}')
    
    # Parse central directory entries
    p = cd_offset
    entries = []
    for i in range(cd_count):
        if struct.unpack('<I', dv[p:p+4])[0] != 0x02014b50:
            print(f'  Entry {i}: Invalid signature at offset {p}')
            break
        comp_method = struct.unpack('<H', dv[p+10:p+12])[0]
        comp_size = struct.unpack('<I', dv[p+20:p+24])[0]
        fname_len = struct.unpack('<H', dv[p+28:p+30])[0]
        extra_len = struct.unpack('<H', dv[p+30:p+32])[0]
        comment_len = struct.unpack('<H', dv[p+32:p+34])[0]
        local_offset = struct.unpack('<I', dv[p+42:p+46])[0]
        name = dv[p+46:p+46+fname_len].tobytes().decode('utf-8')
        entries.append((name, comp_method, comp_size, local_offset))
        print(f'  Entry {i}: {name} method={comp_method} comp_size={comp_size} local_offset={local_offset}')
        p += 46 + fname_len + extra_len + comment_len
    
    print(f'\nTotal entries found: {len(entries)}')
    for name, method, size, offset in entries:
        if 'worksheet' in name or 'shared' in name:
            print(f'  IMPORTANT: {name} method={method} offset={offset}')