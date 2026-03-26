/**
 * CSS Deduplication & Consolidation Script
 * Removes duplicate selectors, consolidates media queries, keeps last definition wins.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';

const CSS_PATH = resolve('src/index.css');
const BACKUP_PATH = resolve('src/index.css.bak');

// Backup first
copyFileSync(CSS_PATH, BACKUP_PATH);
console.log('✅ Backup created at index.css.bak');

let css = readFileSync(CSS_PATH, 'utf-8');
const originalSize = css.length;
const originalLines = css.split('\n').length;

// ═══ PHASE 1: Remove exact duplicate @keyframes (keep last) ═══
const keyframeNames = new Map(); // name -> [{ start, end, content }]
const keyframeRegex = /@keyframes\s+([\w-]+)\s*\{/g;
let match;
while ((match = keyframeRegex.exec(css)) !== null) {
  const name = match[1];
  const start = match.index;
  // Find matching closing brace
  let depth = 0;
  let i = css.indexOf('{', start);
  for (; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }
  const end = i + 1;
  const content = css.substring(start, end);
  if (!keyframeNames.has(name)) keyframeNames.set(name, []);
  keyframeNames.get(name).push({ start, end, content });
}

// Remove all but last occurrence of each keyframe
const keyframeRemovals = [];
for (const [name, occurrences] of keyframeNames) {
  if (occurrences.length > 1) {
    console.log(`  🔄 @keyframes ${name}: ${occurrences.length} definitions → keeping last`);
    // Remove all except the last one
    for (let i = 0; i < occurrences.length - 1; i++) {
      keyframeRemovals.push(occurrences[i]);
    }
  }
}

// Sort removals by start position descending (so we can remove from end first)
keyframeRemovals.sort((a, b) => b.start - a.start);
for (const removal of keyframeRemovals) {
  css = css.substring(0, removal.start) + css.substring(removal.end);
}
console.log(`✅ Removed ${keyframeRemovals.length} duplicate @keyframes blocks`);

// ═══ PHASE 2: Remove duplicate top-level selectors (keep last) ═══
// Parse simple selectors (not inside @media etc.)
const duplicateSelectors = [
  '.glass',
  '.glass-ultra', 
  '.glass-premium',
  '.glass-strong',
  '.neon-glow',
  '.morph-blob',
  '.text-reveal',
  '.mesh-animated',
  '.badge-pulse',
  '.frosted-panel',
  '.electric-pulse',
  '.dot-pulse',
  '.holographic',
  '.card-3d-shadow',
  '.card-3d-shadow:hover',
  '.noise-overlay::after',
  '.cursor-blink',
  '.cyber-scan::after',
  '.float-animation',
  '.border-flow',
];

for (const selector of duplicateSelectors) {
  const escapedSel = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match the selector at start of line (not inside @media)
  const regex = new RegExp(`^${escapedSel}\\s*\\{`, 'gm');
  const matches = [];
  let m;
  while ((m = regex.exec(css)) !== null) {
    // Check if inside @media by counting unmatched { before this position
    const before = css.substring(0, m.index);
    let depth = 0;
    for (const ch of before) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth === 0) { // Only top-level selectors
      const start = m.index;
      let d = 0;
      let i = css.indexOf('{', start);
      for (; i < css.length; i++) {
        if (css[i] === '{') d++;
        else if (css[i] === '}') { d--; if (d === 0) break; }
      }
      matches.push({ start, end: i + 1 });
    }
  }
  if (matches.length > 1) {
    console.log(`  🔄 ${selector}: ${matches.length} definitions → keeping last`);
    // Remove all but last, from end
    for (let i = matches.length - 2; i >= 0; i--) {
      css = css.substring(0, matches[i].start) + css.substring(matches[i].end);
    }
  }
}

// ═══ PHASE 3: Remove duplicate scrollbar definitions (keep last) ═══
// Find all ::-webkit-scrollbar blocks at top level
const scrollbarSelectors = [
  '::-webkit-scrollbar',
  '::-webkit-scrollbar-track', 
  '::-webkit-scrollbar-thumb',
  '::-webkit-scrollbar-thumb:hover',
];

for (const sel of scrollbarSelectors) {
  const escapedSel = sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedSel}\\s*\\{`, 'gm');
  const matches = [];
  let m;
  while ((m = regex.exec(css)) !== null) {
    const before = css.substring(0, m.index);
    let depth = 0;
    for (const ch of before) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth === 0) {
      const start = m.index;
      let d = 0;
      let i = css.indexOf('{', start);
      for (; i < css.length; i++) {
        if (css[i] === '{') d++;
        else if (css[i] === '}') { d--; if (d === 0) break; }
      }
      matches.push({ start, end: i + 1 });
    }
  }
  if (matches.length > 1) {
    console.log(`  🔄 ${sel}: ${matches.length} definitions → keeping last`);
    for (let i = matches.length - 2; i >= 0; i--) {
      css = css.substring(0, matches[i].start) + css.substring(matches[i].end);
    }
  }
}

// ═══ PHASE 4: Remove duplicate ::selection ═══
{
  const regex = /^::selection\s*\{/gm;
  const matches = [];
  let m;
  while ((m = regex.exec(css)) !== null) {
    const before = css.substring(0, m.index);
    let depth = 0;
    for (const ch of before) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth === 0) {
      const start = m.index;
      let d = 0;
      let i = css.indexOf('{', start);
      for (; i < css.length; i++) {
        if (css[i] === '{') d++;
        else if (css[i] === '}') { d--; if (d === 0) break; }
      }
      matches.push({ start, end: i + 1 });
    }
  }
  if (matches.length > 1) {
    console.log(`  🔄 ::selection: ${matches.length} → keeping last`);
    for (let i = matches.length - 2; i >= 0; i--) {
      css = css.substring(0, matches[i].start) + css.substring(matches[i].end);
    }
  }
}

// ═══ PHASE 5: Remove duplicate :focus-visible ═══
{
  const regex = /^:focus-visible\s*\{/gm;
  const matches = [];
  let m;
  while ((m = regex.exec(css)) !== null) {
    const before = css.substring(0, m.index);
    let depth = 0;
    for (const ch of before) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth === 0) {
      const start = m.index;
      let d = 0;
      let i = css.indexOf('{', start);
      for (; i < css.length; i++) {
        if (css[i] === '{') d++;
        else if (css[i] === '}') { d--; if (d === 0) break; }
      }
      matches.push({ start, end: i + 1 });
    }
  }
  if (matches.length > 1) {
    console.log(`  🔄 :focus-visible: ${matches.length} → keeping last`);
    for (let i = matches.length - 2; i >= 0; i--) {
      css = css.substring(0, matches[i].start) + css.substring(matches[i].end);
    }
  }
}

// ═══ PHASE 6: Remove duplicate `img` rules ═══
{
  const regex = /^img\s*\{/gm;
  const matches = [];
  let m;
  while ((m = regex.exec(css)) !== null) {
    const before = css.substring(0, m.index);
    let depth = 0;
    for (const ch of before) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth === 0) {
      const start = m.index;
      let d = 0;
      let i = css.indexOf('{', start);
      for (; i < css.length; i++) {
        if (css[i] === '{') d++;
        else if (css[i] === '}') { d--; if (d === 0) break; }
      }
      matches.push({ start, end: i + 1 });
    }
  }
  if (matches.length > 1) {
    console.log(`  🔄 img: ${matches.length} → keeping last`);
    for (let i = matches.length - 2; i >= 0; i--) {
      css = css.substring(0, matches[i].start) + css.substring(matches[i].end);
    }
  }
}

// ═══ PHASE 7: Remove duplicate @property --angle ═══
{
  const regex = /@property\s+--angle\s*\{/g;
  const matches = [];
  let m;
  while ((m = regex.exec(css)) !== null) {
    const start = m.index;
    let d = 0;
    let i = css.indexOf('{', start);
    for (; i < css.length; i++) {
      if (css[i] === '{') d++;
      else if (css[i] === '}') { d--; if (d === 0) break; }
    }
    matches.push({ start, end: i + 1 });
  }
  if (matches.length > 1) {
    console.log(`  🔄 @property --angle: ${matches.length} → keeping last`);
    for (let i = matches.length - 2; i >= 0; i--) {
      css = css.substring(0, matches[i].start) + css.substring(matches[i].end);
    }
  }
}

// ═══ PHASE 8: Remove duplicate `* { scrollbar-width/scrollbar-color }` ═══
// These are `* {` blocks with scrollbar styling
{
  const regex = /^\*\s*\{[^}]*scrollbar/gm;
  const matches = [];
  let m;
  while ((m = regex.exec(css)) !== null) {
    const before = css.substring(0, m.index);
    let depth = 0;
    for (const ch of before) {
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    if (depth === 0) {
      const start = m.index;
      let d = 0;
      let i = css.indexOf('{', start);
      for (; i < css.length; i++) {
        if (css[i] === '{') d++;
        else if (css[i] === '}') { d--; if (d === 0) break; }
      }
      matches.push({ start, end: i + 1 });
    }
  }
  if (matches.length > 1) {
    console.log(`  🔄 * { scrollbar }: ${matches.length} → keeping last`);
    for (let i = matches.length - 2; i >= 0; i--) {
      css = css.substring(0, matches[i].start) + css.substring(matches[i].end);
    }
  }
}

// ═══ PHASE 9: Consolidate duplicate prefers-reduced-motion ═══
// Keep only the LAST and most comprehensive one
{
  const regex = /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{/g;
  const matches = [];
  let m;
  while ((m = regex.exec(css)) !== null) {
    const start = m.index;
    let d = 0;
    let i = css.indexOf('{', start);
    for (; i < css.length; i++) {
      if (css[i] === '{') d++;
      else if (css[i] === '}') { d--; if (d === 0) break; }
    }
    matches.push({ start, end: i + 1 });
  }
  if (matches.length > 1) {
    console.log(`  🔄 @media prefers-reduced-motion: ${matches.length} → keeping last`);
    for (let i = matches.length - 2; i >= 0; i--) {
      css = css.substring(0, matches[i].start) + css.substring(matches[i].end);
    }
  }
}

// ═══ PHASE 10: Remove consecutive blank lines (more than 2) ═══
css = css.replace(/(\r?\n){4,}/g, '\n\n\n');

// ═══ PHASE 11: Remove empty comment blocks ═══
css = css.replace(/\/\*\s*\*\//g, '');

const newSize = css.length;
const newLines = css.split('\n').length;
const savedBytes = originalSize - newSize;
const savedLines = originalLines - newLines;
const savedKB = (savedBytes / 1024).toFixed(1);
const reduction = ((savedBytes / originalSize) * 100).toFixed(1);

writeFileSync(CSS_PATH, css, 'utf-8');

console.log('\n══════════════════════════════════════');
console.log(`✅ CSS CLEANUP COMPLETE`);
console.log(`   Original: ${originalLines} lines (${(originalSize/1024).toFixed(1)}KB)`);
console.log(`   Cleaned:  ${newLines} lines (${(newSize/1024).toFixed(1)}KB)`);
console.log(`   Saved:    ${savedLines} lines (${savedKB}KB) — ${reduction}% reduction`);
console.log('══════════════════════════════════════');
