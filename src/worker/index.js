/**
 * Cloudflare Worker entry point.
 * - /api/*  → JSON API backed by D1 (see api.js)
 * - old /en/... and Vietnamese page addresses → 301 to their new home (see legacy.js)
 * - else    → static site from ./public, with security headers, caching rules,
 *             and the live origin written into canonical/hreflang/OG/sitemap URLs.
 */
import { handleApi } from './api.js';
import { applySecurityHeaders } from './security.js';
import { legacyTarget } from './legacy.js';

const REWRITE_TYPES = /^(text\/html|application\/xml|text\/xml|text\/plain|application\/manifest\+json)/i;

function cacheControlFor(path) {
  if (path.startsWith('/admin')) return 'no-store';
  if (path.startsWith('/css/') || path.startsWith('/js/')) return 'public, max-age=31536000, immutable'; // URLs carry ?v=<hash>
  if (path.startsWith('/img/') || path.startsWith('/video/') || /\/(favicon|apple-touch-icon|icon-\d+)/.test(path)) return 'public, max-age=604800';
  if (path === '/sitemap.xml' || path === '/robots.txt') return 'public, max-age=3600';
  return 'public, max-age=0, must-revalidate';
}

/** Serve a byte range from a full-body asset response by streaming (no full buffering). */
function sliceRange(res, rangeHeader) {
  const total = Number(res.headers.get('Content-Length'));
  const m = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader || '');
  if (!m || !Number.isFinite(total) || total <= 0) return null;
  let start = m[1] === '' ? total - Number(m[2]) : Number(m[1]);
  let end = m[1] === '' ? total - 1 : (m[2] === '' ? total - 1 : Number(m[2]));
  if (!(start >= 0) || start >= total || end < start) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${total}` } });
  }
  end = Math.min(end, total - 1);
  let pos = 0;
  const { readable, writable } = new TransformStream({
    transform(chunk, controller) {
      const chunkStart = pos, chunkEnd = pos + chunk.byteLength - 1;
      pos += chunk.byteLength;
      if (chunkEnd < start || chunkStart > end) return;
      controller.enqueue(chunk.subarray(Math.max(0, start - chunkStart), Math.min(chunk.byteLength, end - chunkStart + 1)));
      if (chunkEnd >= end) controller.terminate();
    },
  });
  res.body.pipeTo(writable).catch(() => {});
  const headers = new Headers(res.headers);
  headers.set('Content-Range', `bytes ${start}-${end}/${total}`);
  headers.set('Content-Length', String(end - start + 1));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(readable, { status: 206, headers });
}

async function serveStatic(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  let res = await env.ASSETS.fetch(request);

  // Byte ranges for video (iOS Safari requires them). Use the platform's 206 if it provides one.
  const range = request.headers.get('Range');
  if (range && path.startsWith('/video/') && res.status === 200 && request.method === 'GET') {
    const sliced = sliceRange(res, range);
    if (sliced) res = sliced;
  }

  const headers = new Headers(res.headers);
  const type = headers.get('Content-Type') || '';
  let body = res.body;

  if (res.status === 200 || res.status === 404) {
    if (REWRITE_TYPES.test(type) && request.method === 'GET') {
      const origin = (env.SITE_URL || url.origin).replace(/\/+$/, '');
      let text = (await res.text()).replaceAll('__ORIGIN__', origin);
      if (type.startsWith('text/html') && env.GOOGLE_SITE_VERIFICATION) {
        const token = String(env.GOOGLE_SITE_VERIFICATION).replace(/[^A-Za-z0-9_\-]/g, '');
        text = text.replace('<!--SITE_VERIFICATION-->', `<meta name="google-site-verification" content="${token}">`);
      }
      body = text;
      headers.delete('Content-Length');
      headers.delete('ETag');
    }
  }

  headers.set('Cache-Control', cacheControlFor(path));
  if (path.startsWith('/video/')) headers.set('Accept-Ranges', 'bytes');
  if (path.startsWith('/admin')) headers.set('X-Robots-Tag', 'noindex, nofollow');
  applySecurityHeaders(headers, { https: url.protocol === 'https:' });
  return new Response(request.method === 'HEAD' ? null : body, { status: res.status, statusText: res.statusText, headers });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return handleApi(request, env, ctx);
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    const moved = legacyTarget(url.pathname);
    if (moved) {
      const headers = new Headers({ Location: `${moved}${url.search}`, 'Cache-Control': 'public, max-age=3600' });
      applySecurityHeaders(headers, { https: url.protocol === 'https:' });
      return new Response(null, { status: 301, headers });
    }
    return serveStatic(request, env);
  },
};
