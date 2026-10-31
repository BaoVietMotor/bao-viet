import { routes, icons, ORIGIN, breadcrumbLd } from './_lib.mjs';
import { stats } from '../data/facts.mjs';

export default {
  id: 'story',
  path: routes.story,
  ogType: 'article',
  title: {
    vi: 'Câu chuyện Bảo Việt Motor | Người sáng lập Bao (Simba) Nguyen',
    en: 'The Bảo Việt Motor story | Founder Bao (Simba) Nguyen',
  },
  description: {
    vi: 'Bao (Simba) Nguyen tự thiết kế khoang chống ngập, tự tìm xưởng và đặt làm mẫu, rồi nhấn chìm một chiếc Yamaha R15 bên trong để thử.',
    en: 'Bao (Simba) Nguyen designed the flood enclosure, found a factory, ordered samples, then fully submerged a Yamaha R15 inside one to test it.',
  },
  jsonld: (ctx) => [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: ctx.t('Câu chuyện Bảo Việt Motor', 'The Bảo Việt Motor story'),
      url: `${ORIGIN}${ctx.url('story')}`,
      about: { '@type': 'Organization', name: ctx.cfg.brand.name, founder: { '@type': 'Person', name: ctx.cfg.founder.name } },
    },
    breadcrumbLd(ctx, 'story', ctx.t('Câu chuyện', 'Story')),
  ],

  body(ctx) {
    const { t, url, img, esc, priceBoth, brand, cfg, cite } = ctx;
    const s = cfg.product.specs;
    const n = ctx.formatInt;
    const founder = esc(cfg.founder.name);
    const step = (title, text) => `<li class="rv"><h3>${title}</h3><p>${text}</p></li>`;
    return `
<section class="page-hero">
  <div class="wrap narrow">
    <nav class="crumbs" aria-label="${t('Đường dẫn', 'Breadcrumb')}"><a href="${url('home')}">${t('Trang chủ', 'Home')}</a> / <span aria-current="page">${t('Câu chuyện', 'Story')}</span></nav>
    <p class="label">${t('Câu chuyện', 'Story')}</p>
    <h1 class="h2">${t('Một người. Một sản phẩm. Làm từ con số 0.', 'One founder. One product. Built from zero.')}</h1>
    <p class="lead mt-s">${t(`${esc(brand)} do ${founder} sáng lập. Đây là những gì mình đã làm, theo thứ tự.`, `${esc(brand)} was founded by ${founder}. Here's what I did, in order.`)}</p>
  </div>
</section>

<section class="s-light" aria-labelledby="letter-h">
  <div class="wrap split top">
    <div class="letter rv">
      <h2 class="sr-only" id="letter-h">${t('Thư của người sáng lập', 'A note from the founder')}</h2>
      <p>${t(`Mình là ${founder}. Mình lập ra ${esc(brand)} và tự làm từ con số 0.`, `I'm ${founder}. I founded ${esc(brand)} and built it from zero.`)}</p>
      <ul class="bul">
        <li>${t(`Tự thiết kế: khoang kín ${n(s.internalLengthMm)} × ${n(s.internalWidthMm)} × ${n(s.internalHeightMm)} mm, một khóa dọc nóc, bốn khoen neo`, `Designed it: a sealed ${n(s.internalLengthMm)} × ${n(s.internalWidthMm)} × ${n(s.internalHeightMm)} mm enclosure, one zipper on top, four anchor rings`)}</li>
        <li>${t('Tự tìm xưởng, đặt mẫu, lo vận chuyển', 'Found the factory, ordered samples, handled shipping')}</li>
        <li>${t('Tự nhấn chìm một chiếc Yamaha R15 bên trong. Nước không vào. (Thử nghiệm cá nhân, không phải kiểm định phòng thí nghiệm.)', 'Sank a Yamaha R15 inside it. No water got in. (My own test, not a laboratory certification.)')}</li>
        <li>${t(`Lô đầu tiên: ${cfg.launch.firstBatchUnits} chiếc, ra mắt tại các đại lý đối tác`, `First batch: ${cfg.launch.firstBatchUnits} units, launching at partner dealerships`)}</li>
      </ul>
      <p>${t('Có câu hỏi? Nhắn Zalo hoặc email. Tin tới thẳng chỗ mình.', 'Questions? Zalo or email me. It comes straight to me.')}</p>
      <p class="sign">${founder}<small>${t(`Người sáng lập ${esc(brand)}`, `Founder, ${esc(brand)}`)}</small></p>
    </div>
    <div class="grid g2 rv">
      <figure class="photo">${img('real-ridein', { alt: t('Khoang Bảo Việt Motor mở sẵn trên đường, chiếc Yamaha R15 chuẩn bị chạy vào', 'The Bảo Việt Motor enclosure laid open on the street, a Yamaha R15 about to roll in'), sizes: '(max-width: 820px) 50vw, 260px', eager: true })}
        <figcaption>${t('Mở sẵn.', 'Open.')}</figcaption></figure>
      <figure class="photo">${img('real-sealed', { alt: t('Khoang Bảo Việt Motor đã kéo khóa kín trên đường', 'The Bảo Việt Motor enclosure zipped shut on the street'), sizes: '(max-width: 820px) 50vw, 260px' })}
        <figcaption>${t('Kéo khóa kín.', 'Zipped shut.')}</figcaption></figure>
    </div>
  </div>
</section>

<section aria-labelledby="journey-h">
  <div class="wrap narrow">
    <p class="label">${t('Từng bước', 'Step by step')}</p>
    <h2 class="h2" id="journey-h">${t('Từ câu hỏi tới sản phẩm', 'From a question to a product')}</h2>
    <ol class="log mt">
      ${step(t('Câu hỏi', 'The question'), t(
        `2025: ${n(stats.rain24h.value)} mm mưa trong một ngày ở Bạch Mã (Huế). Khoảng ${n(stats.homesNov.value)} căn nhà miền Trung ngập chỉ trong tháng 11. Bạt phủ che mưa từ trên xuống. Nước dâng từ sàn lên thì sao?`,
        `2025: ${n(stats.rain24h.value)} mm of rain in one day at Bạch Mã (Huế). About ${n(stats.homesNov.value)} homes flooded in central Vietnam in November alone. Covers stop rain from above. What about water rising from the floor?`))}
      ${step(t('Thiết kế', 'Design'), t(
        `Không phải tấm phủ, mà là khoang kín từ sàn lên. PVC ${s.materialGsm} GSM, khóa ≈${s.zipperM} m dọc nóc, 4 khoen neo. Nước vừa làm ướt xe vừa đẩy xe đi, nên phần neo quan trọng ngang phần kín.`,
        `Not a cover: a sealed enclosure, floor up. ${s.materialGsm} GSM PVC, a ≈${s.zipperM} m zipper on top, 4 anchor rings. Water soaks a bike and pushes it around, so anchoring matters as much as sealing.`))}
      ${step(t('Xưởng và mẫu', 'Factory and samples'), t(
        'Tự tìm xưởng, đặt mẫu, lo vận chuyển về kiểm tra.',
        'Found a factory, ordered samples, shipped them back to check.'))}
      ${step(t('Thử nhấn chìm', 'The submersion test'), t(
        'Một chiếc Yamaha R15 chìm hoàn toàn trong khoang mẫu. Nước không vào. Thử nghiệm cá nhân, không phải kiểm định phòng thí nghiệm.',
        'A Yamaha R15 fully submerged inside a sample. No water got in. A personal test, not a laboratory certification.'))}
      ${step(t('Phim và ảnh', 'Film and photos'), t(
        'Phim quay sản phẩm thật quanh chiếc R15 trong hầm xe. Ảnh ngoài đường cũng là sản phẩm thật. Cảnh lũ ở đầu phim là của kênh khác, có ghi nguồn.',
        'The film shows the real product around the R15 in a garage. The street photos are the real product too. The flood footage at the start is from another channel, credited.'))}
      ${step(t('Ra mắt', 'Launch'), t(
        `Lô đầu ${cfg.launch.firstBatchUnits} chiếc tại các đại lý đối tác. Đặt trước ${priceBoth}, chưa trả tiền.`,
        `First batch: ${cfg.launch.firstBatchUnits} units at partner dealerships. Pre-order at ${priceBoth}, nothing to pay yet.`))}
    </ol>
    <p class="tiny mt">${t('Nguồn số liệu', 'Sources')}: ${cite('tuoitre')} · ${cite('vnePhoto')}</p>
  </div>
</section>

<section class="s-2" aria-labelledby="status-h">
  <div class="wrap narrow">
    <p class="label">${t('Hiện tại', 'Right now')}</p>
    <h2 class="h2" id="status-h">${t('Đã có. Chưa có.', "Done. Not yet.")}</h2>
    <div class="grid g2 mt">
      <div class="card rv"><span class="kicker">${t('Đã có', 'Done')}</span>
        <ul class="done-list">
          <li>${t('Sản phẩm thật, màu vàng an toàn', 'A real product in safety yellow')}</li>
          <li>${t('Mẫu làm từ xưởng', 'Samples made by a factory')}</li>
          <li>${t('Một lần thử nhấn chìm với xe thật', 'A full-submersion test with a real bike')}</li>
          <li>${t('Phim giới thiệu, trang web và hệ thống nhận đặt trước', 'A product film, this website and a pre-order system')}</li>
          <li>${t(`Kế hoạch lô đầu ${cfg.launch.firstBatchUnits} chiếc tại đại lý đối tác`, `A first batch of ${cfg.launch.firstBatchUnits} units planned for partner dealerships`)}</li>
        </ul></div>
      <div class="card rv"><span class="kicker">${t('Chưa có', 'Not yet')}</span>
        <ul class="done-list no">
          <li>${t('Kiểm định phòng thí nghiệm hay chỉ số IP', 'Laboratory certification or an IP rating')}</li>
          <li>${t('Phản hồi của khách sau một mùa lũ', 'Customer feedback after a full flood season')}</li>
          <li>${t('Bản rằn ri (đang trong kế hoạch)', 'The camouflage version (planned)')}</li>
        </ul></div>
    </div>
    <div class="btns mt"><a class="btn btn-primary" href="${url('preorder')}">${t('Đặt ngay', 'Order now')} ${icons.arrow}</a><a class="btn btn-ghost" href="${url('verify')}">${t('Trang kiểm chứng', 'Verify page')}</a><a class="btn btn-ghost" href="${url('contact')}">${t('Liên hệ mình', 'Get in touch')}</a></div>
  </div>
</section>`;
  },
};
