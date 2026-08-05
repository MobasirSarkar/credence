/*
 * Copyright (c) 2026 Mobasher Ali (https://github.com/mobas)
 * All Rights Reserved.
 * See LICENSE at the root of this repository.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const COPYRIGHT_LINE = 'Copyright (c) 2026 Mobasher Ali (https://github.com/mobas) - All Rights Reserved.';
const AUTHOR = 'Mobasher Ali';
const CONTACT = 'mobas@example.com';

function htmlShell({ title, bodyHtml }) {
  return `<!doctype html>
<html><head><meta charset="utf-8" />
<title>${title}</title>
<style>
  @page { size: A4; margin: 22mm 18mm 22mm 18mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
         color: #111; line-height: 1.55; font-size: 11pt; }
  .cover { page-break-after: always; padding: 60mm 0 0 0; text-align: center; }
  .cover h1 { font-size: 32pt; margin: 0 0 12mm 0; letter-spacing: -0.5pt; }
  .cover .subtitle { font-size: 14pt; color: #555; margin-bottom: 30mm; }
  .cover .meta { font-size: 10pt; color: #444; line-height: 1.7; }
  .cover .meta strong { display: inline-block; min-width: 22mm; }
  .cover .stamp { margin-top: 25mm; font-size: 9pt; color: #777; border-top: 1px solid #ccc; padding-top: 6mm; display: inline-block; padding-left: 12mm; padding-right: 12mm; }
  h1, h2, h3, h4 { color: #111; line-height: 1.25; }
  h1 { font-size: 22pt; border-bottom: 1px solid #ddd; padding-bottom: 4pt; margin-top: 0; }
  h2 { font-size: 16pt; margin-top: 18pt; border-bottom: 1px solid #eee; padding-bottom: 3pt; }
  h3 { font-size: 13pt; margin-top: 14pt; }
  h4 { font-size: 11pt; margin-top: 12pt; }
  code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  pre { background: #f6f8fa; padding: 8pt; border-radius: 4pt; overflow: auto; font-size: 9pt; }
  code { background: #f6f8fa; padding: 1pt 4pt; border-radius: 3pt; font-size: 9.5pt; }
  pre code { background: transparent; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
  th, td { border: 1px solid #d0d7de; padding: 5pt 8pt; text-align: left; vertical-align: top; }
  th { background: #f6f8fa; }
  blockquote { border-left: 3px solid #d0d7de; color: #555; margin: 6pt 0; padding: 4pt 10pt; background: #f9f9f9; }
  hr { border: none; border-top: 1px solid #d0d7de; margin: 16pt 0; }
  a { color: #0969da; text-decoration: none; }
  .mermaid { text-align: center; font-style: italic; color: #555; padding: 10pt; border: 1px dashed #ccc; }
</style>
</head><body>
<div class="cover">
  <h1>${title}</h1>
  <div class="subtitle">LMS Prototype</div>
  <div class="meta">
    <div><strong>Author</strong> ${AUTHOR}</div>
    <div><strong>Date</strong> ${new Date().toISOString().slice(0, 10)}</div>
    <div><strong>Contact</strong> ${CONTACT}</div>
    <div><strong>Repository</strong> https://github.com/mobas</div>
  </div>
  <div class="stamp">${COPYRIGHT_LINE}<br/>Unauthorized copying, modification, or distribution is prohibited.</div>
</div>
${bodyHtml}
</body></html>`;
}

const FOOTER = `
<div style="font-size:8pt; color:#555; width:100%; padding:0 14mm; display:flex; justify-content:space-between;">
  <span>${COPYRIGHT_LINE}</span>
  <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;

async function renderPdf({ input, output, title }) {
  const md = await readFile(input, 'utf8');
  const bodyHtml = await marked.parse(md, { gfm: true, breaks: false });
  const html = htmlShell({ title, bodyHtml });

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: FOOTER,
    margin: { top: '22mm', bottom: '22mm', left: '18mm', right: '18mm' },
  });
  await browser.close();
  console.log(`wrote ${output}`);
}

async function main() {
  const targets = [
    { input: path.join(root, 'docs/superpowers/hld/2026-08-05-los-lms-prototype.md'), output: path.join(root, 'docs/superpowers/hld/2026-08-05-los-lms-prototype.pdf'), title: 'LOS + LMS Prototype - High-Level Design' },
    { input: path.join(root, 'docs/superpowers/lld/2026-08-05-los-lms-prototype.md'), output: path.join(root, 'docs/superpowers/lld/2026-08-05-los-lms-prototype.pdf'), title: 'LOS + LMS Prototype - Low-Level Design' },
  ];
  await mkdir(path.dirname(targets[0].output), { recursive: true });
  for (const t of targets) await renderPdf(t);
}

main().catch((e) => { console.error(e); process.exit(1); });
