/**
 * Generates a proper .ico file containing 16x16, 32x32, and 48x48
 * PNG-compressed images, using sharp for resizing.
 *
 * Usage: node scripts/png-to-ico.mjs <input> <output.ico>
 */
import { readFileSync, writeFileSync } from 'fs';
import sharp from 'sharp';

const inputPath = process.argv[2];
const icoPath   = process.argv[3];

if (!inputPath || !icoPath) {
  console.error('Usage: node scripts/png-to-ico.mjs <input> <output.ico>');
  process.exit(1);
}

const sizes = [16, 32, 48];

// Resize each size to a PNG buffer using sharp
const pngBuffers = await Promise.all(
  sizes.map(size =>
    sharp(inputPath)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toBuffer()
  )
);

// Build ICO binary
// ICONDIR header: 6 bytes
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);              // Reserved
header.writeUInt16LE(1, 2);              // Type: 1 = ICO
header.writeUInt16LE(sizes.length, 4);  // Count

const headerSize    = 6;
const entrySize     = 16;
const directorySz   = headerSize + entrySize * sizes.length;

// Calculate offsets
const offsets = [];
let offset = directorySz;
for (const buf of pngBuffers) {
  offsets.push(offset);
  offset += buf.length;
}

// Build ICONDIRENTRY for each size
const entries = pngBuffers.map((buf, i) => {
  const size = sizes[i];
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);  // Width  (0 = 256)
  entry.writeUInt8(size === 256 ? 0 : size, 1);  // Height
  entry.writeUInt8(0, 2);                         // ColorCount
  entry.writeUInt8(0, 3);                         // Reserved
  entry.writeUInt16LE(1, 4);                      // Planes
  entry.writeUInt16LE(32, 6);                     // BitCount
  entry.writeUInt32LE(buf.length, 8);             // SizeInBytes
  entry.writeUInt32LE(offsets[i], 12);            // FileOffset
  return entry;
});

const ico = Buffer.concat([header, ...entries, ...pngBuffers]);
writeFileSync(icoPath, ico);

console.log(`✓ Created ${icoPath} with sizes: ${sizes.join(', ')}px (${ico.length} bytes total)`);
