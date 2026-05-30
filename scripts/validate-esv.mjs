#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bible = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/bible/esv.json'), 'utf8'));

const books = Object.keys(bible).sort();
const verses = books.reduce(
  (sum, b) => sum + Object.values(bible[b]).reduce((s, ch) => s + Object.keys(ch).length, 0),
  0,
);

console.log('Books:', books.length, books.join(', '));
console.log('Verses:', verses);

const checks = [
  ['MAT', '11', '28'],
  ['PRO', '1', '1'],
  ['PRO', '3', '5'],
  ['PHP', '4', '6'],
  ['PSA', '23', '1'],
  ['GEN', '1', '1'],
  ['REV', '22', '21'],
];

for (const [b, c, v] of checks) {
  const text = bible[b]?.[c]?.[v];
  console.log(`${b} ${c}:${v}:`, text ? text.slice(0, 100) : '(MISSING)');
}

const expectedBooks = 66;
if (books.length !== expectedBooks) {
  const all = [
    'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI',
    '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER',
    'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP',
    'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL',
    'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM', 'HEB', 'JAS', '1PE',
    '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV',
  ];
  const missing = all.filter((id) => !bible[id]);
  console.log('Missing books:', missing.join(', ') || 'none');
}
