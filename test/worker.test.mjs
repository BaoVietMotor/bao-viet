/* End-to-end tests of the Worker (API + static serving). Run: npm test */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import worker from '../src/worker/index.js';
import cfg from '../site.config.mjs';
import { routes } from '../src/pages/_lib.mjs';
import { createD1, createAssets, makeCtx } from './helpers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = mkdtempSync(join(tmpdir(), 'bv-public-'));
const ORIGIN = 'https://bao-viet.example.workers.dev';
const PW = 'correct horse battery staple';
let ipCounter = 0;

before(() => {
  execFileSync(process.execPath, ['build.mjs'], { cwd: ROOT, env: { ...process.env, BUILD_OUT: BUILD }, stdio: 'pipe' });
});

const makeEnv = (extra = {}) => ({ DB: createD1(), ASSETS: createAssets(BUILD), ADMIN_PASSWORD: PW, ...extra });

async function call(env, path, { method = 'GET', body, headers = {}, ip } = {}) {
  const h = new Headers({ 'CF-Connecting-IP': ip || `203.0.113.${++ipCounter % 250}`, ...headers });
  let payload;
  if (body !== undefined) {
    payload = typeof body === 'string' ? body : JSON.stringify(body);
    if (!h.has('Content-Type')) h.set('Content-Type', 'application/json');
  }
  const ctx = makeCtx();
  const res = await worker.fetch(new Request(ORIGIN + path, { method, headers: h, body: payload }), env, ctx);
  await ctx.flush();
  return res;
}

const preorder = (over = {}) => ({
  name: '  Nguyễn  Văn   An ', phone: '0933 026 969', email: 'An@Example.com', province: 'Đà Nẵng',
  bike: 'Yamaha R15', quantity: '2', contactPref: 'zalo', note: 'Gọi buổi tối', consent: true, lang: 'vi', elapsedMs: 15000, company: '', ...over,
});

/* ------------------------------------------------------------------ health */
test('health check reports a working database', async () => {
  const res = await call(makeEnv(), '/api/health');
  assert.equal(res.status, 200);
  const b = await res.json();
  assert.equal(b.ok, true);
  assert.equal(b.db, 'ok');
  assert.equal(res.headers.get('Cache-Control'), 'no-store');
});

/* ------------------------------------------------------------------ pre-orders */
test('valid pre-order is stored, normalised, and returns a readable reference', async () => {
  const env = makeEnv();
  const res = await call(env, '/api/preorder', { method: 'POST', body: preorder(), headers: { Origin: ORIGIN } });
  assert.equal(res.status, 201);
  const b = await res.json();
  assert.match(b.ref, /^BV-[2-9A-HJKMNP-Z]{6}$/);
  const row = await env.DB.prepare('SELECT * FROM submissions WHERE ref = ?1').bind(b.ref).first();
  assert.equal(row.name, 'Nguyễn Văn An');
  assert.equal(row.phone, '0933026969');
  assert.equal(row.email, 'an@example.com');
  assert.equal(row.quantity, 2);
  assert.equal(row.status, 'new');
  assert.equal(row.consent_version, cfg.legal.privacyVersion);
  assert.ok(row.consent_at);
});

test('same phone within 24h returns the existing reference instead of a duplicate', async () => {
  const env = makeEnv();
  const a = await (await call(env, '/api/preorder', { method: 'POST', body: preorder(), ip: '198.51.100.7' })).json();
  const res = await call(env, '/api/preorder', { method: 'POST', body: preorder({ phone: '+84 933 026 969' }), ip: '198.51.100.7' });
  const b = await res.json();
  assert.equal(res.status, 200);
  assert.equal(b.duplicate, true);
  assert.equal(b.ref, a.ref);
  const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM submissions').first();
  assert.equal(n.n, 1);
});

test('invalid pre-order fields come back with per-field error codes', async () => {
  const res = await call(makeEnv(), '/api/preorder', { method: 'POST', body: preorder({ name: 'A', phone: '12345', email: 'nope', province: 'Atlantis', quantity: 11, consent: false }) });
  assert.equal(res.status, 400);
  const b = await res.json();
  assert.deepEqual(b.fields, { name: 'name', phone: 'phone', email: 'email', province: 'required', quantity: 'required', consent: 'consent' });
});

test('choosing email as contact method requires an email', async () => {
  const res = await call(makeEnv(), '/api/preorder', { method: 'POST', body: preorder({ email: '', contactPref: 'email' }) });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).fields.email, 'required');
});

