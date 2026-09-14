const fs = require('fs');
const path = require('path');

const dir = path.join('d:', 'portofolio_new', 'public', 'gallery');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const buf = fs.readFileSync(path.join(dir, file));
  // PNG signature is 8 bytes, IHDR chunk is 4 (length) + 4 (type) + 13 (data)
  // Width is 4 bytes at offset 16, Height is 4 bytes at offset 20
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const type = width > height ? 'landscape' : 'portrait';
  console.log(`${file}: ${width}x${height} - ${type}`);
}
