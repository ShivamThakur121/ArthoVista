import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const emblemBuf = fs.readFileSync(path.join(rootDir, 'public', 'logo-emblem.png'));
const base64 = emblemBuf.toString('base64');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${base64}" x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet" />
</svg>`;

fs.writeFileSync(path.join(rootDir, 'public', 'favicon.svg'), svg, 'utf-8');
fs.writeFileSync(path.join(rootDir, 'public', 'favicon.ico'), emblemBuf);
fs.writeFileSync(path.join(rootDir, 'public', 'favicon.png'), emblemBuf);

console.log('✅ Updated favicon.svg, favicon.ico, and favicon.png successfully!');
