/**
 * Shared rendering helpers: routing, formatting, responsive images, icons, layout.
 * Absolute URLs use the placeholder __ORIGIN__. The Worker swaps in the live domain at request
 * time, so canonical links and the sitemap are right on workers.dev and on a custom domain.
 */
import { readFileSync } from 'node:fs';
import { sources } from '../data/facts.mjs';

const images = JSON.parse(readFileSync(new URL('../data/images.json', import.meta.url), 'utf8'));

export const ORIGIN = '__ORIGIN__';

// English is the default language (at "/"); Vietnamese lives under "/vi/".
export const routes = {
  home:     { en: '/',                        vi: '/vi/' },
  product:  { en: '/product/',                vi: '/vi/san-pham/' },
  story:    { en: '/story/',                  vi: '/vi/cau-chuyen/' },
  floods:   { en: '/floods-and-motorbikes/',  vi: '/vi/lu-va-xe-may/' },
  faq:      { en: '/faq/',                    vi: '/vi/hoi-dap/' },
  verify:   { en: '/verify/',                 vi: '/vi/kiem-chung/' },
  preorder: { en: '/pre-order/',              vi: '/vi/dat-truoc/' },
  contact:  { en: '/contact/',                vi: '/vi/lien-he/' },
  privacy:  { en: '/privacy/',                vi: '/vi/chinh-sach-bao-mat/' },
  terms:    { en: '/terms/',                  vi: '/vi/dieu-khoan/' },
};

/** Old addresses (before English became the default) and where they live now. Used by the Worker for 301s. */
export const legacyRedirects = Object.fromEntries(Object.values(routes).flatMap((r) => [
  r.en === '/' ? ['/en/', '/'] : [`/en${r.en}`, r.en],
  r.vi === '/vi/' ? null : [r.vi.replace(/^\/vi/, ''), r.vi],
].filter(Boolean)));

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function formatVND(n, lang) {
  const digits = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'vi' ? '.' : ',');
  return lang === 'vi' ? `${digits} ₫` : `₫${digits}`;
}
export function formatInt(n, lang) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'vi' ? '.' : ',');
}

export function makeContext(lang, cfg, assetVersion) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  const pick = (obj) => (obj && typeof obj === 'object' && 'vi' in obj ? obj[lang] : obj);
  const url = (id, l = lang) => routes[id][l];
  const brand = cfg.brand.name;
  const usd = `$${formatInt(cfg.product.priceUSD, 'en')}`;
  const vnd = `≈${formatVND(cfg.product.priceVND, lang)}`;
  /** Short price for buttons and headlines. */
  const price = usd;
  const was = `$${formatInt(cfg.product.regularPriceUSD, 'en')}`;
  /** Price in both currencies, e.g. "$100 (≈2.600.000 ₫)". */
  const priceBoth = `${usd} (${vnd})`;

  /** Responsive WebP image with intrinsic size (prevents layout shift). Every browser in use today reads WebP. */
  const img = (name, { alt, sizes = '100vw', eager = false, cls = '' } = {}) => {
    const m = images[name];
    if (!m) throw new Error(`Unknown image "${name}"`);
    const fallbackW = m.sizes.includes(960) ? 960 : m.sizes[m.sizes.length - 1];
    const set = m.sizes.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');
    return `<img${cls ? ` class="${cls}"` : ''} src="/img/${name}-${fallbackW}.webp" srcset="${set}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}"`
      + `${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}>`;
  };

  /** Media in a plain frame with an optional small label in the corner. */
  const hud = (inner, { tags = [] } = {}) => `<div class="frame">${inner}`
    + (tags[0] ? `<span class="tag" aria-hidden="true">${esc(tags[0][1])}</span>` : '') + '</div>';

  /** URL of a cited source. */
  const sourceUrl = (key) => {
    const s = sources[key];
    if (!s) throw new Error(`Unknown source "${key}"`);
    return s.url;
  };

  /** Inline source citation link. */
  const cite = (key) => {
    const s = sources[key];
    if (!s) throw new Error(`Unknown source "${key}"`);
    return `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.name)}</a>`;
  };

  return { lang, other: lang === 'vi' ? 'en' : 'vi', t, pick, url, brand, price, priceBoth, usd, vnd, was, cfg, img, hud, cite, sourceUrl, esc, assetVersion, formatInt: (n) => formatInt(n, lang) };
}

