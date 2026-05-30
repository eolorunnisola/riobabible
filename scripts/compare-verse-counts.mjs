#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const countVerses = (b) =>
  Object.values(b).reduce((s, ch) => s + Object.values(ch).reduce((s2, v) => s2 + Object.keys(v).length, 0), 0);

const nlt = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/bible/nlt.json')));
const esv = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/bible/esv.json')));

const books = Object.keys(nlt).sort();
let worst = [];
for (const b of books) {
  const n = countVerses({ [b]: nlt[b] });
  const e = esv[b] ? countVerses({ [b]: esv[b] }) : 0;
  const diff = n - e;
  if (diff > 50) worst.push({ b, n, e, diff });
}
worst.sort((a, b) => b.diff - a.diff);
console.log('Books with >50 fewer ESV verses than NLT:');
for (const w of worst.slice(0, 20)) console.log(w);
