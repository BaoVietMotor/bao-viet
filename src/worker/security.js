/** Security helpers: response headers, hashing, admin authentication, rate limiting. */
import { hitRateLimit, peekRateLimit, cleanupRateLimits } from './db.js';

export const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https://upload.wikimedia.org https://thumb.wikimedia.org https://i.ytimg.com",
  "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
  "media-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
  "connect-src 'self'",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

export function applySecurityHeaders(headers, { https = true } = {}) {
  headers.set('Content-Security-Policy', CSP);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  if (https) headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return headers;
}

export function json(data, status = 200, extra = {}) {
  const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra });
  applySecurityHeaders(headers);
  return new Response(JSON.stringify(data), { status, headers });
}

const enc = new TextEncoder();
export async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time comparison of two equal-length hex digests. */
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const clientIp = (request) => request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() || 'unknown';

async function bucketFor(env, request, route, windowSec) {
  const nowSec = Math.floor(Date.now() / 1000);
  const windowStart = nowSec - (nowSec % windowSec);
  const salt = `${env.ADMIN_PASSWORD || ''}|bao-viet-rl`;
  const bucket = await sha256Hex(`${salt}|${route}|${clientIp(request)}|${windowStart}`);
  return { bucket, nowSec, resetAt: windowStart + windowSec };
}

/**
 * Fixed-window rate limit on a hashed (route, IP) key. Raw IPs are never stored.
 * Returns true when the request is allowed.
 */
export async function rateLimit(env, request, route, limit, windowSec) {
  const { bucket, nowSec, resetAt } = await bucketFor(env, request, route, windowSec);
  const { allowed } = await hitRateLimit(env.DB, bucket, resetAt, limit);
  if (Math.random() < 0.05) await cleanupRateLimits(env.DB, nowSec).catch(() => {});
  return allowed;
}

/**
 * Admin authentication via "Authorization: Bearer <ADMIN_PASSWORD>".
 * Returns null on success, or a Response to send back.
 */
export async function requireAdmin(request, env) {
  const configured = typeof env.ADMIN_PASSWORD === 'string' ? env.ADMIN_PASSWORD : '';
  if (configured.length < 12) {
    return json({ ok: false, error: 'admin_not_configured', message: 'Set an ADMIN_PASSWORD secret of at least 12 characters.' }, 503);
  }
  // Lock out an IP after too many *failed* attempts; check before comparing so guessing stays slow.
  const FAIL_LIMIT = 10, WINDOW = 900;
  const { bucket, nowSec, resetAt } = await bucketFor(env, request, 'admin-fail', WINDOW);
  if (await peekRateLimit(env.DB, bucket, nowSec) >= FAIL_LIMIT) {
    return json({ ok: false, error: 'rate_limited' }, 429, { 'Retry-After': String(resetAt - nowSec) });
  }

  const header = request.headers.get('Authorization') || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  const [a, b] = await Promise.all([sha256Hex(given), sha256Hex(configured)]);
  if (!given || !safeEqual(a, b)) {
    await hitRateLimit(env.DB, bucket, resetAt, FAIL_LIMIT);
    return json({ ok: false, error: 'unauthorized' }, 401, { 'WWW-Authenticate': 'Bearer' });
  }
  return null;
}

/** Reject cross-site writes: if the browser sends an Origin, it must be ours. */
export function sameOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // non-browser clients; still rate-limited and validated
  const own = new URL(request.url).origin;
  const site = env.SITE_URL ? new URL(env.SITE_URL).origin : null;
  return origin === own || (site && origin === site);
}
