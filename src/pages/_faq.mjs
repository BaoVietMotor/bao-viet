import { faq } from '../data/faq.mjs';

/** Fill {brand}, {price}, {units}, {nonAffiliation} placeholders in FAQ text. */
export function faqText(ctx, s) {
  const na = ctx.cfg.brand.showNonAffiliationNotice
    ? ctx.t(' Sản phẩm này cũng không liên quan đến Tập đoàn Bảo Việt.', ' It is also not affiliated with Bao Viet Holdings (Tập đoàn Bảo Việt).')
    : '';
  return s.replaceAll('{brand}', ctx.brand).replaceAll('{price}', ctx.priceBoth)
    .replaceAll('{units}', String(ctx.cfg.launch.firstBatchUnits)).replaceAll('{nonAffiliation}', na);
}

export function faqItems(ctx, filter = () => true) {
  return faq.filter(filter).map((f) => ({ q: faqText(ctx, f.q[ctx.lang]), a: faqText(ctx, f.a[ctx.lang]), group: f.group }));
}

export function faqHtml(ctx, items) {
  return `<div class="faq">${items.map((f) => `
  <details><summary>${ctx.esc(f.q)}</summary><div class="answer"><p>${ctx.esc(f.a)}</p></div></details>`).join('')}
</div>`;
}

export function faqLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
