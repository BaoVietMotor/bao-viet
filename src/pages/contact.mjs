import { routes, icons, breadcrumbLd, ORIGIN } from './_lib.mjs';
import { msgAttrs, consentBlock } from './preorder.mjs';

export default {
  id: 'contact',
  path: routes.contact,
  title: { vi: 'Liên hệ Bảo Việt Motor: hỏi đáp, hợp tác, bán sỉ', en: 'Contact Bảo Việt Motor: questions, partnerships, wholesale' },
  description: {
    vi: 'Liên hệ thẳng người sáng lập Bảo Việt Motor qua Zalo, điện thoại hoặc email: câu hỏi về sản phẩm, hợp tác và bán sỉ.',
    en: 'Reach the founder of Bảo Việt Motor directly by Zalo, phone or email for product questions, partnerships and wholesale.',
  },
  jsonld: (ctx) => [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: ctx.t('Liên hệ', 'Contact'),
      url: `${ORIGIN}${ctx.url('contact')}`,
    },
    breadcrumbLd(ctx, 'contact', ctx.t('Liên hệ', 'Contact')),
  ],
  scripts: (ctx) => `<script src="/js/forms.js?v=${ctx.assetVersion}" defer></script>`,

  body(ctx) {
    const { t, url, esc, cfg, lang } = ctx;
    const c = cfg.contact;
    return `
<section class="page-hero">
  <div class="wrap narrow">
    <nav class="crumbs" aria-label="${t('Đường dẫn', 'Breadcrumb')}"><a href="${url('home')}">${t('Trang chủ', 'Home')}</a> / <span aria-current="page">${t('Liên hệ', 'Contact')}</span></nav>
    <p class="label">${t('Liên hệ', 'Contact')}</p>
    <h1 class="h2">${t('Nói chuyện thẳng với mình', 'Talk to me directly')}</h1>
    <p class="lead mt-s">${t('Sản phẩm, đại lý, bán sỉ, báo chí. Tin tới thẳng người sáng lập.', 'Product, dealerships, wholesale, press. It goes straight to the founder.')}</p>
  </div>
</section>

<section>
  <div class="wrap layout-order">
    <div class="form-wrap">
      <form id="contactForm" class="form" data-endpoint="/api/contact" data-lang="${lang}" data-require-one="phone,email" ${msgAttrs(ctx)} novalidate>
        <h2 class="h3" style="margin-bottom:4px">${t('Gửi tin nhắn', 'Send a message')}</h2>
        <div class="field" data-field="name"><label for="cname">${t('Họ và tên', 'Full name')}</label>
          <input id="cname" name="name" autocomplete="name" required minlength="2" maxlength="80"><div class="err"></div></div>
        <div class="row">
          <div class="field" data-field="phone"><label for="cphone">${t('Số điện thoại / Zalo', 'Phone / Zalo')}</label>
            <input id="cphone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20"><div class="err"></div></div>
          <div class="field" data-field="email"><label for="cemail">Email</label>
            <input id="cemail" name="email" type="email" autocomplete="email" maxlength="120"><div class="err"></div></div>
        </div>
        <p class="tiny" style="margin-top:-8px">${t('Để lại ít nhất một trong hai: số điện thoại hoặc email.', 'Leave at least one: a phone number or an email.')}</p>
        <div class="field" data-field="topic"><label for="topic">${t('Chủ đề', 'Topic')}</label>
          <select id="topic" name="topic" required>
            <option value="general">${t('Câu hỏi chung', 'General question')}</option>
            <option value="wholesale">${t('Hợp tác / Bán sỉ', 'Partnerships / Wholesale')}</option>
            <option value="press">${t('Báo chí', 'Press')}</option>
            <option value="data">${t('Yêu cầu về dữ liệu cá nhân', 'Personal data request')}</option>
            <option value="other">${t('Khác', 'Other')}</option>
          </select><div class="err"></div></div>
        <div class="field" data-field="message"><label for="message">${t('Nội dung', 'Message')}</label>
          <textarea id="message" name="message" required minlength="5" maxlength="2000"></textarea><div class="err"></div></div>
        <div class="hp" aria-hidden="true"><label for="ccompany">Company</label><input id="ccompany" name="company" tabindex="-1" autocomplete="off"></div>
        ${consentBlock(ctx)}
        <div class="form-status" role="alert"></div>
        <button class="btn btn-primary" type="submit" style="justify-self:start">${t('Gửi tin nhắn', 'Send message')} ${icons.arrow}</button>
      </form>
      <div class="success" id="contactSuccess" tabindex="-1">
        <div class="success-icon">${icons.check}</div>
        <h2 class="h3">${t('Đã gửi tin nhắn.', 'Message sent.')}</h2>
        <p>${t('Mã tham chiếu:', 'Reference:')}</p>
        <div class="ref" data-ref></div>
        <p>${t('Cảm ơn bạn. Mình sẽ trả lời qua số điện thoại hoặc email bạn để lại.', "Thanks. I'll reply using the phone number or email you left.")}</p>
        <a class="btn btn-outline mt-s" href="${url('home')}">${t('Về trang chủ', 'Back to home')}</a>
      </div>
      <noscript><div class="note red"><p>${t('Mẫu liên hệ cần JavaScript. Bạn có thể email', 'The contact form needs JavaScript. You can email')} ${c.email}.</p></div></noscript>
    </div>

    <aside class="order-box" aria-label="${t('Liên hệ trực tiếp', 'Direct contact')}">
      <h2 class="h3" style="margin:0 0 14px">${t('Liên hệ trực tiếp', 'Direct contact')}</h2>
      <div class="contact-cards">
        <a href="https://zalo.me/${c.zalo}" target="_blank" rel="noopener">${icons.chat}<span><b>Zalo</b><span>${c.phoneDisplay}</span></span></a>
        <a href="tel:${c.phoneE164}">${icons.phone}<span><b>${t('Điện thoại', 'Phone')}</b><span>${c.phoneDisplay}</span></span></a>
        <a href="mailto:${c.email}">${icons.mail}<span><b>Email</b><span>${c.email}</span></span></a>
      </div>
      <p class="tiny" style="margin-top:16px">${t('Người sáng lập', 'Founder')}: ${esc(cfg.founder.name)}</p>
    </aside>
  </div>
</section>`;
  },
};
