/* Content & SEO checks on the generated site. Run: npm test */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes } from '../src/pages/_lib.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = mkdtempSync(join(tmpdir(), 'bv-build-'));
const pages = {};

before(() => {
  execFileSync(process.execPath, ['build.mjs'], { cwd: ROOT, env: { ...process.env, BUILD_OUT: OUT }, stdio: 'pipe' });
  for (const [id, p] of Object.entries(routes)) {
    for (const lang of ['vi', 'en']) pages[`${id}:${lang}`] = readFileSync(join(OUT, p[lang], 'index.html'), 'utf8');
  }
  pages['404:en'] = readFileSync(join(OUT, '404.html'), 'utf8');
});

const visibleText = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

test('every page exists in Vietnamese and English with the right lang attribute', () => {
  for (const [key, html] of Object.entries(pages)) {
    const lang = key.split(':')[1];
    assert.match(html, new RegExp(`<html lang="${lang}">`), key);
  }
});

test('each page has a unique title, a description, one h1, canonical and hreflang links', () => {
  const titles = new Set();
  for (const [key, html] of Object.entries(pages)) {
    const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
    assert.ok(title && title.length >= 15 && title.length <= 95, `${key} title length: ${title}`);
    assert.ok(!titles.has(title), `duplicate title ${title}`); titles.add(title);
    const desc = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1];
    const minDesc = key.startsWith('404') ? 10 : 50; // the 404 page is noindex
    assert.ok(desc && desc.length >= minDesc && desc.length <= 200, `${key} description length ${desc && desc.length}`);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${key} must have exactly one h1`);
    assert.match(html, /<link rel="canonical" href="__ORIGIN__\//, key);
    if (!key.startsWith('404')) {
      assert.match(html, /hreflang="vi"/, key);
      assert.match(html, /hreflang="en"/, key);
      assert.match(html, /hreflang="x-default"/, key);
    } else {
      assert.match(html, /noindex/);
    }
  }
});

test('all structured data is valid JSON with a schema.org context', () => {
  let n = 0;
  for (const [key, html] of Object.entries(pages)) {
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const data = JSON.parse(m[1]);
      assert.equal(data['@context'], 'https://schema.org', key);
      n++;
    }
  }
  assert.ok(n >= 20, `expected plenty of JSON-LD blocks, got ${n}`);
  const product = JSON.parse([...pages['home:vi'].matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((s) => s.includes('"Product"')));
  assert.equal(product.offers.price, '100');
  assert.equal(product.offers.priceCurrency, 'USD');
  assert.equal(product.offers.availability, 'https://schema.org/PreOrder');
  assert.ok(!('aggregateRating' in product) && !('review' in product), 'no fabricated ratings or reviews');
});

test('every image has alt text and every local asset referenced exists', () => {
  for (const [key, html] of Object.entries(pages)) {
    for (const tag of html.match(/<img\b[^>]*>/g) || []) assert.match(tag, /\salt="/, `${key}: ${tag.slice(0, 80)}`);
    const refs = [...html.matchAll(/(?:src|href)="(\/[^"#?]*)/g)].map((m) => m[1])
      .concat([...html.matchAll(/srcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0])).filter((u) => u.startsWith('/')));
    for (const r of refs) {
      if (r.startsWith('/api/')) continue;
      const file = r.endsWith('/') ? join(OUT, r, 'index.html') : join(OUT, r);
      assert.ok(existsSync(file) && statSync(file).isFile(), `${key}: broken reference ${r}`);
    }
  }
});

test('in-page anchors point at elements that exist', () => {
  for (const [key, html] of Object.entries(pages)) {
    for (const m of html.matchAll(/href="([^"]*)#([a-z0-9-]+)"/g)) {
      const target = m[1] === '' ? html : readFileSync(m[1].endsWith('/') ? join(OUT, m[1], 'index.html') : join(OUT, m[1]), 'utf8');
      assert.match(target, new RegExp(`id="${m[2]}"`), `${key}: missing #${m[2]} in ${m[1] || 'same page'}`);
    }
  }
});

test('no leftover placeholders or rendering bugs', () => {
  for (const [key, html] of Object.entries(pages)) {
    const text = visibleText(html);
    for (const bad of ['{brand}', '{price}', '{nonAffiliation}', 'undefined', '[object Object]', 'NaN', '${']) {
      assert.ok(!text.includes(bad), `${key} contains "${bad}"`);
    }
  }
});