test('honeypot and too-fast submissions get a fake success and are not stored', async () => {
  const env = makeEnv();
  for (const body of [preorder({ company: 'Acme SEO' }), preorder({ elapsedMs: 400 })]) {
    const res = await call(env, '/api/preorder', { method: 'POST', body });
    assert.equal(res.status, 200);
    assert.match((await res.json()).ref, /^BV-/);
  }
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS submissions (id INTEGER)').run();
  const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM submissions').first();
  assert.equal(n.n, 0);
});

test('rate limit: 6th submission from one IP within an hour is refused', async () => {
  const env = makeEnv();
  const statuses = [];
  for (let i = 0; i < 6; i++) {
    const res = await call(env, '/api/preorder', { method: 'POST', body: preorder({ phone: `09330269${10 + i}` }), ip: '192.0.2.55' });
    statuses.push(res.status);
  }
  assert.deepEqual(statuses, [201, 201, 201, 201, 201, 429]);
  const rl = await env.DB.prepare('SELECT bucket FROM rate_limits').all();
  assert.ok(rl.results.every((r) => /^[0-9a-f]{64}$/.test(r.bucket)), 'only hashed keys are stored');
  assert.ok(!JSON.stringify(rl.results).includes('192.0.2.55'), 'raw IP never stored');
});

test('cross-site POSTs, wrong content types, bad JSON and huge bodies are rejected', async () => {
  const env = makeEnv();
  assert.equal((await call(env, '/api/preorder', { method: 'POST', body: preorder(), headers: { Origin: 'https://evil.example' } })).status, 403);
  assert.equal((await call(env, '/api/preorder', { method: 'POST', body: 'name=x', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })).status, 415);
  assert.equal((await call(env, '/api/preorder', { method: 'POST', body: '{not json' })).status, 400);
  assert.equal((await call(env, '/api/preorder', { method: 'POST', body: JSON.stringify({ note: 'x'.repeat(20000) }) })).status, 413);
  assert.equal((await call(env, '/api/preorder', { method: 'GET' })).status, 405);
});

test('database errors are reported generically (no stack traces to the client)', async () => {
  const env = makeEnv();
  env.DB.batch = async () => { throw new Error('D1 exploded: secret internals'); };
  const res = await call(env, '/api/preorder', { method: 'POST', body: preorder() });
  assert.equal(res.status, 500);
  const text = await res.text();
  assert.ok(!text.includes('secret internals'));
});

/* ------------------------------------------------------------------ contact */
test('contact form needs a phone or an email, a topic and a message', async () => {
  const env = makeEnv();
  const bad = await call(env, '/api/contact', { method: 'POST', body: { name: 'Lan', phone: '', email: '', topic: 'x', message: 'hi', consent: true, elapsedMs: 9000 } });
  assert.equal(bad.status, 400);
  assert.deepEqual((await bad.json()).fields, { phone: 'contactOne', email: 'contactOne', topic: 'required', message: 'required' });
  const ok = await call(env, '/api/contact', { method: 'POST', body: { name: 'Lan', email: 'lan@example.vn', topic: 'wholesale', message: 'Cửa hàng tôi muốn nhập 20 bộ.', consent: true, elapsedMs: 9000 } });
  assert.equal(ok.status, 201);
  assert.match((await ok.json()).ref, /^BVM-/);
});

/* ------------------------------------------------------------------ admin */
test('admin is disabled until a strong ADMIN_PASSWORD is configured', async () => {
  const res = await call(makeEnv({ ADMIN_PASSWORD: 'short' }), '/api/admin/submissions', { headers: { Authorization: 'Bearer short' } });
  assert.equal(res.status, 503);
});

test('admin rejects wrong passwords and locks out after 10 failures', async () => {
  const env = makeEnv();
  const ip = '198.51.100.200';
  for (let i = 0; i < 10; i++) {
    assert.equal((await call(env, '/api/admin/submissions', { headers: { Authorization: 'Bearer wrong-password-123' }, ip })).status, 401);
  }
  const locked = await call(env, '/api/admin/submissions', { headers: { Authorization: `Bearer ${PW}` }, ip });
  assert.equal(locked.status, 429, 'even the right password is refused while locked out');
  const other = await call(env, '/api/admin/submissions', { headers: { Authorization: `Bearer ${PW}` }, ip: '198.51.100.201' });
  assert.equal(other.status, 200, 'other IPs unaffected');
});

test('successful admin requests do not count toward the lockout', async () => {
  const env = makeEnv();
  const ip = '198.51.100.210';
  for (let i = 0; i < 25; i++) {
    assert.equal((await call(env, '/api/admin/submissions', { headers: { Authorization: `Bearer ${PW}` }, ip })).status, 200);
  }
});

