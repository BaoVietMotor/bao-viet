/**
 * JSON API
 *
 *   GET    /api/health                       → liveness + database check
 *   POST   /api/preorder                     → create a pre-order (public)
 *   POST   /api/contact                      → send a message (public)
 *   GET    /api/admin/submissions            → list + stats            (admin)
 *   PATCH  /api/admin/submissions/:id        → update status / note     (admin)
 *   DELETE /api/admin/submissions/:id        → delete (data-erasure)    (admin)
 *   GET    /api/admin/export.csv?type=...    → CSV download             (admin)
 */
import cfg from '../../site.config.mjs';
import { validatePreorder, validateContact, looksLikeBot, cleanText } from './validate.js';
import {
  ensureSchema, insertSubmission, findRecentPreorder, listSubmissions, stats,
  updateSubmission, deleteSubmission, allForExport, makeRef, STATUSES,
} from './db.js';
import { json, rateLimit, requireAdmin, sameOrigin, applySecurityHeaders } from './security.js';
import { notifyNewSubmission } from './notify.js';

const MAX_BODY = 16 * 1024;
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

async function readJson(request) {
  const type = request.headers.get('Content-Type') || '';
  if (!type.toLowerCase().startsWith('application/json')) return { error: json({ ok: false, error: 'unsupported_media_type' }, 415) };
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > MAX_BODY) return { error: json({ ok: false, error: 'payload_too_large' }, 413) };
  const text = await request.text();
  if (text.length > MAX_BODY) return { error: json({ ok: false, error: 'payload_too_large' }, 413) };
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('not an object');
    return { body };
  } catch {
    return { error: json({ ok: false, error: 'invalid_json' }, 400) };
  }
}

async function publicSubmit(request, env, ctx, kind) {
  if (!sameOrigin(request, env)) return json({ ok: false, error: 'forbidden' }, 403);
  const { body, error } = await readJson(request);
  if (error) return error;

  // Bots get a convincing success so they don't retry. Nothing is stored.
  if (looksLikeBot(body)) return json({ ok: true, ref: makeRef(cfg.brand.orderPrefix) });

  await ensureSchema(env.DB);
  if (!(await rateLimit(env, request, kind, 5, 3600))) {
    return json({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': '600' });
  }

  const result = kind === 'preorder' ? validatePreorder(body) : validateContact(body);
  if (!result.ok) return json({ ok: false, error: 'validation', fields: result.errors }, 400);
  const v = result.value;

  if (kind === 'preorder') {
    const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
    const existing = await findRecentPreorder(env.DB, v.phone, since);
    if (existing) return json({ ok: true, ref: existing.ref, duplicate: true });
  }

  const record = { type: kind, consentVersion: cfg.legal.privacyVersion, ...v };
  const { ref } = await insertSubmission(env.DB, record, kind === 'preorder' ? cfg.brand.orderPrefix : `${cfg.brand.orderPrefix}M`);
  ctx.waitUntil(notifyNewSubmission(env, { ...record, ref }));
  return json({ ok: true, ref }, 201);
}

function csvCell(v) {
  if (v === null || v === undefined) return '';
  let s = String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // neutralise spreadsheet formula injection
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows) {
  const cols = ['ref', 'type', 'status', 'created_at', 'name', 'phone', 'email', 'province', 'bike', 'quantity', 'contact_pref', 'topic', 'message', 'admin_note', 'lang', 'consent_at', 'consent_version'];
  const lines = [cols.join(',')].concat(rows.map((r) => cols.map((c) => csvCell(r[c])).join(',')));
  return '﻿' + lines.join('\r\n') + '\r\n'; // BOM so Excel shows Vietnamese correctly
}

async function admin(request, env, path) {
  await ensureSchema(env.DB); // the lockout counter lives in the database, so tables must exist first
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const url = new URL(request.url);

  if (path === '/api/admin/submissions' && request.method === 'GET') {
    const p = url.searchParams;
    const [list, s] = await Promise.all([
      listSubmissions(env.DB, { type: p.get('type'), status: p.get('status'), q: p.get('q'), limit: p.get('limit'), offset: p.get('offset') }),
      stats(env.DB),
    ]);
    return json({ ok: true, ...list, stats: s });
  }

  const m = path.match(/^\/api\/admin\/submissions\/(\d+)$/);
  if (m) {
    const id = Number(m[1]);
    if (request.method === 'PATCH') {
      if (!sameOrigin(request, env)) return json({ ok: false, error: 'forbidden' }, 403);
      const { body, error } = await readJson(request);
      if (error) return error;
      const patch = {};
      if (body.status !== undefined) {
        if (!STATUSES.includes(body.status)) return json({ ok: false, error: 'validation', fields: { status: 'invalid' } }, 400);
        patch.status = body.status;
      }
      if (body.adminNote !== undefined) patch.adminNote = cleanText(String(body.adminNote), 2000, { multiline: true }) || null;
      const row = await updateSubmission(env.DB, id, patch);
      return row ? json({ ok: true, item: row }) : json({ ok: false, error: 'not_found' }, 404);
    }
    if (request.method === 'DELETE') {
      if (!sameOrigin(request, env)) return json({ ok: false, error: 'forbidden' }, 403);
      return (await deleteSubmission(env.DB, id)) ? json({ ok: true }) : json({ ok: false, error: 'not_found' }, 404);
    }
  }

  if (path === '/api/admin/export.csv' && request.method === 'GET') {
    const type = url.searchParams.get('type');
    const rows = await allForExport(env.DB, type);
    const headers = new Headers({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${cfg.brand.nameAscii.replace(/\s+/g, '-').toLowerCase()}-${type || 'all'}-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    });
    applySecurityHeaders(headers);
    return new Response(toCsv(rows), { status: 200, headers });
  }

  return json({ ok: false, error: 'not_found' }, 404);
}

export async function handleApi(request, env, ctx) {
  const path = new URL(request.url).pathname.replace(/\/+$/, '') || '/';
  try {
    if (!env.DB) return json({ ok: false, error: 'database_not_bound' }, 503);

    if (path === '/api/health') {
      if (request.method !== 'GET' && request.method !== 'HEAD') return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'GET, HEAD' });
      let db = 'ok';
      try { await ensureSchema(env.DB); await env.DB.prepare('SELECT 1 AS one').first(); } catch { db = 'error'; }
      return json({ ok: db === 'ok', db, time: new Date().toISOString() }, db === 'ok' ? 200 : 503);
    }
    if (path === '/api/preorder' || path === '/api/contact') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });
      return await publicSubmit(request, env, ctx, path === '/api/preorder' ? 'preorder' : 'contact');
    }
    if (path.startsWith('/api/admin/')) return await admin(request, env, path);
    return json({ ok: false, error: 'not_found' }, 404);
  } catch (err) {
    console.error('api error', path, err && err.stack ? err.stack : err);
    return json({ ok: false, error: 'server_error' }, 500);
  }
}
