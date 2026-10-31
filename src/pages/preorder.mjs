import { routes, icons, breadcrumbLd, productLd } from './_lib.mjs';
import { PROVINCES, OUTSIDE_VN } from '../data/provinces.mjs';

/** Client-side validation messages, passed to /js/forms.js via data attributes. */
export const formMessages = (t) => ({
  required: t('Vui lòng điền thông tin này.', 'Please fill this in.'),
  name: t('Vui lòng nhập họ tên (2 đến 80 ký tự).', 'Please enter your name (2 to 80 characters).'),
  phone: t('Số điện thoại chưa đúng. Ví dụ: 0933 026 969 hoặc +84 933 026 969.', 'That phone number doesn\'t look right. Example: 0933 026 969 or +84 933 026 969.'),
  email: t('Email chưa đúng định dạng.', 'That email address doesn\'t look right.'),
  consent: t('Vui lòng đánh dấu ô này để mình có thể liên hệ với bạn.', 'Please tick this box so I can contact you.'),
  contactOne: t('Vui lòng để lại số điện thoại hoặc email.', 'Please leave a phone number or an email.'),
  network: t('Không gửi được. Vui lòng kiểm tra kết nối và thử lại, hoặc liên hệ trực tiếp qua Zalo/điện thoại.', 'Couldn\'t send. Please check your connection and try again, or contact us directly by Zalo/phone.'),
  rate: t('Bạn đã gửi quá nhiều lần. Vui lòng thử lại sau ít phút.', 'Too many attempts. Please try again in a few minutes.'),
  server: t('Có lỗi xảy ra phía máy chủ. Vui lòng thử lại, hoặc liên hệ trực tiếp qua Zalo/điện thoại.', 'Something went wrong on our side. Please try again, or contact us directly by Zalo/phone.'),
  sending: t('Đang gửi…', 'Sending…'),
});

export const msgAttrs = (ctx) => Object.entries(formMessages(ctx.t))
  .map(([k, v]) => `data-msg-${k}="${ctx.esc(v)}"`).join(' ');

export function consentBlock(ctx) {
  const { t, url } = ctx;
  return `<div class="check" data-field="consent">
    <input type="checkbox" id="consent" name="consent" value="yes" required>
    <label for="consent">${t(
      `Tôi đồng ý để ${ctx.esc(ctx.brand)} lưu trữ và sử dụng thông tin trên để liên hệ với tôi về yêu cầu này, theo <a href="${url('privacy')}" target="_blank">Chính sách bảo mật</a>. Tôi có thể rút lại sự đồng ý bất cứ lúc nào.`,
      `I agree that ${ctx.esc(ctx.brand)} may store and use the information above to contact me about this request, as described in the <a href="${url('privacy')}" target="_blank">Privacy Policy</a>. I can withdraw my consent at any time.`)}</label>
  </div>`;
}

