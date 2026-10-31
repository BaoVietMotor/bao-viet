import { icons } from './_lib.mjs';

/** Single bilingual 404 page (served by the platform for unknown URLs). */
export default {
  id: 'notfound',
  path: { en: '/404.html' },
  noindex: true,
  title: { en: 'Page not found | Bảo Việt Motor', vi: 'Không tìm thấy trang | Bảo Việt Motor' },
  description: { en: 'The page you are looking for does not exist.', vi: 'Trang bạn tìm không tồn tại.' },
  body() {
    return `
<section class="page-hero" style="min-height:60vh;display:flex;align-items:center">
  <div class="wrap narrow center">
    <p class="label">404</p>
    <h1 class="h2">Page not found. <span class="y" lang="vi">Không tìm thấy trang.</span></h1>
    <p class="lead mt-s" style="margin-left:auto;margin-right:auto">The link may have changed. <span lang="vi">Có thể đường dẫn đã đổi.</span></p>
    <div class="btns mt" style="justify-content:center">
      <a class="btn btn-primary" href="/">Home ${icons.arrow}</a>
      <a class="btn btn-ghost" href="/vi/" lang="vi">Trang tiếng Việt</a>
    </div>
  </div>
</section>`;
  },
};
