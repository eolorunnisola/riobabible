#!/usr/bin/env node
/**
 * Converts bible_translations/*.pdf into searchable JSON under assets/bible/.
 *
 * Usage:
 *   node scripts/build-bible-index.mjs --translation=NIV
 *   node scripts/build-bible-index.mjs --all
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';
import { BOOK_ID, PDF_BOOK_ORDER, PDF_FILES } from './bible-books.mjs';
import { NLT_TO_BOOK_ID } from './nlt-books.mjs';
import { ESV_TO_BOOK_ID } from './esv-books.mjs';
import { KJV_TO_BOOK_ID } from './kjv-books.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'bible_translations');
const OUT_DIR = path.join(ROOT, 'assets', 'bible');

const BOOK_SET = new Set(PDF_BOOK_ORDER);
const SKIP_PREFIXES = [
  'Holy Bible', 'New International', 'About the', 'Old Testament', 'New Testament',
];

function normalizeLine(line) {
  return line.replace(/\s+/g, ' ').trim();
}

function shouldSkipLine(line) {
  if (!line) return true;
  return SKIP_PREFIXES.some((p) => line.startsWith(p));
}

/**
 * NLT Kindle export: "Mat 11:28 Then Jesus said, …" repeated for each verse.
 */
function parseNltFromText(rawText) {
  const bible = {};
  const cleaned = rawText.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, ' ');
  const pattern = /([A-Za-z0-9]+) (\d+):(\d+)\s+/g;
  const hits = [];

  let match;
  while ((match = pattern.exec(cleaned)) !== null) {
    hits.push({
      abbrev: match[1],
      chapter: match[2],
      verse: match[3],
      refStart: match.index,
      textStart: match.index + match[0].length,
    });
  }

  let unknown = new Set();

  for (let i = 0; i < hits.length; i++) {
    const cur = hits[i];
    const bookId = NLT_TO_BOOK_ID[cur.abbrev];
    if (!bookId) {
      unknown.add(cur.abbrev);
      continue;
    }

    const sliceEnd = i + 1 < hits.length ? hits[i + 1].refStart : cleaned.length;
    const verseText = cleaned.slice(cur.textStart, sliceEnd).replace(/\s+/g, ' ').trim();

    if (!verseText) continue;

    if (!bible[bookId]) bible[bookId] = {};
    if (!bible[bookId][cur.chapter]) bible[bookId][cur.chapter] = {};
    bible[bookId][cur.chapter][cur.verse] = verseText;
  }

  if (unknown.size > 0) {
    console.warn('NLT unknown abbreviations:', [...unknown].sort().join(', '));
  }

  return bible;
}

const CP1252 = {
  0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”',
  0x95: '•', 0x96: '–', 0x97: '—',
};

function decodeRtf(text) {
  return text
    .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => {
      const code = parseInt(hex, 16);
      return CP1252[code] ?? String.fromCharCode(code);
    })
    .replace(/\\([{}\\])/g, '$1');
}

/**
 * KJV from KingJames.rtf (Pure Cambridge Edition, BibleProtector.com):
 *   one verse per line as "<Book> <chapter>:<verse>\t<text>", each line ending
 *   with an RTF "\" break. "[word]" marks KJV italics (kept verbatim); a few
 *   cp1252 escapes (\'92 = ', \'97 = —) are decoded.
 */
function parseKjvFromRtf(raw) {
  const bible = {};
  const lines = raw.split(/\\?\r?\n/);
  const re = /^(.+?) (\d+):(\d+)\t(.*)$/;

  for (const line of lines) {
    const m = line.match(re);
    if (!m) continue;
    const bookId = KJV_TO_BOOK_ID[m[1]];
    if (!bookId) continue;
    const chapter = m[2];
    const verse = m[3];
    const text = decodeRtf(m[4]).replace(/\s+/g, ' ').trim();
    if (!text) continue;

    if (!bible[bookId]) bible[bookId] = {};
    if (!bible[bookId][chapter]) bible[bookId][chapter] = {};
    bible[bookId][chapter][verse] = text;
  }

  return bible;
}

/**
 * ESV from ESV.rtfd/TXT.rtf (English Standard Version 2001):
 *   verses flow as "<Abbr> <chap>:<verse> <text>" and wrap across RTF "\" line
 *   breaks, so lines are joined and the text between consecutive references is
 *   one verse. Merged verses appear as back-to-back references with no text
 *   between them; the shared text that follows is assigned to each. A trailing
 *   "{{\NeXTGraphic …}}" image attachment is stripped, and the source's "|"
 *   glyph for the standalone word "I" is restored.
 */
