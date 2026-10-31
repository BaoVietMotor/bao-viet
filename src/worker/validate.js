/**
 * Server-side validation for public forms. Never trust the browser: every field is
 * re-checked, trimmed, length-limited and normalised here before it touches the database.
 * Error codes match the message keys used by static/js/forms.js.
 */
import { PROVINCES, OUTSIDE_VN } from '../data/provinces.mjs';

export const PHONE_RE = /^(0\d{9,10}|\+\d{8,15})$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTACT_PREFS = ['zalo', 'phone', 'email'];
export const TOPICS = ['general', 'wholesale', 'press', 'data', 'other'];
const PROVINCE_SET = new Set([...PROVINCES, OUTSIDE_VN]);

/** Trim, collapse whitespace, strip control characters, cap length. */
export function cleanText(v, max, { multiline = false } = {}) {
  if (typeof v !== 'string') return '';
  let s = v.normalize('NFC');
  s = multiline
    ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n')
    : s.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ');
  s = s.trim();
  return s.length > max ? s.slice(0, max) : s;
}

/** Strip separators; store Vietnamese numbers in one canonical form (+84xxxxxxxxx → 0xxxxxxxxx). */
export function normalizePhone(v) {
  if (typeof v !== 'string') return '';
  const s = v.replace(/[\s.\-()]/g, '');
  return /^\+84\d{9,10}$/.test(s) ? `0${s.slice(3)}` : s;
}

/** Returns true when the submission looks automated (honeypot filled or submitted implausibly fast). */
export function looksLikeBot(body) {
  if (typeof body.company === 'string' && body.company.trim() !== '') return true;
  const ms = Number(body.elapsedMs);
  if (Number.isFinite(ms) && ms >= 0 && ms < 2000) return true;
  return false;
}

function common(body, errors) {
  const name = cleanText(body.name, 80);
  if (name.length < 2) errors.name = 'name';
  const phone = normalizePhone(body.phone).slice(0, 20);
  if (phone && !PHONE_RE.test(phone)) errors.phone = 'phone';
  const email = cleanText(body.email, 120).toLowerCase();
  if (email && !EMAIL_RE.test(email)) errors.email = 'email';
  if (body.consent !== true) errors.consent = 'consent';
  const lang = body.lang === 'en' ? 'en' : 'vi';
  return { name, phone: phone || null, email: email || null, lang };
}

export function validatePreorder(body) {
  const errors = {};
  if (!body || typeof body !== 'object') return { ok: false, errors: { form: 'required' } };
  const base = common(body, errors);
  if (!base.phone && !errors.phone) errors.phone = 'required';

  const province = cleanText(body.province, 60);
  if (!PROVINCE_SET.has(province)) errors.province = 'required';

  const quantity = Number.parseInt(body.quantity, 10);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) errors.quantity = 'required';

  const contactPref = CONTACT_PREFS.includes(body.contactPref) ? body.contactPref : 'zalo';
  if (contactPref === 'email' && !base.email && !errors.email) errors.email = 'required';

  const value = {
    ...base,
    province,
    quantity: Number.isInteger(quantity) ? quantity : null,
    contactPref,
    bike: cleanText(body.bike, 80) || null,
    message: cleanText(body.note, 1000, { multiline: true }) || null,
  };
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

export function validateContact(body) {
  const errors = {};
  if (!body || typeof body !== 'object') return { ok: false, errors: { form: 'required' } };
  const base = common(body, errors);
  if (!base.phone && !base.email && !errors.phone && !errors.email) {
    errors.phone = 'contactOne';
    errors.email = 'contactOne';
  }
  const topic = TOPICS.includes(body.topic) ? body.topic : null;
  if (!topic) errors.topic = 'required';
  const message = cleanText(body.message, 2000, { multiline: true });
  if (message.length < 5) errors.message = 'required';
  const value = { ...base, topic, message };
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
