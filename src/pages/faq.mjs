import { routes, icons, breadcrumbLd, pageHero } from './_lib.mjs';
import { faqItems, faqHtml, faqLd } from './_faq.mjs';

export default {
  id: 'faq',
  path: routes.faq,
  title: {
    vi: 'Hỏi đáp về túi chống ngập xe máy Bảo Việt Motor',
    en: 'Bảo Việt Motor motorcycle flood enclosure: FAQ',
  },
  description: {
    vi: 'Bảo Việt Motor khác bạt phủ xe thế nào, có chắc chắn chống ngập không, neo ra sao, đặt trước và thanh toán thế nào. Trả lời thẳng.',
    en: 'How Bảo Việt Motor differs from a bike cover, whether it is guaranteed, how to anchor it, and how pre-ordering works. Straight answers.',
  },
  jsonld: (ctx) => [faqLd(faqItems(ctx)), breadcrumbLd(ctx, 'faq', ctx.t('Hỏi đáp', 'FAQ'))],

  body(ctx) {
    const { t, url } = ctx;
    const product = faqItems(ctx, (f) => f.group === 'product');
    const order = faqItems(ctx, (f) => f.group === 'order');
    return `
${pageHero(ctx, {
  label: t('Hỏi đáp', 'FAQ'),
  title: t('Những câu hay được hỏi', 'Questions people ask'),
  lead: t('Có cả những câu trả lời không dễ nghe, như chuyện sản phẩm chưa có kiểm định phòng thí nghiệm.', "Including the less comfortable answers, like the fact that there's no laboratory certification yet."),
})}
<section>
  <div class="wrap narrow">
    <div class="faq-group" style="margin-top:0"><h2>${t('Về sản phẩm', 'About the product')}</h2>${faqHtml(ctx, product)}</div>
    <div class="faq-group"><h2>${t('Đặt trước & mua hàng', 'Pre-ordering & buying')}</h2>${faqHtml(ctx, order)}</div>
    <div class="card mt-l">
      <h3>${t('Chưa thấy câu hỏi của bạn?', "Didn't find your question?")}</h3>
      <p>${t('Gửi cho mình. Tin nhắn tới thẳng chỗ người sáng lập.', 'Send it to me. Messages go straight to the founder.')}</p>
      <div class="btns mt-s"><a class="btn btn-primary" href="${url('contact')}">${t('Đặt câu hỏi', 'Ask a question')} ${icons.arrow}</a><a class="btn btn-ghost" href="${url('preorder')}">${t('Đặt ngay', 'Order now')}</a></div>
    </div>
  </div>
</section>`;
  },
};
