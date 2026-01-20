import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createIcon(width, height, filename) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" rx="${width * 0.1}" />
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${height * 0.5}" text-anchor="middle" dominant-baseline="middle" fill="#22c55e">💪</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(filename);
}

async function createIcons() {
  console.log('Creating icon files...');

  await createIcon(192, 192, path.join(__dirname, 'public', 'icons', 'icon-192.png'));
  await createIcon(512, 512, path.join(__dirname, 'public', 'icons', 'icon-512.png'));

  console.log('Icons created successfully!');
}

createIcons().catch(console.error);