/**
 * Test doubles for the Cloudflare runtime:
 *  - createD1(): the D1 API implemented on Node's built-in SQLite (same SQL engine D1 uses)
 *  - createAssets(dir): the static-assets binding, serving files from a build folder
 */
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

export function createD1() {
  const db = new DatabaseSync(':memory:');
  class Statement {
    constructor(sql, params = []) { this.sql = sql; this.params = params; }
    bind(...params) { return new Statement(this.sql, params); }
    async first(col) {
      const row = db.prepare(this.sql).get(...this.params);
      if (row === undefined) return null;
      return col ? row[col] : { ...row };
    }
    async all() { return { success: true, results: db.prepare(this.sql).all(...this.params).map((r) => ({ ...r })), meta: {} }; }
    async run() {
      const r = db.prepare(this.sql).run(...this.params);
      return { success: true, meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } };
    }
  }
  return {
    prepare: (sql) => new Statement(sql),
    async batch(stmts) {
      const out = [];
      db.exec('BEGIN');
      try {
        for (const s of stmts) out.push(/^\s*(SELECT|WITH)\b/i.test(s.sql) ? await s.all() : await s.run());
        db.exec('COMMIT');
      } catch (err) { db.exec('ROLLBACK'); throw err; }
      return out;
    },
    raw: db,
  };
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp4': 'video/mp4',
};

/** Mimics Workers static assets with html_handling=auto-trailing-slash and not_found_handling=404-page. Never returns 206 (exercises our Range fallback). */
export function createAssets(dir) {
  return {
    async fetch(request) {
      const url = new URL(request.url);
      let p = decodeURIComponent(url.pathname);
      let file = join(dir, p);
      if (p.endsWith('/')) file = join(dir, p, 'index.html');
      else if (existsSync(file) && statSync(file).isDirectory()) return new Response(null, { status: 307, headers: { Location: p + '/' } });
      if (!existsSync(file) || statSync(file).isDirectory()) {
        const nf = readFileSync(join(dir, '404.html'));
        return new Response(nf, { status: 404, headers: { 'Content-Type': TYPES['.html'], 'Content-Length': String(nf.length) } });
      }
      const buf = readFileSync(file);
      return new Response(buf, { status: 200, headers: { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Content-Length': String(buf.length), ETag: '"abc"' } });
    },
  };
}

export function makeCtx() {
  const pending = [];
  return { waitUntil: (p) => pending.push(p), passThroughOnException() {}, flush: () => Promise.all(pending) };
}
