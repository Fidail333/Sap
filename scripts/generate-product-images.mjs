import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourcePath = path.resolve('content/custom/catalog.json');
const outputDir = path.resolve('public/assets/products/generated');

const { modules, displays } = JSON.parse(await readFile(sourcePath, 'utf8'));
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

function renderModuleSvg(product) {
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

  return `<?xml version="1.0" encoding="UTF-8"?>
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
}

function motifForDisplay(series) {
  if (series === 'SCIH1') return '<path d="M930 248 l25 42 h-18 l12 44 -42 -56 h20z" fill="#67e8f9" opacity="0.9"/><path d="M992 260 q40 24 0 48" stroke="#7dd3fc" stroke-width="5" fill="none"/><path d="M1010 260 q40 24 0 48" stroke="#86efac" stroke-width="5" fill="none"/>';
  if (series === 'SCIH2') return '<g stroke="#93c5fd" stroke-width="4" opacity="0.7"><line x1="915" y1="240" x2="1020" y2="240"/><line x1="915" y1="260" x2="1020" y2="260"/><line x1="915" y1="280" x2="1020" y2="280"/><line x1="915" y1="300" x2="1020" y2="300"/></g>';
  return '<path d="M965 238 l52 18 v38 c0 36 -28 56 -52 66 -24 -10 -52 -30 -52 -66 v-38z" fill="rgba(103,232,249,0.22)" stroke="#67e8f9" stroke-width="4"/><path d="M943 322 h44" stroke="#cbd5e1" stroke-width="3"/><path d="M987 322 h44" stroke="#cbd5e1" stroke-width="3"/>';
}

function renderDisplaySvg(product) {
  const frameW = 900;
  const frameH = product.product_type === 'all-in-one' ? 500 : 430;
  const x = (1200 - frameW) / 2;
  const y = 165;
  const dot = Math.max(1.2, 3.8 - product.pitch_mm * 1.4);
  const step = Math.max(7, 14 - product.pitch_mm * 2.8);

  const microDots = [];
  for (let dx = x + 70; dx < x + frameW - 70; dx += step) {
    for (let dy = y + 60; dy < y + frameH - 60; dy += step) {
      const alpha = 0.08 + (Math.sin(dx * 0.012 + dy * 0.01) + 1) * 0.08;
      microDots.push(`<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="${dot.toFixed(2)}" fill="rgba(125,211,252,${alpha.toFixed(3)})"/>`);
    }
  }

  const aioBadge = product.product_type === 'all-in-one' ? `<rect x="825" y="600" width="190" height="42" rx="10" fill="rgba(8,47,73,0.82)" stroke="rgba(125,211,252,0.45)"/><text x="920" y="627" text-anchor="middle" fill="#dbeafe" font-size="20" font-family="Inter,Arial,sans-serif">${product.screen_resolution ?? 'AIO'}</text>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#030712"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#334155" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="65%" stop-color="#0b1224"/>
      <stop offset="100%" stop-color="#0e1a32"/>
    </linearGradient>
    <linearGradient id="sapphire" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.12"/>
      <stop offset="55%" stop-color="#a5f3fc" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.12"/>
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#000" flood-opacity="0.6"/></filter>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <ellipse cx="600" cy="690" rx="360" ry="34" fill="rgba(15,23,42,0.65)" filter="url(#glow)"/>
  <g filter="url(#shadow)">
    <rect x="${x}" y="${y}" width="${frameW}" height="${frameH}" rx="28" fill="url(#frame)" stroke="rgba(226,232,240,0.25)" stroke-width="2"/>
    <rect x="${x + 26}" y="${y + 24}" width="${frameW - 52}" height="${frameH - 48}" rx="20" fill="url(#screen)"/>
    <rect x="${x + 28}" y="${y + 25}" width="${frameW - 56}" height="18" rx="9" fill="url(#sapphire)"/>
    ${microDots.join('')}
  </g>
  <rect x="180" y="640" width="390" height="56" rx="14" fill="rgba(2,6,23,0.72)" stroke="rgba(125,211,252,0.35)"/>
  <text x="375" y="675" text-anchor="middle" fill="#bae6fd" font-size="24" font-family="Inter,Arial,sans-serif">${product.series} • ${product.model}</text>
  ${aioBadge}
  ${motifForDisplay(product.series)}
</svg>`;
}

for (const product of modules) {
  const svg = renderModuleSvg(product);
  await writeFile(path.join(outputDir, `${product.id}.svg`), svg, 'utf8');
}

for (const product of displays) {
  const svg = renderDisplaySvg(product);
  await writeFile(path.join(outputDir, `${product.id}.svg`), svg, 'utf8');
}

console.log(`Generated ${modules.length + displays.length} product SVG files in ${outputDir}`);
