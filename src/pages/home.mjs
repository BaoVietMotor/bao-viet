import { routes, icons, ORIGIN, productLd } from './_lib.mjs';
import { stats, cases, diyWeaknesses, engineRiskShort, market, superbikes, fitExample, repairCost, insurance, nhaTrang } from '../data/facts.mjs';
import { simWithout, simWith, anchorPlan, anchorSide } from './_art.mjs';
import { faqItems, faqHtml } from './_faq.mjs';
import { vkVideo } from '../data/media.mjs';
import { ytCard, commonsFig, loopClip } from './_media.mjs';
import { heroCredit } from '../data/hero.mjs';

/** Sections that stay on the home page; the rest are moved to the product and floods pages. */
const HOME_KEEP = ['hero-title', 'real-h', 'film-title', 'van-de-h', 'giai-phap-h', 'features-title', 'how-title', 'why-short', 'founder-title', 'test-title', 'faq-title', 'cta-title'];
export const MOVED = { product: ['dang-dau-tu-h', 'gap-title', 'specs-title'], floods: ['risk-title', 'stats-title'] };
/** Split the page into top-level blocks keyed by aria-labelledby, keep the listed ones in order. */
export function pickSections(html, ids) {
  const parts = html.split(/(?=<!-- [^\n]*-->\n|<section |<nav class="chapnav"|<div class="hazard")/);
  const keyOf = (p) => (p.match(/<section[^>]*aria-labelledby="([^"]+)"/) || [])[1];
  return parts.filter((p) => {
    if (p.startsWith('<!--')) return false;
    if (p.startsWith('<nav class="chapnav"') || p.startsWith('<div class="hazard"')) return ids.includes('hero-title');
    const k = keyOf(p); return k && ids.includes(k);
  }).map((p) => ids.includes(keyOf(p)) && !p.startsWith('<section') ? p : p).join('\n');
}