test('admin can list, filter, update, search, export and delete', async () => {
  const env = makeEnv();
  await call(env, '/api/preorder', { method: 'POST', body: preorder({ name: 'Trần Thị Bình', phone: '0911111111', province: 'Huế', quantity: 3 }) });
  await call(env, '/api/preorder', { method: 'POST', body: preorder({ name: '=HYPERLINK("http://x")', phone: '0922222222', province: 'Huế', quantity: 1 }) });
  await call(env, '/api/contact', { method: 'POST', body: { name: 'Minh', phone: '0933333333', topic: 'press', message: 'Phỏng vấn được không?', consent: true, elapsedMs: 9000 } });
  const auth = { Authorization: `Bearer ${PW}` };

  const list = await (await call(env, '/api/admin/submissions', { headers: auth })).json();
  assert.equal(list.total, 3);
  assert.equal(list.stats.preorders, 2);
  assert.equal(list.stats.units, 4);
  assert.equal(list.stats.messages, 1);
  assert.equal(list.stats.byProvince[0].province, 'Huế');

  const onlyPre = await (await call(env, '/api/admin/submissions?type=preorder', { headers: auth })).json();
  assert.equal(onlyPre.total, 2);

  const found = await (await call(env, '/api/admin/submissions?q=' + encodeURIComponent('Bình'), { headers: auth })).json();
  assert.equal(found.total, 1);
  const injection = await call(env, '/api/admin/submissions?q=' + encodeURIComponent("%' OR 1=1; DROP TABLE submissions; --"), { headers: auth });
  assert.equal(injection.status, 200);
  assert.equal((await injection.json()).total, 0);

  const id = found.items[0].id;
  const patched = await call(env, `/api/admin/submissions/${id}`, { method: 'PATCH', headers: auth, body: { status: 'confirmed', adminNote: 'Đã gọi, giao tuần sau' } });
  assert.equal(patched.status, 200);
  assert.equal((await patched.json()).item.status, 'confirmed');
  assert.equal((await call(env, `/api/admin/submissions/${id}`, { method: 'PATCH', headers: auth, body: { status: 'shipped-to-mars' } })).status, 400);

  // cancelled orders drop out of the unit count
  await call(env, `/api/admin/submissions/${id}`, { method: 'PATCH', headers: auth, body: { status: 'cancelled' } });
  const after = await (await call(env, '/api/admin/submissions', { headers: auth })).json();
  assert.equal(after.stats.units, 1);

  const csvRes = await call(env, '/api/admin/export.csv?type=preorder', { headers: auth });
  assert.equal(csvRes.status, 200);
  assert.match(csvRes.headers.get('Content-Disposition'), new RegExp(`attachment; filename="${cfg.brand.nameAscii.replace(/\s+/g, '-').toLowerCase()}-preorder-\\d{4}-\\d{2}-\\d{2}\\.csv"`));
  const bytes = new Uint8Array(await csvRes.arrayBuffer());
  assert.deepEqual([...bytes.slice(0, 3)], [0xEF, 0xBB, 0xBF], 'UTF-8 BOM for Excel');
  const csv = new TextDecoder().decode(bytes);
  assert.ok(csv.includes('Trần Thị Bình'));
  assert.ok(csv.includes(`"'=HYPERLINK(""http://x"")"`), 'formula injection neutralised');
  assert.ok(!csv.includes('Phỏng vấn'), 'type filter applied');

  assert.equal((await call(env, `/api/admin/submissions/${id}`, { method: 'DELETE', headers: auth })).status, 200);
  assert.equal((await call(env, `/api/admin/submissions/${id}`, { method: 'DELETE', headers: auth })).status, 404);
});

/* ------------------------------------------------------------------ notifications */
test('email alert is sent when configured and never breaks the submission when it fails', async () => {
  const sent = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => { sent.push({ url, body: JSON.parse(init.body) }); return new Response('{}', { status: 200 }); };
  try {
    const env = makeEnv({ RESEND_API_KEY: 're_test', NOTIFY_EMAIL: 'founder@example.com' });
    const res = await call(env, '/api/preorder', { method: 'POST', body: preorder({ phone: '0944444444' }) });
    assert.equal(res.status, 201);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].url, 'https://api.resend.com/emails');
    assert.deepEqual(sent[0].body.to, ['founder@example.com']);
    assert.match(sent[0].body.subject, /^\[Pre-order\] BV-/);

    globalThis.fetch = async () => { throw new Error('network down'); };
    const res2 = await call(env, '/api/preorder', { method: 'POST', body: preorder({ phone: '0955555555' }) });
    assert.equal(res2.status, 201);
  } finally { globalThis.fetch = realFetch; }
});