test('Vương Khang Motor appears only as a credited source (film footage, embedded video), never as a partner', () => {
  const VK = /v(ư|u)(ơ|o)ng\s*khang/i;
  const allowed = new Set(['index.html', join('vi', 'index.html'), join('vi', 'lu-va-xe-may', 'index.html'), join('floods-and-motorbikes', 'index.html'), join('vi', 'kiem-chung', 'index.html'), join('verify', 'index.html')].map((f) => join(OUT, f)));
  const offenders = [];
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(html|js|css|xml|txt|json|webmanifest)$/.test(f)) {
        const text = readFileSync(p, 'utf8');
        if (!VK.test(text)) continue;
        if (!allowed.has(p)) { offenders.push(p); continue; }
        // wherever the name appears, no partnership / endorsement wording may sit next to it
        for (const m of visibleText(text).matchAll(/.{0,160}v(ư|u)(ơ|o)ng\s*khang.{0,160}/gi)) {
          assert.ok(!/đối tác|hợp tác cùng|đồng hành cùng|partner(ship)? with|in partnership|endorsed by|tài trợ|sponsor/i.test(m[0].replace(/không có nghĩa là các kênh này hợp tác với hay xác nhận|does not mean its channel partners with or endorses/g, '')), `${p}: "${m[0]}"`);
        }
      }
    }
  };
  walk(OUT);
  assert.deepEqual(offenders, [], 'Vương Khang may only appear on the home, floods and verify pages');
  assert.match(pages['home:vi'], /Cảnh xe ngập ở đầu phim: Vuong Khang Motor\./);
  assert.match(pages['home:en'], /Opening flood footage: Vuong Khang Motor\./);
});

test('no factory cost, no invented certifications, no unverifiable superlatives', () => {
  for (const [key, html] of Object.entries(pages)) {
    const text = visibleText(html);
    for (const bad of [/\$\s?75\b/, /75 ?USD/i, /1\.965\.000/, /7\.500 ?USD/i, /\$\s?530/, /giá vốn/i, /chi phí sản xuất/i, /factory cost/i,
      /IP6[5-8]/, /chứng nhận ISO/i, /lab(oratory)?[- ]certified/i, /đã được kiểm định(?! chưa\?)/i,
      /đầu tiên (ở|tại) Việt Nam/i, /first in Vietnam/i, /duy nhất (ở|tại)/i, /the only (product|solution|brand|one on)/i, /100% (chống ngập|waterproof|flood-proof)(?![^?]{0,20}\?)/i, /chống ngập 100%(?![^?]{0,20}\?)/i, /guaranteed waterproof/i,
      /đánh giá 5 sao/i, /khách hàng hài lòng/i, /testimonial/i]) {
      assert.ok(!bad.test(text), `${key} matches forbidden claim ${bad}`);
    }
  }
});

test('the founder test is always labelled as a founder test, not a lab result', () => {
  for (const key of ['home:vi', 'home:en', 'story:vi', 'story:en', 'faq:vi', 'faq:en']) {
    const text = visibleText(pages[key]);
    assert.match(text, key.endsWith(':vi') ? /không phải kiểm định phòng thí nghiệm/ : /not a laboratory certification/, key);
  }
});

test('key verified figures appear correctly formatted in both languages', () => {
  const vi = visibleText(pages['home:vi'] + pages['floods:vi'] + pages['product:vi']);
  const en = visibleText(pages['home:en'] + pages['floods:en'] + pages['product:en']);
  for (const s of ['1.739', '381.600', '≈100.000 tỷ ₫', '84 triệu', '$100', '2.600.000 ₫', '4-7 triệu']) assert.ok(vi.includes(s), `vi missing ${s}`);
  for (const s of ['1,739', '381,600', '≈₫100 trillion', '84 million', '$100', '₫2,600,000', '₫4-7 million']) assert.ok(en.includes(s), `en missing ${s}`);
});

test('every statistic is accompanied by a link to its source', () => {
  const home = pages['home:vi'] + pages['floods:vi'] + pages['product:vi'];
  for (const url of ['vietnamnet.vn/thien-tai-2025', 'vnexpress.net/mua-lu-2025-qua-anh', 'tuoitre.vn/mua-mot-ngay-o-hue', 'dtinews.dantri.com.vn', 'nhandan.vn/chiec-xe-o-to-moi-cong', 'vnexpress.net/muon-kieu-tui-bat-chong-lu-oto', 'vnexpress.net/khi-xe-may-loi-nuoc']) {
    assert.ok(home.includes(url), `home is missing source ${url}`);
  }
});