function parseEsvFromRtf(raw) {
  let text = raw.replace(/\{\{\\NeXTGraphic[\s\S]*?\}\}/g, ' ');
  text = text.split(/\\?\r?\n/).join(' ');
  text = decodeRtf(text)
    .replace(/\\[a-zA-Z*]+-?\d*/g, ' ')
    .replace(/[{}]/g, ' ')
    .replace(/\|/g, 'I');

  const refRe = /([1-3]?[A-Za-z]{2,4}) (\d+):(\d+) /g;
  const hits = [];
  let m;
  while ((m = refRe.exec(text)) !== null) {
    const bookId = ESV_TO_BOOK_ID[m[1]];
    if (!bookId) continue;
    hits.push({ bookId, chapter: m[2], verse: m[3], refStart: m.index, textStart: refRe.lastIndex });
  }

  const bible = {};
  let group = [];
  for (let i = 0; i < hits.length; i++) {
    const cur = hits[i];
    const end = i + 1 < hits.length ? hits[i + 1].refStart : text.length;
    const verseText = text.slice(cur.textStart, end).replace(/\s+/g, ' ').trim();
    group.push(cur);
    if (!verseText) continue; // merged verse: share the text that follows
    for (const h of group) {
      if (!bible[h.bookId]) bible[h.bookId] = {};
      if (!bible[h.bookId][h.chapter]) bible[h.bookId][h.chapter] = {};
      bible[h.bookId][h.chapter][h.verse] = verseText;
    }
    group = [];
  }

  return bible;
}

function parseNivFromText(rawText) {
  const bible = {};
  let currentBook = null;
  let currentChapter = '1';
  let currentVerse = null;
  let lastVerseNum = 0;
  let buffer = '';
  let pendingVerseNum = null;

  const flushVerse = () => {
    if (!currentBook || !currentVerse) return;
    const bookId = BOOK_ID[currentBook];
    if (!bookId) return;
    if (!bible[bookId]) bible[bookId] = {};
    if (!bible[bookId][currentChapter]) bible[bookId][currentChapter] = {};
    const text = normalizeLine(buffer);
    if (text) bible[bookId][currentChapter][currentVerse] = text;
    buffer = '';
  };

  const startVerse = (num, rest) => {
    const n = parseInt(num, 10);
    const restTrim = normalizeLine(rest);

    if (
      lastVerseNum >= 5 &&
      n < lastVerseNum &&
      n > 1 &&
      restTrim.length > 0 &&
      /^[A-Z"']/.test(restTrim)
    ) {
      flushVerse();
      currentChapter = String(n);
      currentVerse = '1';
      buffer = restTrim;
      lastVerseNum = 1;
      return;
    }

    flushVerse();
    currentVerse = String(n);
    buffer = restTrim;
    lastVerseNum = n;
  };

  const lines = rawText
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '\n')
    .split('\n')
    .map(normalizeLine)
    .filter(Boolean);

  for (const line of lines) {
    if (shouldSkipLine(line)) continue;

    if (BOOK_SET.has(line)) {
      flushVerse();
      currentBook = line;
      currentChapter = '1';
      currentVerse = null;
      lastVerseNum = 0;
      pendingVerseNum = null;
      continue;
    }

    if (/^\d+$/.test(line)) {
      pendingVerseNum = line;
      continue;
    }

    if (pendingVerseNum) {
      startVerse(pendingVerseNum, line);
      pendingVerseNum = null;
      continue;
    }

    const verseMatch = line.match(/^(\d+)(.*)$/);
    if (verseMatch && currentBook) {
      startVerse(verseMatch[1], verseMatch[2]);
      continue;
    }

    if (currentVerse) {
      buffer += (buffer ? ' ' : '') + line;
    }
  }

  flushVerse();
  return bible;
}

async function extractPdf(filePath) {
  const parser = new PDFParse({ data: fs.readFileSync(filePath) });
  const result = await parser.getText();
  return result.text;
}

async function buildTranslation(code) {
  const pdfName = PDF_FILES[code];
  if (!pdfName) throw new Error(`Unknown translation: ${code}`);
  const pdfPath = path.join(PDF_DIR, pdfName);
  if (!fs.existsSync(pdfPath)) {
    console.warn(`Skip ${code}: missing ${pdfPath}`);
    return;
  }

  console.log(`Parsing ${code} from ${pdfName}…`);

  let bible;
  if (code === 'KJV') {
    bible = parseKjvFromRtf(fs.readFileSync(pdfPath, 'latin1'));
  } else if (code === 'ESV') {
    bible = parseEsvFromRtf(fs.readFileSync(pdfPath, 'latin1'));
  } else {
    const text = await extractPdf(pdfPath);
    const parsers = {
      NIV: parseNivFromText,
      NLT: parseNltFromText,
    };
    const parse = parsers[code] ?? parseNivFromText;
    bible = parse(text);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${code.toLowerCase()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(bible));
  const books = Object.keys(bible).length;
  const verses = Object.values(bible).reduce(
    (sum, ch) => sum + Object.values(ch).reduce((s, v) => s + Object.keys(v).length, 0),
    0,
  );
  console.log(`Wrote ${outPath} (${books} books, ~${verses} verses)`);

  const sample = bible.MAT?.['11']?.['28'];
  console.log('Sample MAT 11:28:', sample ? sample.slice(0, 80) : '(not found)');
}

async function main() {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const translationArg = args.find((a) => a.startsWith('--translation='));
  const codes = all
    ? Object.keys(PDF_FILES)
    : translationArg
      ? [translationArg.split('=')[1].toUpperCase()]
      : ['NIV'];

  for (const code of codes) {
    await buildTranslation(code);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
