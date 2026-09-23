const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');

// Configure marked to handle GFM and line breaks properly
marked.setOptions({
  gfm: true,
  breaks: true
});

function mdToHtml(mdText, title) {
  // Convert markdown to clean HTML via marked
  const parsedHtml = marked.parse(mdText);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.55;
      color: #1a202c;
      font-size: 12.5px;
    }
    h1 {
      font-size: 20px;
      color: #1a365d;
      border-bottom: 2px solid #3182ce;
      padding-bottom: 6px;
      margin-top: 0;
      margin-bottom: 12px;
    }
    h2 {
      font-size: 15px;
      color: #2b6cb0;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    h3 {
      font-size: 13.5px;
      color: #2d3748;
      margin-top: 14px;
      margin-bottom: 6px;
    }
    h4 {
      font-size: 12.5px;
      color: #4a5568;
      margin-top: 10px;
      margin-bottom: 4px;
    }
    p {
      margin-top: 0;
      margin-bottom: 8px;
    }
    ul, ol {
      padding-left: 20px;
      margin-top: 4px;
      margin-bottom: 10px;
    }
    li {
      margin-bottom: 3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 11px;
      page-break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e0;
      padding: 6px 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #ebf8ff;
      color: #2b6cb0;
      font-weight: 600;
    }
    code {
      background: #edf2f7;
      color: #805ad5;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 11px;
    }
    pre {
      background: #1a202c;
      color: #f7fafc;
      padding: 10px 12px;
      border-radius: 5px;
      overflow-x: auto;
      font-size: 10.5px;
      line-height: 1.4;
      margin: 10px 0;
      page-break-inside: avoid;
    }
    pre code {
      background: none;
      color: inherit;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #3182ce;
      margin: 10px 0;
      padding: 6px 12px;
      background: #f7fafc;
      color: #4a5568;
    }
    hr {
      border: 0;
      height: 1px;
      background: #cbd5e0;
      margin: 16px 0;
    }
    strong {
      color: #1a202c;
    }
  </style>
</head>
<body>
  ${parsedHtml}
</body>
</html>`;
}

const docsDir = path.join(__dirname, '../docs');
const rootDir = path.join(__dirname, '..');

// 1. Research Note
const researchMd = fs.readFileSync(path.join(docsDir, 'research-note.md'), 'utf8');
const researchHtmlPath = path.join(docsDir, 'research-note.html');
const researchPdfPath = path.join(docsDir, 'research-note.pdf');
fs.writeFileSync(researchHtmlPath, mdToHtml(researchMd, 'Research Note: LLD Practice Platform'));

// 2. Design Note
const designMd = fs.readFileSync(path.join(docsDir, 'design-note.md'), 'utf8');
const designHtmlPath = path.join(docsDir, 'design-note.html');
const designPdfPath = path.join(docsDir, 'design-note.pdf');
fs.writeFileSync(designHtmlPath, mdToHtml(designMd, 'Design Note: LLD Practice Platform'));

// 3. Combined README + AI_USAGE
const readmeMd = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8');
const aiUsageMd = fs.readFileSync(path.join(rootDir, 'AI_USAGE.md'), 'utf8');
const combinedMd = readmeMd + '\n\n---\n\n' + aiUsageMd;
const combinedHtmlPath = path.join(rootDir, 'README_AND_AI_USAGE.html');
const combinedPdfPath = path.join(rootDir, 'README_AND_AI_USAGE.pdf');
const combinedMdPath = path.join(rootDir, 'README_AND_AI_USAGE.md');
fs.writeFileSync(combinedMdPath, combinedMd);
fs.writeFileSync(combinedHtmlPath, mdToHtml(combinedMd, 'README & AI Usage Report'));

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

console.log('Generating PDFs via Chrome Headless...');
try {
  execSync(`"${chromePath}" --headless --disable-gpu --print-to-pdf="${researchPdfPath}" "${researchHtmlPath}"`);
  console.log('Successfully generated research-note.pdf');
  
  execSync(`"${chromePath}" --headless --disable-gpu --print-to-pdf="${designPdfPath}" "${designHtmlPath}"`);
  console.log('Successfully generated design-note.pdf');

  execSync(`"${chromePath}" --headless --disable-gpu --print-to-pdf="${combinedPdfPath}" "${combinedHtmlPath}"`);
  console.log('Successfully generated README_AND_AI_USAGE.pdf');
} catch (err) {
  console.error('Chrome PDF conversion error:', err);
}
