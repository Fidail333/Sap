import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourcePath = path.resolve('content/custom/products.json');
const outputDir = path.resolve('public/assets/products/generated');

const { products } = JSON.parse(await import('node:fs/promises').then((fs) => fs.readFile(sourcePath, 'utf8')));
await mkdir(outputDir, { recursive: true });

function sizeRatio(size) {
  if (!size) return { w: 1, h: 1 };
  const [w, h] = size.split('x').map(Number);
  if (!w || !h) return { w: 1, h: 1 };
  const max = Math.max(w, h);
  return { w: w / max, h: h / max };
}

function diodeSpacing(pitch) {
  return Math.max(8, Math.min(32, Math.round(pitch * 4.6)));
}

for (const product of products) {
  const { w, h } = sizeRatio(product.size_mm);
  const panelW = 700 * w + 180;
  const panelH = 500 * h + 150;
  const x = (1200 - panelW) / 2;
  const y = (900 - panelH) / 2 - 20;
  const spacing = diodeSpacing(product.pitch_mm);
  const isOutdoor = product.environment === 'outdoor';
  const curve = product.is_flexible ? 25 : 0;
  const finish = product.tech.includes('COB') ? 'url(#finishCob)' : product.tech.includes('GOB') ? 'url(#finishGob)' : 'url(#finishSmd)';
  const label = `${product.scan ?? '—'} • ${product.refresh_hz ?? '—'}Hz`;

  const dots = [];
  for (let dx = x + 24; dx < x + panelW - 24; dx += spacing) {
    for (let dy = y + 24; dy < y + panelH - 24; dy += spacing) {
      const alpha = 0.2 + (Math.sin(dx * 0.018 + dy * 0.013) + 1) * 0.2;
      dots.push(`<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="2.2" fill="rgba(34,211,238,${alpha.toFixed(3)})"/>`);
    }
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${isOutdoor ? '#111827' : '#0b1120'}"/>
      <stop offset="100%" stop-color="${isOutdoor ? '#1f2937' : '#020617'}"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <pattern id="finishGob" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill="rgba(148,163,184,0.08)"/>
      <circle cx="6" cy="6" r="2" fill="rgba(148,163,184,0.18)"/>
    </pattern>
    <pattern id="finishCob" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill="rgba(34,211,238,0.06)"/>
      <rect x="1" y="1" width="8" height="8" rx="2" fill="rgba(34,211,238,0.15)"/>
    </pattern>
    <pattern id="finishSmd" width="14" height="14" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill="rgba(148,163,184,0.06)"/>
      <rect x="2" y="2" width="4" height="4" fill="rgba(56,189,248,0.2)"/>
      <rect x="8" y="8" width="4" height="4" fill="rgba(56,189,248,0.15)"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect x="40" y="40" width="1120" height="820" rx="28" fill="none" stroke="rgba(148,163,184,0.22)" stroke-width="2"/>
  <g filter="url(#shadow)" transform="skewX(${curve * -0.08})">
    <rect x="${x}" y="${y}" width="${panelW}" height="${panelH}" rx="28" fill="url(#panel)" stroke="rgba(148,163,184,0.45)" stroke-width="3"/>
    <rect x="${x + 10}" y="${y + 10}" width="${panelW - 20}" height="${panelH - 20}" rx="22" fill="${finish}" opacity="0.8"/>
    ${dots.join('')}
  </g>
  <rect x="450" y="780" width="300" height="56" rx="14" fill="rgba(2,6,23,0.75)" stroke="rgba(34,211,238,0.35)"/>
  <text x="600" y="815" text-anchor="middle" fill="#a5f3fc" font-size="22" font-family="Inter,Arial,sans-serif">${label}</text>
</svg>`;

  await writeFile(path.join(outputDir, `${product.id}.svg`), svg, 'utf8');
}

console.log(`Generated ${products.length} product SVG files in ${outputDir}`);