test('forms post to the API, require consent, and include a honeypot', () => {
  for (const key of ['preorder:vi', 'preorder:en', 'contact:vi', 'contact:en']) {
    const html = pages[key];
    assert.match(html, /data-endpoint="\/api\/(preorder|contact)"/, key);
    assert.match(html, /<input type="checkbox" id="consent" name="consent" value="yes" required>/, key);
    assert.ok(!/id="consent"[^>]*checked/.test(html), `${key}: consent must not be pre-ticked`);
    assert.match(html, /class="hp"/, key);
  }
  const provinces = (pages['preorder:vi'].match(/<option value="[^"]+">/g) || []).length;
  assert.equal(provinces, 34 + 1 + 10, '34 provinces + outside VN + quantities 1 to 10');
});

test('language switcher links each page to its counterpart', () => {
  for (const [id, p] of Object.entries(routes)) {
    assert.ok(pages[`${id}:vi`].includes(`href="${p.en}" hreflang="en"`), `${id} vi → en`);
    assert.ok(pages[`${id}:en`].includes(`href="${p.vi}" hreflang="vi"`), `${id} en → vi`);
  }
});

test('home page HTML stays lean (fast first load)', () => {
  for (const key of ['home:vi', 'home:en']) assert.ok(Buffer.byteLength(pages[key]) < 120_000, `${key} is ${Buffer.byteLength(pages[key])} bytes`);
  const video = statSync(join(OUT, 'video', 'bao-viet-film.mp4')).size;
  assert.ok(video < 20 * 1024 * 1024, 'video under 20 MB (Cloudflare limit is 25 MiB per file)');
  assert.match(pages['home:vi'], /<video preload="none"/, 'video only downloads when played');
});

test('static files skip the Worker but keep caching headers; pages, API and video still run it', () => {
  const headers = readFileSync(join(OUT, '_headers'), 'utf8');
  for (const p of ['/img/*', '/css/*', '/js/*']) assert.ok(headers.includes(p), `_headers missing ${p}`);
  const cfgText = readFileSync(join(ROOT, 'wrangler.jsonc'), 'utf8');
  const m = cfgText.match(/"run_worker_first":\s*(\[[^\]]*\])/);
  assert.ok(m, 'run_worker_first must be a route list');
  const rules = JSON.parse(m[1]);
  assert.ok(rules.includes('/*'));
  for (const neg of ['!/img/*', '!/css/*', '!/js/*']) assert.ok(rules.includes(neg), `missing ${neg}`);
  assert.ok(!rules.some((r) => /video|api|admin/.test(r) && r.startsWith('!')), 'video, API and admin must stay behind the Worker');
});

