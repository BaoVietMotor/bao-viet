/**
 * Database layer (Cloudflare D1 = SQLite at the edge).
 * The schema creates itself on first use, so a fresh deploy needs no manual migration.
 * All queries use bound parameters, so user input is never concatenated into SQL.
 */

export const STATUSES = ['new', 'contacted', 'confirmed', 'cancelled', 'done'];

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS submissions (
     id              INTEGER PRIMARY KEY AUTOINCREMENT,
     ref             TEXT    NOT NULL UNIQUE,
     type            TEXT    NOT NULL CHECK (type IN ('preorder', 'contact')),
     status          TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','confirmed','cancelled','done')),
     created_at      TEXT    NOT NULL,
     updated_at      TEXT    NOT NULL,
     lang            TEXT    NOT NULL DEFAULT 'vi',
     name            TEXT    NOT NULL,
     phone           TEXT,
     email           TEXT,
     province        TEXT,
     bike            TEXT,
     quantity        INTEGER,
     contact_pref    TEXT,
     topic           TEXT,
     message         TEXT,
     admin_note      TEXT,
     consent_at      TEXT    NOT NULL,
     consent_version TEXT    NOT NULL
   )`,
  'CREATE INDEX IF NOT EXISTS idx_submissions_type_created ON submissions (type, created_at DESC)',
  'CREATE INDEX IF NOT EXISTS idx_submissions_phone_created ON submissions (phone, created_at)',
  `CREATE TABLE IF NOT EXISTS rate_limits (
     bucket   TEXT    PRIMARY KEY,
     count    INTEGER NOT NULL,
     reset_at INTEGER NOT NULL
   )`,
];

const ready = new WeakMap();

/** Create tables once per database binding per isolate. */
export function ensureSchema(db) {
  if (!ready.has(db)) {
    const p = db.batch(SCHEMA.map((sql) => db.prepare(sql))).catch((err) => { ready.delete(db); throw err; });
    ready.set(db, p);
  }
  return ready.get(db);
}

const REF_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // no 0/O/1/I/L, easy to read over the phone
export function makeRef(prefix) {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let s = '';
  for (const b of bytes) s += REF_ALPHABET[b % REF_ALPHABET.length];
  return `${prefix}-${s}`;
}

/** Most recent pre-order from this phone number within the window, if any. */
export async function findRecentPreorder(db, phone, sinceIso) {
  return db.prepare(
    `SELECT ref FROM submissions WHERE type = 'preorder' AND phone = ?1 AND created_at >= ?2 AND status != 'cancelled'
     ORDER BY created_at DESC LIMIT 1`,
  ).bind(phone, sinceIso).first();
}

/** Insert a submission, retrying on the (astronomically unlikely) reference collision. */
export async function insertSubmission(db, s, prefix) {
  const now = new Date().toISOString();
  for (let attempt = 0; attempt < 5; attempt++) {
    const ref = makeRef(prefix);
    try {
      await db.prepare(
        `INSERT INTO submissions
           (ref, type, status, created_at, updated_at, lang, name, phone, email, province, bike, quantity, contact_pref, topic, message, consent_at, consent_version)
         VALUES (?1, ?2, 'new', ?3, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?3, ?14)`,
      ).bind(
        ref, s.type, now, s.lang, s.name, s.phone ?? null, s.email ?? null, s.province ?? null, s.bike ?? null,
        s.quantity ?? null, s.contactPref ?? null, s.topic ?? null, s.message ?? null, s.consentVersion,
      ).run();
      return { ref, createdAt: now };
    } catch (err) {
      if (!/UNIQUE/i.test(String(err && err.message))) throw err;
    }
  }
  throw new Error('Could not allocate a unique reference');
}

export async function listSubmissions(db, { type, status, q, limit = 100, offset = 0 } = {}) {
  const where = [];
  const args = [];
  const add = (clause, ...vals) => { where.push(clause.replace(/\?/g, () => `?${args.length + 1}`)); args.push(...vals); };
  if (type === 'preorder' || type === 'contact') add('type = ?', type);
  if (STATUSES.includes(status)) add('status = ?', status);
  if (q) {
    const like = `%${String(q).slice(0, 80).replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    where.push(`(name LIKE ?${args.length + 1} ESCAPE '\\' OR phone LIKE ?${args.length + 1} ESCAPE '\\' OR email LIKE ?${args.length + 1} ESCAPE '\\' OR ref LIKE ?${args.length + 1} ESCAPE '\\' OR province LIKE ?${args.length + 1} ESCAPE '\\')`);
    args.push(like);
  }
  const lim = Math.min(Math.max(Number.parseInt(limit, 10) || 100, 1), 500);
  const off = Math.max(Number.parseInt(offset, 10) || 0, 0);
  const sql = `SELECT * FROM submissions ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
               ORDER BY created_at DESC, id DESC LIMIT ${lim} OFFSET ${off}`;
  const countSql = `SELECT COUNT(*) AS n FROM submissions ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`;
  const [rows, count] = await Promise.all([
    db.prepare(sql).bind(...args).all(),
    db.prepare(countSql).bind(...args).first(),
  ]);
  return { items: rows.results || [], total: count ? count.n : 0, limit: lim, offset: off };
}