export default {
  id: 'preorder',
  path: routes.preorder,
  title: { en: 'Pre-order the Bảo Việt Motor flood enclosure | $100', vi: 'Đặt trước khoang chống ngập Bảo Việt Motor | 100 USD' },
  description: {
    en: 'Pre-order the Bảo Việt Motor flood enclosure for $100 (about ₫2,600,000). First batch: 100 units. Nothing to pay upfront, cancel any time. I confirm by phone or Zalo.',
    vi: 'Đặt trước khoang chống ngập Bảo Việt Motor giá 100 USD (khoảng 2.600.000 ₫). Lô đầu 100 chiếc. Không trả trước, hủy lúc nào cũng được. Mình xác nhận qua điện thoại hoặc Zalo.',
  },
  jsonld: (ctx) => [productLd(ctx), breadcrumbLd(ctx, 'preorder', ctx.t('Đặt ngay', 'Order now'))],
  scripts: (ctx) => `<script src="/js/forms.js?v=${ctx.assetVersion}" defer></script>`,

  body(ctx) {
    const { t, url, img, esc, usd, vnd, was, brand, cfg, lang } = ctx;
    const provinceOptions = PROVINCES.map((p) => `<option value="${esc(p)}">${esc(p === 'TP. Hồ Chí Minh' && lang === 'en' ? 'Ho Chi Minh City' : p)}</option>`).join('')
      + `<option value="${OUTSIDE_VN}">${t('Ngoài Việt Nam', 'Outside Vietnam')}</option>`;
    const qtyOptions = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
    return `
<section class="page-hero">
  <div class="wrap narrow">
    <nav class="crumbs" aria-label="${t('Đường dẫn', 'Breadcrumb')}"><a href="${url('home')}">${t('Trang chủ', 'Home')}</a> / <span aria-current="page">${t('Đặt ngay', 'Order now')}</span></nav>
    <p class="label">${t('Đặt ngay', 'Order now')}</p>
    <h1 class="h2">${t(`Giữ một chiếc trong lô đầu ${cfg.launch.firstBatchUnits} chiếc`, `Hold one from the first ${cfg.launch.firstBatchUnits}`)}</h1>
    <p class="lead mt-s">${t('Không trả gì bây giờ. Mình gọi xác nhận trước khi bạn trả bất kỳ khoản nào.', "Pay nothing now. I'll confirm with you before you pay anything.")}</p>
  </div>
</section>

<section>
  <div class="wrap layout-order">
    <div class="form-wrap">
      <form id="preorderForm" class="form" data-endpoint="/api/preorder" data-lang="${lang}" ${msgAttrs(ctx)} novalidate>
        <h2 class="h3" style="margin-bottom:4px">${t('Thông tin của bạn', 'Your details')}</h2>
        <div class="row">
          <div class="field" data-field="name"><label for="name">${t('Họ và tên', 'Full name')}</label>
            <input id="name" name="name" autocomplete="name" required minlength="2" maxlength="80"><div class="err"></div></div>
          <div class="field" data-field="phone"><label for="phone">${t('Số điện thoại / Zalo', 'Phone / Zalo')}</label>
            <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20" placeholder="09xx xxx xxx"><div class="err"></div></div>
        </div>
        <div class="row">
          <div class="field" data-field="email"><label for="email">Email <span class="opt">(${t('không bắt buộc', 'optional')})</span></label>
            <input id="email" name="email" type="email" autocomplete="email" maxlength="120"><div class="err"></div></div>
          <div class="field" data-field="province"><label for="province">${t('Tỉnh / thành phố', 'Province / city')}</label>
            <select id="province" name="province" required><option value="">${t('Chọn tỉnh, thành', 'Choose one')}</option>${provinceOptions}</select><div class="err"></div></div>
        </div>
        <div class="row">
          <div class="field" data-field="bike"><label for="bike">${t('Dòng xe', 'Your bike')} <span class="opt">(${t('không bắt buộc', 'optional')})</span></label>
            <input id="bike" name="bike" maxlength="80" placeholder="${t('VD: Yamaha R15, Honda SH…', 'e.g. Yamaha R15, Honda SH…')}"><div class="err"></div></div>
          <div class="field" data-field="quantity"><label for="quantity">${t('Số lượng', 'Quantity')}</label>
            <select id="quantity" name="quantity" required>${qtyOptions}</select><div class="err"></div></div>
        </div>
        <fieldset class="field" data-field="contactPref" style="border:0;padding:0;margin:0">
          <legend style="font-weight:700;font-size:.92rem;margin-bottom:7px">${t('Liên hệ với tôi qua', 'Contact me by')}</legend>
          <div class="btns" style="gap:18px">
            <label class="check" style="grid-template-columns:22px auto"><input type="radio" name="contactPref" value="zalo" checked> Zalo</label>
            <label class="check" style="grid-template-columns:22px auto"><input type="radio" name="contactPref" value="phone"> ${t('Gọi điện', 'Phone call')}</label>
            <label class="check" style="grid-template-columns:22px auto"><input type="radio" name="contactPref" value="email"> Email</label>
          </div>
        </fieldset>
        <div class="field" data-field="note"><label for="note">${t('Ghi chú', 'Notes')} <span class="opt">(${t('không bắt buộc', 'optional')})</span></label>
          <textarea id="note" name="note" maxlength="1000" placeholder="${t('Câu hỏi, thời gian tiện liên hệ…', 'Questions, best time to reach you…')}"></textarea><div class="err"></div></div>
        <div class="hp" aria-hidden="true"><label for="company">Company</label><input id="company" name="company" tabindex="-1" autocomplete="off"></div>
        ${consentBlock(ctx)}
        <div class="form-status" role="alert"></div>
        <button class="btn btn-primary" type="submit" style="justify-self:start">${t('Đặt ngay', 'Order now')} ${icons.arrow}</button>
        <p class="tiny">${t('Gửi mẫu này không có nghĩa là bạn phải trả tiền.', "Sending this form doesn't commit you to paying.")}</p>
      </form>
      <div class="success" id="preorderSuccess" tabindex="-1">
        <div class="success-icon">${icons.check}</div>
        <h2 class="h3">${t('Mình đã nhận đơn đặt trước của bạn.', 'Got your pre-order.')}</h2>
        <p>${t('Mã đơn của bạn:', 'Your order reference:')}</p>
        <div class="ref" data-ref></div>
        <p class="small" data-dup hidden>${t('Số điện thoại này đã đặt trước gần đây. Đây là mã đơn cũ, mình không tạo đơn trùng.', 'This phone number pre-ordered recently. This is your existing reference, so no duplicate was created.')}</p>
        <p>${t('Mình sẽ liên hệ để xác nhận số lượng, phí giao và thời gian giao. Bạn chưa phải trả gì.', "I'll be in touch to confirm the quantity, delivery cost and timing. You haven't paid anything.")}</p>
        <p class="small">${t('Hãy lưu lại mã đơn. Cần hỗ trợ? Zalo/điện thoại', 'Keep this reference. Need help? Zalo/phone')} <a href="tel:${cfg.contact.phoneE164}">${cfg.contact.phoneDisplay}</a>.</p>
        <a class="btn btn-outline mt-s" href="${url('home')}">${t('Về trang chủ', 'Back to home')}</a>
      </div>
      <noscript><div class="note red"><p>${t('Mẫu đặt trước cần JavaScript. Bạn có thể đặt trực tiếp qua Zalo/điện thoại', 'The pre-order form needs JavaScript. You can also order directly by Zalo/phone')} ${cfg.contact.phoneDisplay} ${t('hoặc email', 'or email')} ${cfg.contact.email}.</p></div></noscript>
    </div>

    <aside class="order-box" aria-label="${t('Tóm tắt đơn', 'Order summary')}">
      ${img('garage', { alt: t('Khoang Bảo Việt Motor đã kéo khóa kín quanh một chiếc mô tô trong hầm xe', 'The Bảo Việt Motor enclosure zipped shut around a motorcycle in a garage'), sizes: '(max-width: 900px) 100vw, 360px' })}
      <p class="small" style="margin:0">${esc(brand)}, ${t('khoang chống ngập cho xe máy', 'motorcycle flood enclosure')}</p>
      <p class="price"><s class="was">${was}</s> ${usd}<span class="small" style="font-weight:600"> / ${t('bộ', 'unit')}</span></p>
      <p class="small" style="margin:-6px 0 0;font-weight:700">${vnd}</p>
      <p class="small">${t('Màu', 'Colour')}: ${cfg.product.colourNow[lang]} · ${t(`Lô đầu ${cfg.launch.firstBatchUnits} chiếc`, `First batch: ${cfg.launch.firstBatchUnits} units`)}</p>
      <h3 style="font-size:1rem;margin:22px 0 10px">${t('Sau khi bạn gửi', 'After you send it')}</h3>
      <ol>
        <li>${t('Bạn nhận mã đơn ngay trên màn hình.', 'You get an order reference on screen straight away.')}</li>
        <li>${t('Mình liên hệ xác nhận số lượng, phí giao và thời gian.', 'I get in touch to confirm the quantity, delivery cost and timing.')}</li>
        <li>${t('Bạn đồng ý thì mới thanh toán. Trước đó hủy lúc nào cũng được.', 'You only pay once you agree. Until then you can cancel any time.')}</li>
      </ol>
      <p class="tiny" style="margin-top:16px">${t('Xem thêm', 'See also')}: <a href="${url('terms')}#dat-truoc">${t('Điều khoản đặt trước', 'Pre-order terms')}</a></p>
    </aside>
  </div>
</section>`;
  },
};