/* ---------------------------------------------------------------- icons */
const I = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
export const icons = {
  zipper: I('<path d="M12 2v20"/><path d="M9 5h6M9 9h6M9 13h6M9 17h6"/>'),
  anchor: I('<circle cx="12" cy="5" r="3"/><path d="M12 8v14"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>'),
  layers: I('<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>'),
  roll: I('<rect x="3" y="7" width="18" height="10" rx="5"/><circle cx="8" cy="12" r="2"/>'),
  eye: I('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'),
  drop: I('<path d="M12 2.7s7 7.3 7 12.3a7 7 0 0 1-14 0c0-5 7-12.3 7-12.3z"/>'),
  shield: I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
  ruler: I('<path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4z"/><path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2"/>'),
  phone: I('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  mail: I('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>'),
  chat: I('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  check: I('<path d="M20 6 9 17l-5-5"/>'),
  arrow: '<span class="arrow" aria-hidden="true">→</span>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>',
};

/* ---------------------------------------------------------------- head */
function head(ctx, page) {
  const { lang, cfg, t } = ctx;
  const title = ctx.pick(page.title);
  const description = ctx.pick(page.description);
  const path = page.path[lang];
  const ogImage = `${ORIGIN}/img/og-${lang}.jpg`;
  const alternates = page.path.en
    ? `<link rel="alternate" hreflang="vi" href="${ORIGIN}${page.path.vi}">
<link rel="alternate" hreflang="en" href="${ORIGIN}${page.path.en}">
<link rel="alternate" hreflang="x-default" href="${ORIGIN}${page.path.en}">` : '';
  const jsonld = (page.jsonld ? page.jsonld(ctx) : [])
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<link rel="canonical" href="${ORIGIN}${path}">
${alternates}
<meta name="theme-color" content="#111110">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(cfg.brand.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${ORIGIN}${path}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t('Khoang chống ngập Bảo Việt Motor màu vàng đóng kín quanh một chiếc mô tô trong hầm để xe', 'A yellow Bảo Việt Motor flood enclosure zipped shut around a motorcycle in a parking garage'))}">
<meta property="og:locale" content="${lang === 'vi' ? 'vi_VN' : 'en_US'}">
<meta property="og:locale:alternate" content="${lang === 'vi' ? 'en_US' : 'vi_VN'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/css/site.css?v=${ctx.assetVersion}">
${page.preload || ''}
<!--SITE_VERIFICATION-->
${jsonld}
</head>`;
}

/* ---------------------------------------------------------------- header */
function header(ctx, page) {
  const { t, url, lang, cfg } = ctx;
  const nav = [
    ['product', t('Sản phẩm', 'Product')],
    ['floods', t('Lũ & xe máy', 'Floods')],
    ['story', t('Câu chuyện', 'Story')],
    ['faq', t('Hỏi đáp', 'FAQ')],
    ['verify', t('Kiểm chứng', 'Verify')],
    ['contact', t('Liên hệ', 'Contact')],
  ];
  const links = nav.map(([id, label]) => `<li><a href="${url(id)}"${page.id === id ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
  const otherHref = page.path[ctx.other] || url('home', ctx.other);
  const langSwitch = lang === 'vi'
    ? `<a href="${otherHref}" hreflang="en" lang="en" data-lang-switch="en" aria-label="Switch to English">EN</a><span lang="vi">VI</span>`
    : `<span lang="en">EN</span><a href="${otherHref}" hreflang="vi" lang="vi" data-lang-switch="vi" aria-label="Chuyển sang tiếng Việt">VI</a>`;
  const n = cfg.launch.firstBatchUnits;
  return `<a class="skip" href="#main">${t('Đến nội dung chính', 'Skip to content')}</a>
<header class="site-header">
  <a class="launch" href="${url('preorder')}">
    <span class="launch-tag">${t('Ra mắt', 'Launch')}</span>
    <span class="launch-txt"><b>${t(`Lô đầu tiên: ${n} chiếc`, `First batch: ${n} units`)}</b> <span>${t('tại các đại lý đối tác', 'at partner dealerships')}</span><span class="launch-more">${t('. Đặt ngay', '. Order now')}</span></span>
    <span class="launch-go" aria-hidden="true">→</span>
  </a>
  <div class="wrap nav">
    <a class="brand" href="${url('home')}" aria-label="${esc(cfg.brand.name)}, ${t('trang chủ', 'home')}">
      <img src="/img/logo-96.png" width="96" height="76" alt="">
      <span><b>${esc(cfg.brand.name)}</b><small>${esc(cfg.brand.slogan)}</small></span>
    </a>
    <ul class="nav-links" id="nav-links">${links}</ul>
    <div class="nav-tools">
      <div class="lang" role="group" aria-label="${t('Ngôn ngữ', 'Language')}">${langSwitch}</div>
      <a class="btn btn-primary btn-sm" href="${url('preorder')}">${t('Đặt ngay', 'Order now')}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
    </div>
  </div>
</header>`;
}

/* ---------------------------------------------------------------- footer */
function footer(ctx) {
  const { t, url, cfg } = ctx;
  const notice = cfg.brand.showNonAffiliationNotice
    ? `<p class="tiny mt-s">${t(
      `${esc(cfg.brand.name)} làm khoang chống ngập cho xe máy. Mình không liên quan gì đến Tập đoàn Bảo Việt hay bất kỳ công ty bảo hiểm nào, và đây không phải sản phẩm bảo hiểm.`,
      `${esc(cfg.brand.name)} makes flood enclosures for motorcycles. It has no connection to Bao Viet Holdings (Tập đoàn Bảo Việt) or any insurance company, and this is not an insurance product.`)}</p>`
    : '';
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <img src="/img/logo-192.png" width="192" height="152" alt="${esc(cfg.brand.name)}" loading="lazy">
        <p style="margin:0;font-weight:800">${esc(cfg.brand.name)}</p>
        <p class="tiny" style="margin:4px 0 0">${t('Khoang chống ngập kín nước, neo xuống sàn, cho xe máy và mô tô. Thiết kế tại Việt Nam.', 'A sealed, floor-anchored flood enclosure for motorcycles. Designed in Vietnam.')}</p>
        ${notice}
      </div>
      <nav aria-label="${t('Sản phẩm', 'Product')}">
        <h2>${t('Sản phẩm', 'Product')}</h2>
        <ul>
          <li><a href="${url('product')}">${t('Thông số và kích thước', 'Specs and sizing')}</a></li>
          <li><a href="${url('home')}#cach-dung">${t('Cách dùng', 'How it works')}</a></li>
          <li><a href="${url('preorder')}">${t('Đặt ngay', 'Order now')}</a></li>
          <li><a href="${url('faq')}">${t('Hỏi đáp', 'FAQ')}</a></li>
        </ul>
      </nav>
      <nav aria-label="${t('Về Bảo Việt Motor', 'About')}">
        <h2>${t('Về Bảo Việt Motor', 'About')}</h2>
        <ul>
          <li><a href="${url('story')}">${t('Câu chuyện', 'Story')}</a></li>
          <li><a href="${url('verify')}">${t('Kiểm chứng thông tin', 'Verify what we say')}</a></li>
          <li><a href="${url('floods')}">${t('Lũ và xe máy: video, ảnh, báo chí', 'Floods and motorbikes: videos, photos, press')}</a></li>
          <li><a href="${url('privacy')}">${t('Chính sách bảo mật', 'Privacy policy')}</a></li>
          <li><a href="${url('terms')}">${t('Điều khoản', 'Terms')}</a></li>
        </ul>
      </nav>
      <div>
        <h2>${t('Liên hệ', 'Contact')}</h2>
        <ul>
          <li><a href="mailto:${cfg.contact.email}">${cfg.contact.email}</a></li>
          <li><a href="tel:${cfg.contact.phoneE164}">${cfg.contact.phoneDisplay}</a></li>
          <li><a href="https://zalo.me/${cfg.contact.zalo}" target="_blank" rel="noopener">Zalo: ${cfg.contact.phoneDisplay}</a></li>
          <li><a href="${url('contact')}">${t('Gửi tin nhắn', 'Send a message')}</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© ${cfg.year} ${esc(cfg.brand.name)}. ${t('Người sáng lập', 'Founder')}: ${esc(cfg.founder.name)}.</span>
      <span>${t('Chưa có chứng nhận phòng thí nghiệm. Lần thử nhấn chìm do người sáng lập tự làm.', 'No laboratory certification yet. The submersion test was done by the founder.')}</span>
    </div>
  </div>
</footer>`;
}

/* ---------------------------------------------------------------- page */
export function renderPage(ctx, page) {
  const body = page.body(ctx);
  return `<!DOCTYPE html>
<html lang="${ctx.lang}">
${head(ctx, page)}
<body class="page-${page.id}">
${header(ctx, page)}
<main id="main">
${body}
</main>
${footer(ctx)}
<script src="/js/site.js?v=${ctx.assetVersion}" defer></script>
${page.scripts ? page.scripts(ctx) : ''}
</body>
</html>
`;
}

/* ---------------------------------------------------------------- shared blocks */
export function pageHero(ctx, { label, title, lead, crumbs = true, id }) {
  const crumb = crumbs
    ? `<nav class="crumbs" aria-label="${ctx.t('Đường dẫn', 'Breadcrumb')}"><a href="${ctx.url('home')}">${ctx.t('Trang chủ', 'Home')}</a> / <span aria-current="page">${ctx.esc(label)}</span></nav>` : '';
  return `<section class="page-hero"${id ? ` id="${id}"` : ''}><div class="wrap narrow">
${crumb}
<p class="label">${label}</p>
<h1 class="h2">${title}</h1>
${lead ? `<p class="lead mt-s">${lead}</p>` : ''}
</div></section>`;
}

export function breadcrumbLd(ctx, pageId, name) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: ctx.t('Trang chủ', 'Home'), item: `${ORIGIN}${ctx.url('home')}` },
      { '@type': 'ListItem', position: 2, name, item: `${ORIGIN}${ctx.url(pageId)}` },
    ],
  };
}

export function productLd(ctx) {
  const { cfg, t } = ctx;
  const s = cfg.product.specs;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t(`${cfg.brand.name}: khoang chống ngập cho xe máy`, `${cfg.brand.name} motorcycle flood enclosure`),
    description: t(
      `Khoang bảo vệ kín nước bằng bạt PVC ${s.materialGsm} GSM, khóa kéo chống nước khoảng ${s.zipperM} m dọc nóc, ${s.anchorPoints} khoen kim loại neo sàn. Lòng trong ${s.internalLengthMm} × ${s.internalWidthMm} × ${s.internalHeightMm} mm.`,
      `Sealed protective enclosure in ${s.materialGsm} GSM PVC tarpaulin with a ~${s.zipperM} m waterproof top zipper and ${s.anchorPoints} metal floor-anchor rings. Internal clearance ${s.internalLengthMm} × ${s.internalWidthMm} × ${s.internalHeightMm} mm.`),
    image: [`${ORIGIN}/img/garage-1440.webp`, `${ORIGIN}/img/real-sealed-960.webp`, `${ORIGIN}/img/step-zip-1440.webp`],
    brand: { '@type': 'Brand', name: cfg.brand.name },
    color: cfg.product.colourNow[ctx.lang],
    material: 'PVC-coated polyester tarpaulin',
    weight: { '@type': 'QuantitativeValue', value: s.weightKg, unitCode: 'KGM' },
    offers: {
      '@type': 'Offer',
      url: `${ORIGIN}${ctx.url('preorder')}`,
      priceCurrency: 'USD',
      price: String(cfg.product.priceUSD),
      availability: `https://schema.org/${cfg.product.availability}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: cfg.brand.name },
    },
  };
}
