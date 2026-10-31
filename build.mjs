#!/usr/bin/env node
/**
 * Static site generator. No dependencies, runs on plain Node 18+.
 *
 *   node build.mjs            → writes the full site to ./public
 *
 * Cloudflare runs this automatically before every deploy (see wrangler.jsonc → build.command).
 * Each page module in src/pages renders twice: English at "/", Vietnamese under "/vi/".
 */
import { rmSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import cfg from './site.config.mjs';
import { makeContext, renderPage, routes, ORIGIN } from './src/pages/_lib.mjs';
import home from './src/pages/home.mjs';
import product from './src/pages/product.mjs';
import story from './src/pages/story.mjs';
import floods from './src/pages/floods.mjs';
import faq from './src/pages/faq.mjs';
import preorder from './src/pages/preorder.mjs';
import contact from './src/pages/contact.mjs';
import privacy from './src/pages/privacy.mjs';
import terms from './src/pages/terms.mjs';
import notfound from './src/pages/notfound.mjs';
import verify from './src/pages/verify.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(ROOT, process.env.BUILD_OUT || 'public');
const STATIC = join(ROOT, 'static');
const pages = [home, product, floods, story, verify, faq, preorder, contact, privacy, terms];

const t0 = Date.now();
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(STATIC, OUT, { recursive: true });

// Cache-busting version derived from CSS + JS content, so browsers always get fresh styles after a change.
const hash = createHash('sha256');
for (const dir of ['css', 'js']) {
  for (const f of readdirSync(join(STATIC, dir)).sort()) hash.update(readFileSync(join(STATIC, dir, f)));
}
const assetVersion = hash.digest('hex').slice(0, 10);

const write = (path, html) => {
  const file = path.endsWith('.html') ? join(OUT, path) : join(OUT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return file;
};

let count = 0;
for (const page of pages) {
  for (const lang of ['en', 'vi']) {
    const ctx = makeContext(lang, cfg, assetVersion);
    write(page.path[lang], renderPage(ctx, page));
    count++;
  }
}
write('/404.html', renderPage(makeContext('en', cfg, assetVersion), notfound));
count++;

// Admin dashboard is a static file; stamp the asset version into it.
const adminFile = join(OUT, 'admin', 'index.html');
writeFileSync(adminFile, readFileSync(adminFile, 'utf8').replaceAll('__V__', assetVersion));

// sitemap.xml with hreflang alternates (Google uses these to pair VI/EN pages)
const today = new Date().toISOString().slice(0, 10);
const urls = pages.map((p) => ['en', 'vi'].map((lang) => `  <url>
    <loc>${ORIGIN}${p.path[lang]}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="vi" href="${ORIGIN}${p.path.vi}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${p.path.en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${p.path.en}"/>
  </url>`).join('\n')).join('\n');
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`);

writeFileSync(join(OUT, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${ORIGIN}/sitemap.xml
`);

writeFileSync(join(OUT, 'site.webmanifest'), JSON.stringify({
  name: `${cfg.brand.name} | ${cfg.brand.slogan}`,
  short_name: cfg.brand.name,
  lang: 'en',
  start_url: routes.home.en,
  display: 'standalone',
  background_color: '#0b0c10',
  theme_color: '#0b0c10',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
}, null, 2));

// Tiny report
let bytes = 0, files = 0;
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); const s = statSync(p); if (s.isDirectory()) walk(p); else { bytes += s.size; files++; } } };
walk(OUT);
console.log(`Built ${count} pages, ${files} files, ${(bytes / 1048576).toFixed(1)} MB → ${OUT} in ${Date.now() - t0} ms (assets v${assetVersion})`);