/* ------------------------------------------------------------------ static site */
test('pages are served with the live origin in canonical/hreflang/OG tags and strong security headers', async () => {
  const res = await call(makeEnv(), '/');
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(!html.includes('__ORIGIN__'));
  assert.ok(html.includes(`<link rel="canonical" href="${ORIGIN}/">`));
  assert.ok(html.includes(`hreflang="vi" href="${ORIGIN}/vi/"`));
  assert.ok(html.includes(`<meta property="og:image" content="${ORIGIN}/img/og-en.jpg">`));
  assert.match(res.headers.get('Content-Security-Policy'), /script-src 'self'/);
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(res.headers.get('X-Frame-Options'), 'DENY');
  assert.match(res.headers.get('Strict-Transport-Security'), /max-age=31536000/);
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=0, must-revalidate');
});

test('SITE_URL overrides the canonical domain and Google verification is injected when set', async () => {
  const res = await call(makeEnv({ SITE_URL: 'https://baoviet.vn/', GOOGLE_SITE_VERIFICATION: 'abc_DEF-123"><script>' }), '/vi/');
  const html = await res.text();
  assert.ok(html.includes('<link rel="canonical" href="https://baoviet.vn/vi/">'));
  assert.ok(html.includes('<meta name="google-site-verification" content="abc_DEF-123script">'), 'token sanitised');
});

test('sitemap and robots point at the live domain', async () => {
  const env = makeEnv();
  const sm = await (await call(env, '/sitemap.xml')).text();
  assert.equal((sm.match(/<loc>/g) || []).length, Object.keys(routes).length * 2);
  assert.ok(sm.includes(`<loc>${ORIGIN}/vi/san-pham/</loc>`));
  assert.ok(sm.includes(`<loc>${ORIGIN}/product/</loc>`));
  const robots = await (await call(env, '/robots.txt')).text();
  assert.ok(robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`));
  assert.ok(robots.includes('Disallow: /admin/'));
});

test('versioned CSS/JS are cached for a year; images for a week; admin never cached or indexed', async () => {
  const env = makeEnv();
  assert.equal((await call(env, '/css/site.css')).headers.get('Cache-Control'), 'public, max-age=31536000, immutable');
  assert.equal((await call(env, '/img/garage-960.webp')).headers.get('Cache-Control'), 'public, max-age=604800');
  const admin = await call(env, '/admin/');
  assert.equal(admin.status, 200);
  assert.equal(admin.headers.get('Cache-Control'), 'no-store');
  assert.equal(admin.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.ok(!(await admin.text()).includes('__V__'));
});

test('unknown pages return the 404 page; non-GET methods on pages are refused', async () => {
  const env = makeEnv();
  const nf = await call(env, '/khong-ton-tai/');
  assert.equal(nf.status, 404);
  assert.match(await nf.text(), /Không tìm thấy trang/);
  assert.equal((await call(env, '/', { method: 'POST', body: '{}' })).status, 405);
});

test('video supports byte-range requests (required by iPhone Safari)', async () => {
  const env = makeEnv();
  const full = readFileSync(join(BUILD, 'video', 'bao-viet-film.mp4'));
  const r1 = await call(env, '/video/bao-viet-film.mp4', { headers: { Range: 'bytes=100-1123' } });
  assert.equal(r1.status, 206);
  assert.equal(r1.headers.get('Content-Range'), `bytes 100-1123/${full.length}`);
  const b1 = Buffer.from(await r1.arrayBuffer());
  assert.equal(b1.length, 1024);
  assert.ok(b1.equals(full.subarray(100, 1124)));

  const r2 = await call(env, '/video/bao-viet-film.mp4', { headers: { Range: 'bytes=-500' } });
  assert.equal(r2.status, 206);
  assert.ok(Buffer.from(await r2.arrayBuffer()).equals(full.subarray(full.length - 500)));

  const r3 = await call(env, '/video/bao-viet-film.mp4', { headers: { Range: `bytes=${full.length + 10}-` } });
  assert.equal(r3.status, 416);

  const r4 = await call(env, '/video/bao-viet-film.mp4');
  assert.equal(r4.status, 200);
  assert.equal(r4.headers.get('Accept-Ranges'), 'bytes');
});

test('old addresses redirect permanently to the new English-first routes', async () => {
  const env = makeEnv();
  for (const [from, to] of [['/en/', '/'], ['/en/product/', '/product/'], ['/san-pham/', '/vi/san-pham/'], ['/kiem-chung', '/vi/kiem-chung/']]) {
    const res = await call(env, from);
    assert.equal(res.status, 301, from);
    assert.equal(res.headers.get('Location'), to, from);
  }
});