test('text colours pass WCAG AA contrast against their backgrounds', () => {
  const css = readFileSync(join(OUT, 'css', 'site.css'), 'utf8');
  const v = (name) => (css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i')) || [])[1];
  const lum = (hex) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  for (const [fg, bg] of [['text', 'ink'], ['muted', 'ink'], ['muted', 'ink-2'], ['muted-d', 'ink'], ['text-dark', 'light'], ['muted-light', 'light'], ['yellow', 'ink']]) {
    const r = ratio(v(fg), v(bg));
    assert.ok(r >= 4.5, `--${fg} on --${bg} has contrast ${r.toFixed(2)}`);
  }
});

test('third-party media: verified YouTube IDs load click-to-play from youtube-nocookie, photos carry licence credits', () => {
  for (const key of ['home:vi', 'floods:vi', 'floods:en']) {
    const html = pages[key];
    for (const f of html.match(/<iframe[^>]*>/gi) || []) { assert.match(f, /src="https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]{11}/, `${key}: only privacy-enhanced YouTube players`); assert.match(f, /loading="lazy"/, `${key}: players load lazily`); }
    for (const m of html.matchAll(/data-yt="([^"]+)"/g)) assert.match(m[1], /^[\w-]{11}$/);
    for (const m of html.matchAll(/<img src="(https:[^"]+)"/g)) {
      assert.match(m[1], /^https:\/\/(upload|thumb)\.wikimedia\.org\/|^https:\/\/i\.ytimg\.com\//, `${key}: unexpected external image ${m[1]}`);
    }
    const figs = html.match(/<figure class="cfig[\s\S]*?<\/figure>/g) || [];
    for (const f of figs) assert.match(f, /creativecommons\.org\/(licenses|publicdomain)/, `${key}: photo without licence link`);
  }
  assert.ok((pages['floods:vi'].match(/data-yt="/g) || []).length >= 5, 'VK video + news clips on the floods page');
  assert.match(pages['home:vi'], /data-yt="YkiSJvBsNbs"/, 'Vuong Khang flood video on the home page');
});

test('no false market claims: never say nobody else sells motorbike flood covers', () => {
  for (const [key, html] of Object.entries(pages)) {
    const text = visibleText(html);
    assert.ok(!/(không ai|chưa ai|chưa có ai|không có ai)[^.]{0,60}(bán|làm)[^.]{0,60}xe máy/i.test(text), `${key}: absolute market claim (VI)`);
    assert.ok(!/(no one|nobody|no other (company|brand))[^.]{0,60}(sells|makes)/i.test(text), `${key}: absolute market claim (EN)`);
  }
});

test('home is structured as Problem → Solution → Why it\'s worth it, in that order', () => {
  for (const [key, labels] of [['home:vi', ['Vấn đề', 'Giải pháp', 'Vì sao đáng đầu tư']], ['home:en', ['The problem', 'The solution', "Why it's worth it"]]]) {
    const html = pages[key];
    const pos = ['id="van-de"', 'id="giai-phap"', 'id="dang-dau-tu"'].map((id) => html.indexOf(id));
    assert.ok(pos.every((p) => p > 0), `${key}: missing a chapter`);
    assert.ok(pos[0] < pos[1] && pos[1] < pos[2], `${key}: chapters out of order`);
    for (const l of labels) assert.ok(visibleText(html).includes(l), `${key}: missing chapter label ${l}`);
  }
});

test('product clips: silent loops that load lazily, have a pause button and real files', () => {
  for (const key of ['home:vi', 'home:en']) {
    const html = pages[key];
    const vids = html.match(/<video class="loop"[^>]*>/g) || [];
    assert.ok(vids.length >= 5, `${key}: expected the feature/step clips, got ${vids.length}`);
    for (const v of vids) {
      for (const attr of [' muted', ' loop', ' playsinline', 'preload="none"', 'data-clip', 'aria-label="']) assert.ok(v.includes(attr), `${key}: clip missing ${attr}`);
      const poster = v.match(/poster="([^"]+)"/)[1];
      assert.ok(existsSync(join(OUT, poster)), `${key}: missing poster ${poster}`);
    }
    assert.equal((html.match(/class="clip-btn"/g) || []).length, vids.length, `${key}: every clip needs a pause button`);
    assert.match(html, /<video class="loop"[^>]*poster="\/img\/clip-roll\.webp"/, `${key}: the one-roll feature must be a clip`);
  }
  for (const f of readdirSync(join(OUT, 'video', 'clips'))) {
    assert.ok(statSync(join(OUT, 'video', 'clips', f)).size < 1.5 * 1024 * 1024, `${f} should stay small`);
  }
});

test('flood photos and timeline focus on central Vietnam', () => {
  for (const key of ['home:vi', 'floods:vi']) {
    const html = pages[key];
    for (const old of ['M%E1%BB%85_Tr%C3%AC', 'Street_flood_in_Saigon', 'Hanoi_2008']) assert.ok(!html.includes(old), `${key}: still shows ${old}`);
    const figs = html.match(/<figure class="cfig[\s\S]*?<\/figure>/g) || [];
    assert.ok(figs.length >= 3, `${key}: expected flood photos`);
    for (const f of figs) assert.match(visibleText(f), /Huế|Đà Nẵng|Quảng Ngãi|Nha Trang/, `${key}: photo outside central Vietnam`);
  }
  const tl = (pages['floods:vi'].match(/<ol class="ftl">[\s\S]*?<\/ol>/) || [''])[0];
  for (const place of ['Huế', 'Quảng Ngãi', 'Đà Nẵng', 'Nha Trang']) assert.ok(tl.includes(place), `timeline missing ${place}`);
});

test('the value argument uses sourced superbike prices, repair costs and the insurance rule', () => {
  const vi = visibleText(pages['product:vi']);
  const en = visibleText(pages['product:en']);
  for (const s of ['549 triệu ₫', 'từ 869 triệu ₫', 'từ 998 triệu ₫', '1,051 tỷ ₫', '0,47%', '0,30%', '0,26%', '0,25%', '2.085 / 2.300 mm', '8 triệu ₫', 'Nghị định 67/2023/NĐ-CP']) assert.ok(vi.includes(s), `vi missing ${s}`);
  for (const s of ['₫549 million', 'from ₫869 million', '₫1.051 billion', '0.47%', '0.30%', '2,085 / 2,300 mm', 'Decree 67/2023']) assert.ok(en.includes(s), `en missing ${s}`);
  const html = pages['product:vi'] + pages['home:vi'];
  for (const url of ['autopro.com.vn/kawasaki-zx-10r-2026', 'baoquocte.vn/can-canh-bmw-s-1000-rr-2026', 'vietnamnet.vn/chi-phi-sua-xe-may', 'luatminhkhue.vn/truong-hop-khong-duoc-bao-hiem', 'dtinews.dantri.com.vn/vietnam-today/nha-trang-severely-flooded']) {
    assert.ok(html.includes(url), `home is missing source ${url}`);
  }
  assert.match(vi, /Chưa có nguồn công khai về chi phí sửa mô tô phân khối lớn bị ngập/, 'say plainly that big-bike repair costs are not published');
});

test('the whole project fits in one GitHub upload (100 files max, 25 MiB per file)', () => {
  let n = 0;
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      if (['node_modules', 'public', '.wrangler', '.git'].includes(f)) continue;
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else { n++; assert.ok(statSync(p).size < 25 * 1024 * 1024, `${p} is over GitHub's 25 MiB browser-upload limit`); }
    }
  };
  walk(ROOT);
  assert.ok(n <= 100, `the project has ${n} files; GitHub's web upload takes 100 at a time`);
});

test('the flood hero is labelled as an illustration (composited water, real product photo)', () => {
  for (const [key, re] of [['home:vi', /Ảnh AI/], ['home:en', /AI image/]]) {
    const hero = (pages[key].match(/<section class="hero[^"]*"[\s\S]*?<\/section>/) || [''])[0];
    assert.match(hero, /\/img\/hero-ai-/, `${key}: hero should use the flood image`);
    assert.match(visibleText(hero), re, `${key}: hero must say the flood is an illustration`);
    assert.match(hero, /alt="(Ảnh minh họa do AI tạo|AI-generated illustration):/, `${key}: alt text must say illustration`);
  }
});

test('copy follows the house style: no em dashes, en dashes or curly quotes in our own text', () => {
  // Article titles quoted from newspapers and YouTube keep their original punctuation.
  const allowedTitles = [/“mới cóng”/g, /“vỡ trận”/g, /NHA TRANG - MẤT HẾT/g];
  for (const [key, html] of Object.entries(pages)) {
    let text = visibleText(html);
    for (const re of allowedTitles) text = text.replace(re, '');
    for (const [bad, name] of [[/\u2014/, 'em dash'], [/\u2013/, 'en dash'], [/[\u201C\u201D\u2018\u2019]/, 'curly quote'], [/\s--\s/, 'double hyphen']]) {
      const m = text.match(new RegExp(`.{0,40}${bad.source}.{0,40}`));
      assert.ok(!m, `${key}: ${name} in "${m && m[0]}"`);
    }
  }
});

test('the verify page lists every source, the founder test label and what the site does not claim', () => {
  const vi = pages['verify:vi'];
  const en = pages['verify:en'];
  for (const url of ['vietnamnet.vn/thien-tai-2025', 'tuoitre.vn/mua-mot-ngay-o-hue', 'nhandan.vn/giup-hang-nghin', 'autopro.com.vn', 'baoquocte.vn', 'luatminhkhue.vn', 'vietnamnet.vn/chi-phi-sua-xe-may']) {
    assert.ok(vi.includes(url) && en.includes(url), `verify page missing ${url}`);
  }
  assert.match(visibleText(vi), /không phải kiểm định phòng thí nghiệm/);
  assert.match(visibleText(en), /not a laboratory certification/);
  assert.match(visibleText(en), /No sales figures and no customer reviews/);
  assert.match(vi, /creativecommons\.org/, 'photo licences listed');
});
