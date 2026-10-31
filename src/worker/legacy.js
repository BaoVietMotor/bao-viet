/**
 * Old page addresses from before English became the default language, and where they live now.
 * The Worker answers these with a permanent (301) redirect so old links and search results keep working.
 * A test checks this list against the routes in src/pages/_lib.mjs.
 */
export const LEGACY = {
  '/en/': '/',
  '/en/product/': '/product/',
  '/en/story/': '/story/',
  '/en/floods-and-motorbikes/': '/floods-and-motorbikes/',
  '/en/faq/': '/faq/',
  '/en/verify/': '/verify/',
  '/en/pre-order/': '/pre-order/',
  '/en/contact/': '/contact/',
  '/en/privacy/': '/privacy/',
  '/en/terms/': '/terms/',
  '/san-pham/': '/vi/san-pham/',
  '/cau-chuyen/': '/vi/cau-chuyen/',
  '/lu-va-xe-may/': '/vi/lu-va-xe-may/',
  '/hoi-dap/': '/vi/hoi-dap/',
  '/kiem-chung/': '/vi/kiem-chung/',
  '/dat-truoc/': '/vi/dat-truoc/',
  '/lien-he/': '/vi/lien-he/',
  '/chinh-sach-bao-mat/': '/vi/chinh-sach-bao-mat/',
  '/dieu-khoan/': '/vi/dieu-khoan/',
};

/** Returns the new path for an old one, or null. Accepts paths with or without the trailing slash. */
export function legacyTarget(pathname) {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return Object.prototype.hasOwnProperty.call(LEGACY, p) ? LEGACY[p] : null;
}
