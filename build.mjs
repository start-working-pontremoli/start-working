// Builds src/ into dist/: each page becomes a single minified file with its CSS, JavaScript and
// English text inlined; only the images and data the pages use are copied.
import fs from 'node:fs';
import { minify } from 'html-minifier-terser';

const src = (f) => fs.readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const dist = new URL('../dist/', import.meta.url);
fs.rmSync(dist, { recursive: true, force: true });
const en = Object.entries(JSON.parse(src('en.json')));
const used = new Set(['data/people.json']);

for (const page of ['index.html', 'pontremoli.html', 'privacy.html', 'cookie.html']) {
  const page_ = src(page).replace(/<!-- include (\S+) -->/g, (_, f) => src(f)), js = src('main.js');
  // only the English this page needs
  const dict = JSON.stringify(Object.fromEntries(en.filter(([it]) => [page_, js].some((t) => t.includes(it) || t.includes(it.replaceAll('&', '&amp;'))))));
  const html = await minify(page_
    .replace('<link rel="stylesheet" href="style.css">', () => `<style>${src('style.css')}</style>`)
    .replace('<script src="main.js" defer></script>', '')
    .replace('</body>', () => `<script>window.EN=${dict.replace(/</g, '\\u003c')};${js}</script></body>`)
    .replace('href="img/favicon.svg"', () => `href="data:image/svg+xml,${encodeURIComponent(src('img/favicon.svg'))}"`), {
    collapseWhitespace: true, conservativeCollapse: true, removeComments: true, minifyCSS: true, minifyJS: true,
  });
  fs.mkdirSync(dist, { recursive: true });
  fs.writeFileSync(new URL(page, dist), html);
  for (const m of html.matchAll(/(?:img|data)\/[\w.-]+\.\w+/g)) used.add(m[0]);
  console.log(`${page.padEnd(13)} ${(html.length / 1024).toFixed(1)} KB`);
}
for (const f of used) {
  fs.mkdirSync(new URL('.', new URL(f, dist)), { recursive: true });
  fs.copyFileSync(new URL(`../src/${f}`, import.meta.url), new URL(f, dist));
}
console.log(`${used.size} images and data files`);