export default {
  id: 'home',
  path: routes.home,
  title: {
    en: 'Bảo Việt Motor | Flood enclosure for motorcycles',
    vi: 'Bảo Việt Motor | Khoang chống ngập cho xe máy và mô tô',
  },
  description: {
    en: 'A sealed, tie-down flood enclosure for motorcycles. 600 GSM PVC, one waterproof zipper, 4 anchor rings. First batch: 100 units. Pre-order for $100 (about ₫2,600,000), nothing to pay yet.',
    vi: 'Khoang chống ngập kín nước, neo xuống sàn, cho xe máy và mô tô. Bạt PVC 600 GSM, một khóa kéo chống nước, 4 khoen neo. Lô đầu 100 chiếc. Đặt trước 100 USD (khoảng 2.600.000 ₫), chưa cần trả tiền.',
  },
  preload: '<link rel="preload" as="image" type="image/webp" href="/img/hero-ai-1344.webp" imagesrcset="/img/hero-ai-960.webp 960w, /img/hero-ai-1344.webp 1344w" imagesizes="240vh">',

  jsonld(ctx) {
    const { cfg, t } = ctx;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: cfg.brand.name,
        alternateName: cfg.brand.nameAscii,
        url: `${ORIGIN}/`,
        logo: `${ORIGIN}/img/logo-400.png`,
        slogan: cfg.brand.slogan,
        email: cfg.contact.email,
        telephone: cfg.contact.phoneE164,
        founder: { '@type': 'Person', name: cfg.founder.name },
        contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: cfg.contact.phoneE164, email: cfg.contact.email, availableLanguage: ['en', 'vi'] }],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: cfg.brand.name,
        alternateName: [cfg.brand.nameAscii, cfg.brand.slogan],
        url: `${ORIGIN}${ctx.url('home')}`,
        inLanguage: ctx.lang === 'vi' ? 'vi-VN' : 'en',
      },
      productLd(ctx),
      {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: t(`${cfg.brand.name}: phim giới thiệu`, `${cfg.brand.name}: product film`),
        description: t('Mở đầu bằng cảnh một chiếc mô tô bị ngập, sau đó là cảnh dựng khoang chống ngập Bảo Việt Motor quanh một chiếc Yamaha R15: trải ra, dắt xe vào, kéo khóa kín.', 'Opens on a flooded motorcycle, then shows a Bảo Việt Motor enclosure being set up around a Yamaha R15: roll it out, wheel the bike in, zip it shut.'),
        thumbnailUrl: [`${ORIGIN}/img/poster-1280.webp`],
        contentUrl: `${ORIGIN}/video/bao-viet-film.mp4`,
        uploadDate: cfg.legal.effectiveDate,
        duration: 'PT53S',
      },
    ];
  },

  body(ctx) { return pickSections(this.fullBody(ctx), HOME_KEEP); },

  fullBody(ctx) {
    const { t, url, img, cite, esc, price, priceBoth, usd, vnd, was, brand, cfg, lang } = ctx;
    const s = cfg.product.specs;
    const P = cfg.product.priceVND;
    const n = cfg.launch.firstBatchUnits;
    const dims = `${ctx.formatInt(s.internalLengthMm)} × ${ctx.formatInt(s.internalWidthMm)} × ${ctx.formatInt(s.internalHeightMm)} mm`;
    const src = (...keys) => `<div class="src">${t('Nguồn', 'Source')}: ${keys.map(cite).join(' · ')}</div>`;
    const stat = (k, cls = '') => {
      const st = stats[k];
      const value = st.display ? st.display[lang] : ctx.formatInt(st.value);
      const count = st.value && !st.display ? ` data-count="${st.value}"` : '';
      const unit = st.unit ? `<b>${st.unit[lang]}</b> ` : '';
      return `<div class="stat rv"><div class="v ${cls}"${count}>${value}</div><p>${unit}${esc(st.short[lang])}</p>${src(...st.sources)}</div>`;
    };
    const pct = (value) => `${(P / value * 100).toFixed(2).replace('.', lang === 'vi' ? ',' : '.')}%`;
    const money = (v) => {
      if (v >= 1e9) return lang === 'vi' ? `${(v / 1e9).toFixed(3).replace('.', ',')} tỷ ₫` : `₫${(v / 1e9).toFixed(3)} billion`;
      return lang === 'vi' ? `${ctx.formatInt(v / 1e6)} triệu ₫` : `₫${ctx.formatInt(v / 1e6)} million`;
    };
    const faqs = faqItems(ctx).filter((_, i) => [0, 1, 2, 9].includes(i));
    const chapter = (id, cls, num, label, title, lead) => `
<header class="chapter ${cls}" id="${id}">
  <div class="wrap">
    <p class="num">${num} · ${label}</p>
    <h2 id="${id}-h">${title}</h2>
    <p class="lead">${lead}</p>
  </div>
</header>`;
    const fitRow = (label, bike, inside) => `<div class="fitbar"><div class="lbl"><span>${label}</span><span>${ctx.formatInt(bike)} / ${ctx.formatInt(inside)} mm · ${t('dư', 'spare')} ${ctx.formatInt(inside - bike)}</span></div><div class="track"><div class="fill" style="width:${(bike / inside * 100).toFixed(1)}%"></div></div></div>`;
    const c = heroCredit;

    const html = `
<!-- HERO -->
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-media">${img('hero-ai', { alt: t(c.alt.vi, c.alt.en), eager: true, sizes: '240vh' })}</div>
  <div class="wrap">
    <div class="hero-top"><img src="/img/logo-192.png" width="192" height="152" alt=""><span>${esc(brand)}<small>${esc(cfg.brand.slogan)}</small></span></div>
    <h1 class="display" id="hero-title">${t('Bạn đã sẵn sàng cho mùa bão chưa?', 'Are you ready for the storm?')}</h1>
    <p class="lead">${t('Bảo vệ xe máy của bạn khỏi nước lũ với khoang bạt PVC kín nước của chúng tôi, làm ra để chống lại những trận lũ chết người ở Việt Nam.', "Protect your motorcycle from floodwater with our PVC-tarpaulin watertight cover, built to combat Vietnam's deadly floods.")}</p>
    <p class="founded">${t(`Sáng lập bởi ${esc(cfg.founder.name)} năm ${cfg.founder.year}`, `Founded by ${esc(cfg.founder.name)} in ${cfg.founder.year}`)}</p>
    <div class="launch-sign" role="note">
      <p class="ls-top">${t('Ra mắt lô đầu tiên', 'Launching 1st batch')}</p>
      <p class="ls-units"><b>${n}</b> ${t('CHIẾC', 'UNITS')}</p>
      <p class="ls-top">${t('tại các đại lý đối tác', 'at partner dealerships')}</p>
      <p class="ls-big">${t('GIẢM 50%', '50% OFF')}</p>
      <p class="ls-price"><s>${was}</s> <b>${usd}</b> <span>${vnd}</span></p>
      <p class="ls-note">${t(`Giá ra mắt cho lô đầu. Giá thường: ${was}.`, `Launch price for the first batch. Regular price: ${was}.`)}</p>
    </div>
    <div class="btns">
      <a class="btn btn-primary" href="${url('preorder')}">${t('Đặt ngay', 'Order now')} ${icons.arrow}</a>
      <a class="btn btn-ghost" href="#phim">${t('Xem video demo', 'Watch the demo')}</a>
    </div>
    <ul class="ticks">
      <li>${t('Không trả trước', 'Pay nothing now')}</li>
      <li>${t('Hủy bất cứ lúc nào', 'Cancel any time')}</li>
      <li>${t('Đã tự thử nhấn chìm', 'Founder-tested underwater')}</li>
    </ul>
  </div>
  <p class="hero-note"><a href="${url('verify')}#nguon-anh">${t('Ảnh AI', 'AI image')}</a></p>
</section>
<nav class="chapnav" aria-label="${t('Nội dung trang', 'On this page')}">
  <div class="wrap">
    <a href="#van-de" class="cn-p"><b>01</b> ${t('Vấn đề', 'The problem')}</a>
    <a href="#giai-phap" class="cn-s"><b>02</b> ${t('Giải pháp', 'The solution')}</a>
    <a href="#dang-dau-tu" class="cn-w"><b>03</b> ${t('Vì sao đáng đầu tư', "Why it's worth it")}</a>
  </div>
</nav>

<!-- REAL PHOTOS -->
<section aria-labelledby="real-h">
  <div class="wrap">
    <p class="label">${t('Ảnh thật', 'Real photos')}</p>
    <h2 class="h2" id="real-h">${t('Sản phẩm thật. Xe thật.', 'Real product. Real bike.')}</h2>
    <div class="proof mt">
      <figure class="photo rv">${img('real-ridein', { alt: t('Khoang Bảo Việt Motor màu vàng mở sẵn trên đường, một người ngồi trên chiếc Yamaha R15 màu xanh chuẩn bị chạy vào', 'A yellow Bảo Việt Motor enclosure laid open on the street while a rider on a blue Yamaha R15 gets ready to roll in'), sizes: '(max-width: 820px) 50vw, 300px' })}
        <figcaption>${t('Mở sẵn. R15 chuẩn bị vào.', 'Open. R15 rolling in.')}</figcaption></figure>
      <figure class="photo rv">${img('real-sealed', { alt: t('Khoang Bảo Việt Motor màu vàng đã kéo khóa kín, đặt trên đường trước hàng rào cây xanh', 'The yellow Bảo Việt Motor enclosure zipped shut on a street in front of a hedge'), sizes: '(max-width: 820px) 50vw, 300px' })}
        <figcaption>${t('Kéo khóa. Kín.', 'Zipped. Sealed.')}</figcaption></figure>
      <figure class="photo wide rv">${loopClip(ctx, 'sealed', { tags: [['tl', t('Clip từ phim', 'Clip from the film')]] })}
        <figcaption>${t('Trong hầm xe, cắt từ phim.', 'In a garage, cut from the film.')}</figcaption></figure>
    </div>
    <p class="tiny mt-s">${t('Hình minh họa luôn được ghi rõ.', 'Illustrations are always labelled.')}</p>
  </div>
</section>

<!-- FILM -->
<section class="s-2" id="phim" aria-labelledby="film-title">
  <div class="wrap">
    <p class="label">${t('Phim giới thiệu', 'The film')}</p>
    <h2 class="h2" id="film-title">${t('Video demo: 30 giây để triển khai', 'Demo video: 30 seconds to deploy')}</h2>
    <div class="film mt rv" id="film" role="button" tabindex="0" aria-label="${t('Phát phim giới thiệu, 53 giây, có tiếng', 'Play the product film, 53 seconds, with sound')}">
      ${img('poster', { alt: '', sizes: '(max-width: 1180px) 100vw, 1116px' })}
      <video preload="none" playsinline controls poster="/img/poster-1280.webp" aria-label="${t('Phim giới thiệu Bảo Việt Motor', 'Bảo Việt Motor product film')}">
        <source src="/video/bao-viet-film.mp4" type="video/mp4">
      </video>
      <div class="film-ui">
        <h3>${t('Cả hầm xe để trần. Một chiếc được bọc.', 'A garage of bare bikes. One sealed.')}</h3>
        <p>${t('Sản phẩm thật, Yamaha R15. Bật tiếng, 0:53.', 'Real product, Yamaha R15. Sound on, 0:53.')}</p>
        <span class="play-pill">${icons.play} ${t('Xem phim', 'Play the film')}</span>
      </div>
    </div>
    <noscript><p class="mt-s"><a class="btn btn-primary" href="/video/bao-viet-film.mp4">${t('Mở phim (MP4)', 'Open the film (MP4)')}</a></p></noscript>
    <p class="tiny mt-s">${t('Quay với sản phẩm thật, màu vàng an toàn. Cảnh xe ngập ở đầu phim: Vuong Khang Motor.', 'Filmed with the real product in safety yellow. Opening flood footage: Vuong Khang Motor.')}</p>
  </div>
</section>

<!-- ============================ 01 · THE PROBLEM ============================ -->
<section class="chsec" aria-labelledby="van-de-h">
${chapter('van-de', 'ch-problem', '01', t('Vấn đề', 'The problem'),
  t('Khóa được cửa nhà xe. Không khóa được nước.', "You can lock the garage. Not the water."),
  t('Miền Trung ngập mỗi mùa mưa. Nước rút: xe chết máy, xếp hàng chờ sửa, tiệm sửa quá tải.',
    'Central Vietnam floods every rainy season. After: dead engines, long queues, overloaded repair shops.'))}
  <div class="wrap">
    <div class="cgal cgal-home">
      ${commonsFig(ctx, 'hueAerial2020')}
      ${commonsFig(ctx, 'qnPush')}
      ${commonsFig(ctx, 'qnWade')}
    </div>
    <div class="split top mt-l">
      <div class="rv">${ytCard(ctx, vkVideo, { featured: true, caption: esc(vkVideo.note[lang]) })}</div>
      <div class="rv">
        <div class="stat big-stat"><div class="v y">1.000+</div><p><b>${t('xe máy', 'motorbikes')}</b> ${t('sửa trong 2 ngày tại một điểm sửa miễn phí ở Huế, 10/2025. Nhiều chiếc ngâm nước 3-4 ngày.', 'fixed in 2 days at one free repair point in Huế, Oct 2025. Many sat underwater 3 to 4 days.')}</p>${src('nhandanHue')}</div>
        <div class="stat mt"><div class="v c">2 m+</div><p><b>Nha Trang, ${t('11/2025', 'Nov 2025')}.</b> ${t('Có nơi nước sâu hơn 2 mét, chảy xiết. Xe máy mắc kẹt hoặc bị cuốn trôi trên đường 23 Tháng 10.', 'Water over 2 metres in places, fast-moving. Motorbikes stranded or swept away on 23 Tháng 10 Street.')}</p>${src(nhaTrang.source)}</div>
        <blockquote class="pull mt">
          <p>"${t('...chỉ là một đống sắt đầy bùn đất và không thể khởi động.', '...just a heap of mud-caked metal that would not start.')}"</p>
          <footer>${t('Báo Nhân Dân, về xe máy ở Huế khi nước rút', "Nhân Dân newspaper, on Huế's motorbikes after the flood")}${lang === 'en' ? ' (translated)' : ''}</footer>
        </blockquote>
        <p class="mt"><a class="btn btn-ghost" href="${url('floods')}">${t('Thêm video, ảnh, báo chí', 'More videos, photos and news')} ${icons.arrow}</a></p>
      </div>
    </div>
  </div>
</section>

<section class="s-2" aria-labelledby="risk-title">
  <div class="wrap split top">
    <div>
      <p class="label red">${t('Nước làm gì với chiếc xe', 'What water does to a bike')}</p>
      <h3 class="h2" id="risk-title">${t('Bạt phủ chỉ che mưa. Lũ là chuyện khác.', 'Covers stop rain. Floods are different.')}</h3>
      <p class="lead mt-s">${t('Ba thứ xảy ra cùng lúc:', 'Three things hit at once:')}</p>
    </div>
    <ol class="risk-list">
      <li class="rv"><span class="n">1</span><div><b>${t('Nước vào máy', 'Water in the engine')}</b><span>${esc(engineRiskShort[lang])}</span>${src(engineRiskShort.source)}</div></li>
      <li class="rv"><span class="n">2</span><div><b>${t('Lực đẩy nổi', 'Buoyancy')}</b><span>${t('Nước dâng nhấc xe lên. Không buộc thì xe đổ, trôi, va đập. VnExpress khuyên cột xe vào vật cố định.', 'Rising water lifts an untied bike. It tips, drifts and hits things. VnExpress advises tying vehicles to something fixed.')}</span>${src('vneBags')}</div></li>
      <li class="rv"><span class="n">3</span><div><b>${t('Điện, bùn, rác', 'Electrics, mud, debris')}</b><span>${t('Chập chờn, đoản mạch, tiếp điểm bị ăn mòn. Bùn cát chui vào mọi khe.', 'Flickering faults, short circuits, corroded contacts. Mud in every gap.')}</span>${src(repairCost.source)}</div></li>
    </ol>
  </div>
</section>

<section aria-labelledby="stats-title">
  <div class="wrap">
    <p class="label cyan">${t('Riêng năm 2025', '2025 alone')}</p>
    <h3 class="h2" id="stats-title">${t('2025: năm của những kỷ lục.', '2025: a year of records.')}</h3>
    <div class="grid g2 mt">
      ${stat('rain24h', 'y')}
      ${stat('homesNov', 'c')}
      ${stat('loss2025', 'r')}
      ${stat('motorcycles', 'y')}
    </div>
    <p class="tiny mt">${t('Chưa ai công bố số xe máy hỏng vì lũ. Mình không đoán.', "Nobody has published how many motorbikes floods wreck. I don't guess.")}</p>
  </div>
</section>

<!-- ============================ 02 · THE SOLUTION ============================ -->
<section class="chsec" aria-labelledby="giai-phap-h">
${chapter('giai-phap', 'ch-solution', '02', t('Giải pháp', 'The solution'),
  t('Bọc kín. Neo chặt. Xong.', 'Seal it. Tie it down. Done.'),
  t(`${esc(brand)}: một khoang PVC kín, làm riêng cho xe hai bánh.`, `${esc(brand)}: one sealed PVC enclosure, made for two wheels.`))}
  <div class="wrap">
    <div class="split">
      <figure class="photo rv">${img('garage', { alt: t('Khoang Bảo Việt Motor màu vàng đã kéo khóa kín quanh một chiếc mô tô trong hầm để xe, phía sau là hàng xe không được che', 'The yellow Bảo Việt Motor enclosure zipped shut around a motorcycle in a parking garage, with uncovered bikes behind it'), sizes: '(max-width: 820px) 100vw, 560px' })}<figcaption>${t('Khung hình từ phim.', 'A frame from the film.')}</figcaption></figure>
      <div>
        <div class="kpi-grid">
          <div><b>1</b><span>${t(`cuộn, ≈${s.weightKg} kg`, `roll, ≈${s.weightKg} kg`)}</span></div>
          <div><b>≈${s.zipperM} m</b><span>${t('khóa kéo chống nước', 'waterproof zipper')}</span></div>
          <div><b>${s.anchorPoints}</b><span>${t('khoen neo', 'anchor rings')}</span></div>
          <div><b>${s.materialGsm}</b><span>GSM PVC</span></div>
        </div>
        <ul class="bul mt">
          <li>${t(`Lòng trong ${dims}`, `${dims} inside`)}</li>
          <li>${t(`Vừa ${esc(fitExample.name)} (theo kích thước hãng)`, `Fits a ${esc(fitExample.name)} (published dimensions)`)}</li>
          <li>${t('Màu vàng an toàn: dễ thấy trong bóng tối, dưới nước', 'Safety yellow: easy to spot in the dark and in water')}</li>
        </ul>
      </div>
    </div>
    <div class="sim mt-l rv">
      <figure class="bad"><div class="sim-head">${t(`Không có ${esc(brand)}`, `Without ${esc(brand)}`)}</div>
        ${simWithout(t('Minh họa: nước dâng trong nhà xe, chiếc mô tô không được neo bị nhấc lên và nghiêng', 'Illustration: water rises in a garage and an unanchored motorcycle lifts and tilts'), lang)}
        <figcaption>${t('Nước dâng. Không gì giữ xe lại.', 'Water rises. Nothing holds the bike.')}</figcaption></figure>
      <figure class="good"><div class="sim-head">${t(`Có ${esc(brand)}`, `With ${esc(brand)}`)}</div>
        ${simWith(t('Minh họa: chiếc mô tô nằm trong khoang kín được neo bốn góc xuống sàn khi nước dâng', 'Illustration: a motorcycle inside a sealed enclosure anchored at four corners as water rises'), lang)}
        <figcaption>${t('Nước ở ngoài. Khoang ở yên.', 'Water stays out. Enclosure stays put.')}</figcaption></figure>
    </div>
    <p class="tiny mt-s"><span class="badge illus">${t('Minh họa', 'Illustration')}</span> ${t('Sơ đồ mình tự vẽ, không phải ảnh chụp hay kết quả đo.', 'My own diagrams. Not photos or test results.')}</p>
  </div>
</section>

<section class="s-2" id="tinh-nang" aria-labelledby="features-title">
  <div class="wrap">
    <p class="label">${t('Từng chi tiết', 'Every detail')}</p>
    <h3 class="h2" id="features-title">${t('Bốn thứ làm nên khác biệt.', 'Four things that make the difference.')}</h3>
    <div class="mt-l">
      <div class="feature rv">
        ${loopClip(ctx, 'roll', { tags: [['tl', t(`≈${s.weightKg} kg, một cuộn`, `≈${s.weightKg} kg, one roll`)]] })}
        <div><span class="num">01</span><h3>${t(`Cuộn gọn. ≈${s.weightKg} kg.`, `Rolls up. ≈${s.weightKg} kg.`)}</h3>
        <ul class="bul"><li>${t('Cất trong góc nhà xe', 'Lives in a corner of the garage')}</li><li>${t('Có báo lũ: trải ra, mở khóa, sẵn sàng', 'Flood warning: unroll, unzip, ready')}</li></ul></div>
      </div>
      <div class="feature flip rv">
        ${loopClip(ctx, 'water', { tags: [['tl', t(`Khóa kéo ≈${s.zipperM} m`, `Zipper ≈${s.zipperM} m`)]] })}
        <div><span class="num">02</span><h3>${t(`Một khóa kéo chống nước ≈${s.zipperM} m`, `One ≈${s.zipperM} m waterproof zipper`)}</h3>
        <ul class="bul"><li>${t('Mở rộng: dắt xe thẳng vào, không nhấc, không nghiêng', 'Opens wide: roll straight in, no lifting, no tilting')}</li><li>${t('Một đường khóa liền dọc nóc, không góc nào phải túm', 'One continuous line on top, no corners to gather')}</li></ul>
        <p class="tiny">${t('Clip: dội nước lên khóa. Cảnh trong phim, không phải phép đo.', 'Clip: water poured on the zipper. A film scene, not a measurement.')}</p></div>
      </div>
      <div class="feature rv">
        ${loopClip(ctx, 'tough', { tags: [['tl', `${s.materialGsm} GSM PVC`]] })}
        <div><span class="num">03</span><h3>${t(`Bạt PVC ${s.materialGsm} GSM`, `${s.materialGsm} GSM PVC`)}</h3>
        <ul class="bul"><li>${t('Chống thấm', 'Waterproof')}</li><li>${t('Thiết kế để khó rách, dùng lại nhiều lần', 'Built to resist tearing, made to reuse')}</li><li>${t('Trong phim: đi giày giẫm thẳng lên', 'In the film: walked on in boots')}</li></ul></div>
      </div>
      <div class="feature flip rv">
        <div class="plan-art">${anchorPlan(t('Sơ đồ nhìn từ trên xuống: bốn khoen neo ở bốn góc đáy được buộc vào các điểm cố định', 'Plan diagram: four anchor rings at the bottom corners tied to fixed points'), lang)}</div>
        <div><span class="num">04</span><h3>${t(`${s.anchorPoints} khoen kim loại để neo`, `${s.anchorPoints} metal anchor rings`)}</h3>
        <ul class="bul"><li>${t('Mỗi góc đáy một khoen', 'One at each bottom corner')}</li><li>${t('Buộc vào điểm cố định để nước không đẩy khoang đi', "Tie to fixed points so water can't push it away")}</li></ul>
        <p class="tiny"><span class="badge illus">${t('Sơ đồ', 'Diagram')}</span></p></div>
      </div>
    </div>
  </div>
</section>

<section id="cach-dung" aria-labelledby="how-title">
  <div class="wrap">
    <p class="label">${t('Cách dùng', 'How it works')}</p>
    <h3 class="h2" id="how-title">${t('4 bước. Xong trước khi nước tới.', '4 steps. Done before the water.')}</h3>
    <ol class="steps mt">
      <li class="step rv">${img('step-open', { alt: t('Trải khoang Bảo Việt Motor ra và mở khóa kéo', 'Unrolling the enclosure and opening the zipper'), sizes: '(max-width: 560px) 100vw, (max-width: 960px) 50vw, 280px' })}
        <div class="body"><span class="k">${t('Bước', 'Step')} 01 / 4</span><h3>${t('Trải ra', 'Roll it out')}</h3><p>${t('Trải phẳng. Mở hết khóa.', 'Lay it flat. Open the zipper.')}</p></div></li>
      <li class="step rv">${loopClip(ctx, 'push', { ratio: '4/3' })}
        <div class="body"><span class="k">${t('Bước', 'Step')} 02 / 4</span><h3>${t('Dắt xe vào', 'Wheel it in')}</h3><p>${t('Không nhấc. Không tháo gì.', 'No lifting. Nothing to remove.')}</p></div></li>
      <li class="step rv">${loopClip(ctx, 'zip', { ratio: '4/3' })}
        <div class="body"><span class="k">${t('Bước', 'Step')} 03 / 4</span><h3>${t('Kéo khóa', 'Zip it shut')}</h3><p>${t('Một đường dọc nóc.', 'One line along the top.')}</p></div></li>
      <li class="step rv">${anchorSide(t('Sơ đồ: buộc khoen ở góc đáy vào điểm cố định trên sàn', 'Diagram: tying the bottom-corner rings to fixed points on the floor'))}
        <div class="body"><span class="k">${t('Bước', 'Step')} 04 / 4</span><h3>${t('Neo bốn góc', 'Tie down 4 corners')}</h3><p>${t('Bắt buộc. Đừng bỏ qua.', "Required. Don't skip it.")}</p></div></li>
    </ol>
    <p class="tiny mt-s">${t('Bước 1: khung hình từ phim. Bước 2-3: clip từ phim. Bước 4: sơ đồ.', 'Step 1: film frame. Steps 2-3: film clips. Step 4: diagram.')}</p>
  </div>
</section>

<!-- ============================ 03 · WHY IT'S WORTH IT ============================ -->
<section class="chsec" aria-labelledby="dang-dau-tu-h">
${chapter('dang-dau-tu', 'ch-why', '03', t('Vì sao đáng đầu tư', "Why it's worth it"),
  t('Bọc trước, hay sửa sau?', 'Protect it now, or fix it later?'),
  t(`Xe vài trăm triệu. ${usd} là con số nhỏ.`, `Your bike cost hundreds of millions of dong. ${usd} is the small number.`))}
  <div class="wrap">
    <h3 class="h3">${t(`${usd} so với bốn chiếc 1.000 cc`, `${usd} next to four 1,000 cc superbikes`)}</h3>
    <div class="pct-grid mt-s">
      ${superbikes.map((b) => `<div class="pct-card rv"><p class="m">${esc(b.name)}</p><p class="p">${b.from ? t('từ ', 'from ') : ''}${money(b.priceVND)}</p><p class="pc">${pct(b.priceVND)}</p><p class="pl">${t('giá xe', "of the bike's price")}</p>${src(b.source)}</div>`).join('')}
    </div>
    <div class="tiny mt-s">${t(`Giá niêm yết ở Việt Nam theo báo chí, chưa lăn bánh. Cách tính: ${vnd.replace('≈', '')} chia giá xe. Quy đổi theo giá bán USD của Vietcombank ngày 30/10/2026 (26.020 ₫/USD), làm tròn.`, `Vietnamese list prices from the press, before registration. Maths: ${vnd.replace('≈', '')} ÷ the bike's price. Converted at Vietcombank's USD selling rate on 30 Oct 2026 (₫26,020), rounded.`)} ${src(cfg.product.fx.source)}</div>

    <div class="split top mt-l">
      <div class="calc rv" data-calc data-price="${P}" data-lang="${lang}">
        <label for="bikeValue">${t('Xe của bạn đáng giá bao nhiêu?', 'What is your bike worth?')}</label>
        <output id="bikeValueOut" for="bikeValue" style="font-size:1.6rem;font-weight:800">${t('500.000.000 ₫', '₫500,000,000')}</output>
        <input id="bikeValue" type="range" min="0" max="1000" step="1" value="500" aria-describedby="calcNote">
        <div class="readout"><span class="small">${t(`${esc(brand)} so với giá trị xe`, `${esc(brand)} vs. your bike's value`)}</span><span class="pct" id="pctOut">${pct(500_000_000)}</span></div>
        <div class="meter" aria-hidden="true"><i id="pctBar"></i></div>
        <p class="tiny mt-s" id="calcNote"><span class="badge illus">${t('Ví dụ', 'Example')}</span> ${t(`${vnd.replace('≈', '')} chia giá trị xe. Thanh màu phóng to 10 lần.`, `${vnd.replace('≈', '')} ÷ the value you pick. Bar magnified 10×.`)}</p>
      </div>
      <div class="rv">
        <p class="label cyan">${t('Có vừa không?', 'Will it fit?')}</p>
        <h3 class="h3">${t(`${esc(fitExample.name)} trong khoang`, `${esc(fitExample.name)} inside`)}</h3>
        <div class="fitbars mt-s">
          ${fitRow(t('Dài', 'Length'), fitExample.l, s.internalLengthMm)}
          ${fitRow(t('Rộng', 'Width'), fitExample.w, s.internalWidthMm)}
          ${fitRow(t('Cao', 'Height'), fitExample.h, s.internalHeightMm)}
        </div>
        ${src(fitExample.source)}
        <p class="mt-s"><a class="btn btn-ghost" href="${url('product')}#vua-xe">${t('Kiểm tra xe của bạn', 'Check your bike')} ${icons.arrow}</a></p>
      </div>
    </div>

    <h3 class="h2 mt-l" style="font-size:clamp(1.5rem,3.2vw,2.3rem)">${t('Sửa sau lũ tốn hơn bạn nghĩ.', 'Fixing it later costs more than it looks.')}</h3>
    <div class="versus mt rv">
      <div class="vs-bad">
        <p class="label red">${t('Cách A', 'Option A')}</p>
        <h4>${t('Chờ lũ rút rồi sửa', 'Wait it out, fix it later')}</h4>
        <ul>
          <li><b>${t('Phải chờ.', 'You wait.')}</b> ${t('Huế 2025: xe ngâm nước 3-4 ngày, nhiều tiệm sửa cũng hư. Huế 2023: tiệm kín chỗ, từ chối khách.', 'Huế 2025: bikes underwater 3 to 4 days, many shops damaged too. Huế 2023: shops full, people turned away.')}${src('nhandanHue', 'vneHueShops')}</li>
          <li><b>${t('Hỏng ngầm.', 'Hidden damage.')}</b> ${t('Nước lẫn vào dầu phá máy chỉ sau vài ngày.', 'Water in the oil wrecks an engine within days.')}${src(engineRiskShort.source)}</li>
          <li><b>${t('Đồ điện đắt.', 'Pricey electronics.')}</b> ${t(`Riêng bộ IC xe tay ga cao cấp: tới ${repairCost.icPremium.vi}, hơn 3 lần giá ${esc(brand)}.`, `A premium scooter's IC unit alone: up to ${repairCost.icPremium.en}, over 3× the price of ${esc(brand)}.`)}${src(repairCost.source)}</li>
          <li><b>${t('Bảo hiểm bắt buộc không trả.', "Compulsory insurance won't pay.")}</b> ${t('Chỉ bồi thường cho người thứ ba và hành khách (Điều 7, NĐ 67/2023).', 'It covers third parties and passengers only (Art. 7, Decree 67/2023).')}${src(insurance.source)}</li>
        </ul>
        <p class="tiny mt-s">${t('Chưa có nguồn công khai về chi phí sửa mô tô phân khối lớn bị ngập, nên mình không đưa con số.', "There's no public source for what a flooded big bike costs to fix, so I don't give a number.")}</p>
      </div>
      <div class="vs-good">
        <p class="label">${t('Cách B', 'Option B')}</p>
        <h4>${t(`Bọc trước bằng ${esc(brand)}`, `Seal it first with ${esc(brand)}`)}</h4>
        <ul>
          <li><b>${t('Một khoản biết trước.', 'One known cost.')}</b> ${priceBoth}</li>
          <li><b>${t('Xong trước khi nước tới.', 'Done before the water.')}</b> ${t('4 bước.', '4 steps.')}</li>
          <li><b>${t('Kín và có neo.', 'Sealed and anchored.')}</b> ${t(`Khóa ≈${s.zipperM} m, ${s.anchorPoints} khoen.`, `≈${s.zipperM} m zipper, ${s.anchorPoints} rings.`)}</li>
          <li><b>${t('Dùng lại được.', 'Reusable.')}</b> ${t(`PVC ${s.materialGsm} GSM, cuộn gọn.`, `${s.materialGsm} GSM PVC, rolls up.`)}</li>
        </ul>
        <p class="mt"><a class="btn btn-primary" href="${url('preorder')}">${t('Đặt ngay', 'Order now')}, ${price} ${icons.arrow}</a></p>
      </div>
    </div>
  </div>
</section>

<section class="s-2" id="khoang-trong" aria-labelledby="gap-title">
  <div class="wrap">
    <p class="label">${t('So với những thứ đang có', "Compared with what's out there")}</p>
    <h3 class="h2" id="gap-title">${t('Ô tô có túi chống ngập. Cái này dành cho xe máy.', "Cars have flood bags. This one's for bikes.")}</h3>
    <div class="grid g3 mt">
      <div class="card c-red rv"><span class="kicker">${t('Bạt phủ xe thường', 'Ordinary bike cover')}</span><h3>${t('Chỉ che mưa nắng', 'Rain and sun only')}</h3><ul class="bul"><li>${t('Hở dưới gầm', 'Open underneath')}</li><li>${t('Không giữ nước ở ngoài', "Doesn't keep water out")}</li><li>${t('Không giữ xe lại', "Doesn't hold the bike")}</li></ul></div>
      <div class="card c-cyan rv"><span class="kicker">${t('Túi chống ngập ô tô', 'Car flood bag')}</span><h3>${t('Đúng ý tưởng, sai cỡ', 'Right idea, wrong size')}</h3><ul class="bul"><li>${t('Vật liệu bền, khóa chống nước', 'Tough material, waterproof zipper')}</li><li>${t('Làm cho ô tô', 'Made for cars')}</li><li>${t('Khoảng 4-7 triệu đồng', 'Around ₫4-7 million')}</li></ul>${src(market.carBags.source)}</div>
      <div class="card c-yellow rv"><span class="kicker">${esc(brand)}</span><h3>${t('Làm riêng cho xe hai bánh', 'Made for two wheels')}</h3><ul class="bul"><li>${t(`PVC ${s.materialGsm} GSM, khóa ≈${s.zipperM} m`, `${s.materialGsm} GSM PVC, ≈${s.zipperM} m zipper`)}</li><li>${t(`${s.anchorPoints} khoen neo`, `${s.anchorPoints} anchor rings`)}</li><li>${priceBoth}</li></ul></div>
    </div>

    <h3 class="h3 mt-l">${t('Bọc kín thì khô. Người ta đã thử bằng bạt.', 'Sealed means dry. People proved it with tarps.')}</h3>
    <div class="grid g2 mt-s">
      ${Object.values(cases).map((cs) => `<article class="case rv"><p class="where">${cs.where[lang]}</p><p>${esc(cs.short[lang])}</p>${src(cs.source)}</article>`).join('')}
    </div>
    <p class="small mt">${t('Nhưng bạt tự chế có chỗ yếu:', 'But homemade tarps have weak spots:')}</p>
    <table class="compare mt-s rv">
      <thead><tr><th scope="col">${t('Vấn đề', 'Issue')}</th><th scope="col">${t('Bạt tự chế', 'Homemade tarp')}</th><th scope="col">${esc(brand)}</th></tr></thead>
      <tbody>${diyWeaknesses.map((w) => `<tr><td>${esc(w[lang].t)}</td><td data-label="${t('Bạt tự chế', 'Homemade tarp')}">${esc(w[lang].d)}<div class="src">${cite(w.source)}</div></td><td data-label="${esc(brand)}">${esc(w.fix[lang])}</td></tr>`).join('')}</tbody>
    </table>
  </div>
</section>

<section class="chsec" aria-labelledby="why-short">
<header class="chapter ch-why" id="dang-dau-tu"><div class="wrap"><p class="num">03 · ${t('Vì sao đáng đầu tư', "Why it's worth it")}</p><h2 id="why-short">${t('Bọc trước, hay sửa sau?', 'Protect it now, or fix it later?')}</h2></div></header>
  <div class="wrap">
    <div class="versus rv">
      <div class="vs-bad"><p class="label red">${t('Sửa sau lũ', 'Fix it after')}</p><ul class="bul">
        <li>${t('Chờ nhiều ngày, tiệm sửa quá tải', 'Days of waiting, overloaded shops')}</li>
        <li>${t('Nước vào dầu phá máy', 'Water in the oil wrecks the engine')}</li>
        <li>${t('IC xe tay ga cao cấp: tới 8 triệu ₫', 'Premium scooter IC alone: up to ₫8 million')}</li>
        <li>${t('Bảo hiểm bắt buộc không trả', "Compulsory insurance won't pay")}</li></ul></div>
      <div class="vs-good"><p class="label">${t(`Bọc trước bằng ${esc(brand)}`, `Seal it first with ${esc(brand)}`)}</p><ul class="bul">
        <li>${t('Một khoản biết trước', 'One known cost')}: ${priceBoth}</li>
        <li>${t('4 bước, xong trước khi nước tới', '4 steps, done before the water')}</li>
        <li>${t('Kín, có neo, dùng lại được', 'Sealed, anchored, reusable')}</li></ul>
        <p class="mt-s"><a class="btn btn-ghost" href="${url('product')}#dang-dau-tu">${t('Xem số liệu và nguồn', 'See the numbers and sources')} ${icons.arrow}</a></p></div>
    </div>
  </div>
</section>

<section class="s-2" aria-labelledby="founder-title">
  <div class="wrap">
    <p class="label">${t('Người sáng lập', 'Founder')}</p>
    <h2 class="h2" id="founder-title">${t('Làm bởi dân chơi xe, cho dân chơi xe.', 'Built by Bikers, for Bikers.')}</h2>
    <div class="founder-grid mt">
      <figure class="photo rv">${img('founder-portrait', { alt: t(`${esc(cfg.founder.name)} trong bộ đồ bảo hộ, ngồi trên mô tô`, `${esc(cfg.founder.name)} in riding leathers, sitting on his motorcycle`), sizes: '(max-width: 820px) 100vw, 380px' })}
        <figcaption>${esc(cfg.founder.name)}, ${t(`người sáng lập, ${cfg.founder.year}`, `founder, ${cfg.founder.year}`)}</figcaption></figure>
      <figure class="photo rv">${img('founder-track', { alt: t('Người sáng lập ôm cua trên đường đua với chiếc sportbike màu đen', 'The founder leaning into a corner on a race track on a black sportbike'), sizes: '(max-width: 820px) 100vw, 640px' })}
        <figcaption>${t('Trên đường đua. Ảnh: Yam Speed', 'On track. Photo: Yam Speed')}</figcaption></figure>
    </div>
    <ul class="bul mt">
      <li>${t('Mình chạy mô tô, mình hiểu cảm giác sợ mất chiếc xe', "I ride. I know the fear of losing your bike")}</li>
      <li>${t('Tự thiết kế, tự làm mẫu, tự nhấn chìm để thử', 'Designed it, built the prototype, sank it to test it')}</li>
      <li>${t('Làm cho người coi chiếc xe như một phần của mình', 'Made for riders who treat their bike like family')}</li>
    </ul>
    <p class="mt-s"><a class="btn btn-ghost" href="${url('story')}">${t('Câu chuyện', 'The story')} ${icons.arrow}</a></p>
  </div>
</section>

<section id="thu-nghiem" aria-labelledby="test-title">
  <div class="wrap split">
    <div class="rv">
      <figure class="photo">${img('r15', { alt: t('Chiếc Yamaha R15 màu xanh dùng trong phim giới thiệu', 'The blue Yamaha R15 used in the product film'), sizes: '(max-width: 820px) 100vw, 560px' })}
      <figcaption>${t('Khung hình từ phim, không phải từ buổi thử.', 'A film frame, not from the test.')}</figcaption></figure>
    </div>
    <div>
      <p class="label">${t('Vì sao bạn có thể tin', 'Why you can trust this')}</p>
      <h3 class="h2" id="test-title">${t('Trước khi bán, mình đã nhấn chìm nó.', 'Before selling it, I sank it.')}</h3>
      <p class="lead mt-s">${t('Một chiếc Yamaha R15, chìm hoàn toàn trong khoang mẫu. Nước không vào.', 'A Yamaha R15, fully submerged inside a prototype. No water got in.')}</p>
      <p><span class="badge test">${t('Thử nghiệm của người sáng lập', 'Founder test')}</span></p>
      <div class="note red mt-s"><p>${t('Thử nghiệm cá nhân, không phải kiểm định phòng thí nghiệm. Không có chỉ số IP. Không hứa chịu được mọi trận lũ.', 'A personal test, not a laboratory certification. No IP rating claimed. No promise for every flood.')}</p></div>
      <ul class="done-list mt">
        <li>${t('Mọi con số bên ngoài đều có link nguồn', 'Every outside number links to its source')}</li>
        <li>${t('Không đánh giá ảo, không chứng nhận tự đặt', 'No fake reviews, no self-made badges')}</li>
        <li>${t('Hình minh họa luôn được ghi rõ', 'Illustrations are always labelled')}</li>
      </ul>
      <p class="mt"><a class="btn btn-ghost" href="${url('verify')}">${t('Trang kiểm chứng', 'Verify page')} ${icons.arrow}</a> <a class="btn btn-ghost" href="${url('story')}">${t('Câu chuyện', 'The story')}</a></p>
    </div>
  </div>
</section>

<!-- SPECS + CAMO -->
<section class="s-2" aria-labelledby="specs-title">
  <div class="wrap">
    <p class="label">${t('Thông số', 'Specifications')}</p>
    <h2 class="h2" id="specs-title">${t('Thông số chính', 'The key numbers')}</h2>
    <div class="specs mt rv">
      <div><b>${s.materialGsm}</b><span>GSM PVC</span></div>
      <div><b>≈${s.weightKg} kg</b><span>${t('Khối lượng', 'Weight')}</span></div>
      <div><b>≈${s.zipperM} m</b><span>${t('Khóa kéo', 'Zipper')}</span></div>
      <div><b>${s.anchorPoints}</b><span>${t('Khoen neo', 'Anchor rings')}</span></div>
      <div><b>${ctx.formatInt(s.internalLengthMm)} × ${ctx.formatInt(s.internalWidthMm)} × ${ctx.formatInt(s.internalHeightMm)}</b><span>${t('Lòng trong (mm)', 'Inside (mm)')}</span></div>
      <div><b>${cfg.product.colourNow[lang]}</b><span>${t('Màu hiện tại', 'Current colour')}</span></div>
    </div>
    <p class="mt"><a class="btn btn-ghost" href="${url('product')}">${t('Thông số đầy đủ và kiểm tra xe', 'Full specs and fit check')} ${icons.arrow}</a></p>

    <div class="split mt-l rv">
      <figure class="photo">${img('camo', { alt: t('Bản dựng 3D thiết kế khoang Bảo Việt Motor phiên bản rằn ri', '3D render of the planned camouflage Bảo Việt Motor enclosure'), sizes: '(max-width: 820px) 100vw, 560px' })}
        <figcaption>${t('Bản dựng 3D, màu dự kiến.', '3D render, planned colour.')}</figcaption></figure>
      <div>
        <p class="label">${t('Sắp tới', 'Coming later')}</p>
        <h3 class="h2" style="font-size:clamp(1.5rem,3.2vw,2.2rem)">${t('Bản rằn ri.', 'Camo edition.')}</h3>
        <p class="lead mt-s">${t('Vàng an toàn ra trước: đồ khẩn cấp cần dễ thấy.', 'Safety yellow comes first: emergency gear should be easy to spot.')}</p>
        <p><span class="badge plan">${t('Kế hoạch', 'Planned')}</span> <span class="tiny">${t('Bản dựng 3D, chưa nhận đặt.', '3D render. Not available to order yet.')}</span></p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section aria-labelledby="faq-title">
  <div class="wrap narrow">
    <p class="label">${t('Hỏi đáp', 'FAQ')}</p>
    <h2 class="h2" id="faq-title">${t('Hay được hỏi', 'Quick answers')}</h2>
    <div class="mt">${faqHtml(ctx, faqs)}</div>
    <p class="mt"><a class="btn btn-ghost" href="${url('faq')}">${t('Tất cả câu hỏi', 'All questions')} ${icons.arrow}</a></p>
  </div>
</section>

<!-- CTA -->
<div class="hazard" aria-hidden="true"></div>
<section class="s-yellow cta-band" aria-labelledby="cta-title">
  <div class="wrap narrow">
    <h2 class="h2" id="cta-title">${t('Mùa bão năm nào cũng tới. Lần này, hãy sẵn sàng.', 'Storm season comes every year. Be ready this time.')}</h2>
    <p class="lead">${t(`Lô đầu ${n} chiếc. Đặt trước miễn phí, mình gọi hoặc nhắn Zalo xác nhận trước khi bạn trả bất cứ khoản nào.`, `First batch: ${n} units. Pre-ordering is free. I'll call or message you on Zalo before you pay anything.`)}</p>
    <div class="btns mt" style="justify-content:center"><a class="btn btn-dark" href="${url('preorder')}">${t('Đặt ngay', 'Order now')}, ${price} ${icons.arrow}</a></div>
  </div>
</section>`;
    return html;
  },
};