export async function stats(db) {
  const [totals, byStatus, byProvince] = await db.batch([
    db.prepare(`SELECT
        SUM(CASE WHEN type='preorder' THEN 1 ELSE 0 END) AS preorders,
        SUM(CASE WHEN type='preorder' AND status != 'cancelled' THEN COALESCE(quantity,0) ELSE 0 END) AS units,
        SUM(CASE WHEN type='contact' THEN 1 ELSE 0 END) AS messages,
        SUM(CASE WHEN status='new' THEN 1 ELSE 0 END) AS unhandled
      FROM submissions`),
    db.prepare(`SELECT status, COUNT(*) AS n FROM submissions WHERE type='preorder' GROUP BY status`),
    db.prepare(`SELECT province, COUNT(*) AS n, SUM(COALESCE(quantity,0)) AS units FROM submissions
                WHERE type='preorder' AND status != 'cancelled' GROUP BY province ORDER BY units DESC LIMIT 10`),
  ]);
  const t = (totals.results && totals.results[0]) || {};
  return {
    preorders: t.preorders || 0,
    units: t.units || 0,
    messages: t.messages || 0,
    unhandled: t.unhandled || 0,
    byStatus: Object.fromEntries((byStatus.results || []).map((r) => [r.status, r.n])),
    byProvince: byProvince.results || [],
  };
}

export async function updateSubmission(db, id, { status, adminNote }) {
  const sets = [];
  const args = [];
  if (status !== undefined) { sets.push(`status = ?${args.length + 1}`); args.push(status); }
  if (adminNote !== undefined) { sets.push(`admin_note = ?${args.length + 1}`); args.push(adminNote); }
  if (!sets.length) return null;
  sets.push(`updated_at = ?${args.length + 1}`); args.push(new Date().toISOString());
  args.push(id);
  const res = await db.prepare(`UPDATE submissions SET ${sets.join(', ')} WHERE id = ?${args.length}`).bind(...args).run();
  if (!res.meta || res.meta.changes === 0) return null;
  return db.prepare('SELECT * FROM submissions WHERE id = ?1').bind(id).first();
}

export async function deleteSubmission(db, id) {
  const res = await db.prepare('DELETE FROM submissions WHERE id = ?1').bind(id).run();
  return !!(res.meta && res.meta.changes > 0);
}

export async function allForExport(db, type) {
  const rows = (type === 'preorder' || type === 'contact')
    ? await db.prepare('SELECT * FROM submissions WHERE type = ?1 ORDER BY created_at DESC').bind(type).all()
    : await db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
  return rows.results || [];
}

/** Fixed-window counter. Returns { allowed, count }. Keys are already hashed by the caller. */
export async function hitRateLimit(db, bucket, resetAt, limit) {
  const row = await db.prepare(
    `INSERT INTO rate_limits (bucket, count, reset_at) VALUES (?1, 1, ?2)
     ON CONFLICT(bucket) DO UPDATE SET count = count + 1
     RETURNING count`,
  ).bind(bucket, resetAt).first();
  const count = row ? row.count : 1;
  return { allowed: count <= limit, count };
}

/** Current count for a bucket without incrementing it. */
export async function peekRateLimit(db, bucket, nowSec) {
  const row = await db.prepare('SELECT count FROM rate_limits WHERE bucket = ?1 AND reset_at > ?2').bind(bucket, nowSec).first();
  return row ? row.count : 0;
}

export async function cleanupRateLimits(db, nowSec) {
  await db.prepare('DELETE FROM rate_limits WHERE reset_at < ?1').bind(nowSec).run();
}
