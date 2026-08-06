import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const htmlShell = ({ title, bodyHtml }) => `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @page { margin: 20mm; size: A4; }
    body { font-family: sans-serif; font-size: 12px; line-height: 1.5; color: #333; margin: 0; }
    .cover { height: 80vh; display: flex; flex-direction: column; justify-content: center; text-align: center; page-break-after: always; }
    h1, h2, h3, h4 { color: #222; page-break-after: avoid; }
    h1 { border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
    th { background: #f4f4f4; }
    pre, code { background: #f4f4f4; font-family: monospace; font-size: 11px; }
    pre { padding: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
    /* No page-break-inside: avoid on pre/table to allow long blocks to flow across pages naturally */
    img { max-width: 100%; }
    blockquote { border-left: 3px solid #ccc; margin: 0; padding-left: 10px; color: #666; }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${title}</h1>
    <p>DOCUMENT :: ${new Date().toISOString().split('T')[0]}</p>
  </div>
  ${bodyHtml}
</body>
</html>`;

async function renderPdf({ input, output, title }) {
  const md = await readFile(input, 'utf8');
  const bodyHtml = await marked.parse(md, { gfm: true });
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
    footerTemplate: '<div style="font-size:10px; text-align:center; width:100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
  });
  await browser.close();
}

async function main() {
  const targets = [
    { input: path.join(root, 'docs/hld/hld.md'), output: path.join(root, 'docs/hld/hld.pdf'), title: 'High-Level Design' },
    { input: path.join(root, 'docs/lld/lld.md'), output: path.join(root, 'docs/lld/lld.pdf'), title: 'Low-Level Design' }
  ];
  await mkdir(path.dirname(targets[0].output), { recursive: true });
  await mkdir(path.dirname(targets[1].output), { recursive: true });
  for (const t of targets) await renderPdf(t);
}
main().catch(console.error);
