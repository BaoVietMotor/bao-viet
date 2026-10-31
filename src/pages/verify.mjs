import { routes, icons, ORIGIN, breadcrumbLd, pageHero } from './_lib.mjs';
import { sources } from '../data/facts.mjs';
import { vkVideo, newsVideos, photos } from '../data/media.mjs';
import { heroCredit } from '../data/hero.mjs';

/** What each source is used for on the site. Keys match facts.mjs. */
const uses = {
  bomt: { vi: 'Thiệt hại thiên tai năm 2025 (97.000 tỷ ₫), 1.739 mm mưa ở Bạch Mã, 20 con sông có lũ đặc biệt lớn hoặc lũ lịch sử.', en: '2025 disaster losses (₫97 trillion), 1,739 mm of rain at Bạch Mã, 20 rivers with exceptional or record floods.' },
  vnePhoto: { vi: 'Khoảng 381.600 nhà ngập ở miền Trung tháng 11/2025 và 163 người chết, mất tích; thiệt hại cả năm khoảng 100.000 tỷ ₫.', en: 'About 381,600 homes flooded in central Vietnam in November 2025 and 163 people dead or missing; about ₫100 trillion in losses for the year.' },
  tuoitre: { vi: '1.739 mm mưa trong một ngày ở Bạch Mã, kém kỷ lục thế giới 86 mm.', en: '1,739 mm of rain in one day at Bạch Mã, 86 mm short of the world record.' },
  mps: { vi: '84.003.180 xe máy đang lưu hành, theo số liệu Bộ Công an.', en: '84,003,180 motorcycles in use, from Ministry of Public Security figures.' },
  nhandan: { vi: 'Chiếc ô tô ở Đà Nẵng nổi suốt hai ngày trong bạt bọc kín, và các điểm yếu của bạt tự chế.', en: 'The car in Đà Nẵng that floated for two days in a sealed tarp, and the weak points of homemade tarps.' },
  vneBags: { vi: 'Giá túi chống ngập ô tô 4-7 triệu ₫, trường hợp ở Thái Nguyên, lời khuyên cột xe vào vật cố định.', en: 'Car flood bags at ₫4-7 million, the Thái Nguyên case, and the advice to tie vehicles to a fixed point.' },
  nhandanHue: { vi: 'Hơn 1.000 xe máy được sửa trong hai ngày ở Huế, xe ngâm nước 3-4 ngày, câu trích "đống sắt đầy bùn đất".', en: 'Over 1,000 motorbikes fixed in two days in Huế, bikes under water for 3 to 4 days, and the "heap of mud-caked metal" quote.' },
  vneHueShops: { vi: 'Tiệm sửa xe máy ở Huế quá tải sau trận lũ năm 2023.', en: 'Motorbike repair shops in Huế overloaded after the 2023 flood.' },
  vneEngine: { vi: 'Nước vào động cơ qua ống pô và lỗ thông hơi các-te, làm hỏng dầu trong vài ngày.', en: 'Water entering the engine through the exhaust and crankcase breather and ruining the oil within days.' },
  dtiNhaTrang: { vi: 'Lũ ở Nha Trang tháng 11/2025, có nơi nước hơn 2 m, xe máy mắc kẹt trên đường 23 Tháng 10.', en: 'The November 2025 flood in Nha Trang, over 2 m deep in places, with motorbikes stranded on 23 Tháng 10 Street.' },
  vnnRepair: { vi: 'Chi phí sửa xe máy ngập nước và giá thay IC.', en: 'Repair costs for flooded motorbikes and the price of a replacement IC.' },
  autopro: { vi: 'Giá Kawasaki ZX-10R 2026, Ducati Panigale V4, Honda CBR1000RR-R SP và BMW S 1000 RR tại Việt Nam.', en: 'Vietnamese prices of the Kawasaki ZX-10R 2026, Ducati Panigale V4, Honda CBR1000RR-R SP and BMW S 1000 RR.' },
  baoquocte: { vi: 'Giá, kích thước và trang bị điện tử của BMW S 1000 RR 2026.', en: 'Price, dimensions and electronics of the BMW S 1000 RR 2026.' },
  vohFx: { vi: 'Tỷ giá bán USD của Vietcombank ngày 30/10/2026 (26.020 ₫), dùng để quy đổi giá 100 USD.', en: "Vietcombank's USD selling rate on 30 Oct 2026 (₫26,020), used to convert the $100 price." },
  nd67: { vi: 'Phạm vi bảo hiểm bắt buộc của chủ xe theo Điều 7, Nghị định 67/2023/NĐ-CP.', en: 'What compulsory motor insurance covers under Art. 7 of Decree 67/2023/NĐ-CP.' },
};

export default {
  id: 'verify',
  path: routes.verify,
  title: {
    vi: 'Kiểm chứng thông tin về Bảo Việt Motor: sản phẩm, người sáng lập, nguồn',
    en: 'Verify Bảo Việt Motor: the product, the founder and every source',
  },
  description: {
    vi: 'Thông tin cơ bản về Bảo Việt Motor, ai đã làm gì, những gì trang web không nói, và danh sách đầy đủ nguồn số liệu, video, ảnh dùng trên trang.',
    en: 'The basics about Bảo Việt Motor, who did what, what this site does not claim, and the full list of sources, videos and photos it uses.',
  },
  jsonld: (ctx) => [breadcrumbLd(ctx, 'verify', ctx.t('Kiểm chứng', 'Verify'))],

  body(ctx) {
    const { t, url, esc, priceBoth, brand, cfg, lang } = ctx;
    const hc = heroCredit;
    const dealers = cfg.launch.dealers.length
      ? cfg.launch.dealers.map(esc).join(', ')
      : t('Tên đại lý sẽ được đăng tại đây khi thỏa thuận được công bố.', 'Dealership names will be listed here once the agreements are public.');
    const c = cfg.contact;
    const fact = (k, v) => `<dt>${k}</dt><dd>${v}</dd>`;
    const gh = cfg.links && cfg.links.github
      ? `<p>${t('Mã nguồn của trang web để công khai trên GitHub:', 'The website code is public on GitHub:')} <a href="${esc(cfg.links.github)}" target="_blank" rel="noopener">${esc(cfg.links.github)}</a></p>` : '';
    const sourceItems = Object.entries(sources).map(([k, sv]) => `<li><a href="${sv.url}" target="_blank" rel="noopener">${esc(sv.name)}</a>${uses[k] ? `<p>${t('Dùng cho', 'Used for')}: ${esc(uses[k][lang])}</p>` : ''}</li>`).join('');
    const videoItems = [vkVideo, ...newsVideos].map((v) => `<li><a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">${esc(v.title)}</a><p>${t('Kênh', 'Channel')}: ${esc(v.channel)}</p></li>`).join('');
    const photoItems = Object.values(photos).map((p) => `<li><a href="${p.page}" target="_blank" rel="noopener">${esc(p.caption[lang])}</a><p>${t('Tác giả', 'Author')}: ${esc(p.author)} · <a href="${p.licenseUrl}" target="_blank" rel="noopener license">${esc(p.license)}</a> · Wikimedia Commons</p></li>`).join('');
    return `
${pageHero(ctx, {
  label: t('Kiểm chứng', 'Verify'),
  title: t('Kiểm tra những gì mình nói', 'Check what I say'),
  lead: t(`Cho báo chí, đối tác, nhà trường và bất kỳ ai muốn kiểm tra ${esc(brand)}. Số liệu dẫn tới bài gốc. Video dẫn tới kênh gốc. Ảnh ghi tác giả và giấy phép.`, `For journalists, partners, schools and anyone checking ${esc(brand)}. Figures link to the original articles. Videos link to the original channels. Photos name the author and licence.`),
})}

<section class="s-light" aria-labelledby="basics-h">
  <div class="wrap narrow">
    <p class="label">${t('Thông tin cơ bản', 'The basics')}</p>
    <h2 class="h2" id="basics-h">${t(`${esc(brand)} là gì`, `What ${esc(brand)} is`)}</h2>
    <dl class="facts mt">
      ${fact(t('Thương hiệu', 'Brand'), `${esc(brand)} (${esc(cfg.brand.nameAscii)})`)}
      ${fact(t('Người sáng lập', 'Founder'), esc(cfg.founder.name))}
      ${fact(t('Sản phẩm', 'Product'), t('Khoang chống ngập kín nước, neo xuống sàn, cho xe máy và mô tô', 'A sealed, floor-anchored flood enclosure for motorcycles'))}
      ${fact(t('Giá', 'Price'), t(`${priceBoth}, giá đặt trước. Giá đặt bằng USD; số tiền đồng là quy đổi theo giá bán USD của Vietcombank ngày 30/10/2026 (26.020 ₫), làm tròn.`, `${priceBoth}, pre-order price. The price is set in US dollars; the dong figure is converted at Vietcombank's USD selling rate on 30 Oct 2026 (₫26,020), rounded.`))}
      ${fact(t('Giá ra mắt', 'Launch offer'), t(`Giảm 50% cho lô đầu: ${ctx.was} còn ${ctx.usd}. ${ctx.was} là giá thường sau lô đầu.`, `50% off for the first batch: ${ctx.was} down to ${ctx.usd}. ${ctx.was} is the regular price after the first batch.`))}
      ${fact(t('Ra mắt', 'Launch'), t(`Lô đầu tiên ${cfg.launch.firstBatchUnits} chiếc, ra mắt tại các đại lý đối tác. ${dealers}`, `First batch of ${cfg.launch.firstBatchUnits} units, launching at partner dealerships. ${dealers}`))}
      ${fact(t('Tình trạng', 'Status'), t('Đang nhận đặt trước qua trang web. Trang web không thu tiền; mỗi đơn được xác nhận qua điện thoại hoặc Zalo trước khi thanh toán.', 'Taking pre-orders through this website. The website takes no payment; each order is confirmed by phone or Zalo before anyone pays.'))}
      ${fact(t('Màu đang sản xuất', 'Colour in production'), t('Vàng an toàn. Bản rằn ri mới có bản dựng 3D và đang trong kế hoạch.', 'Safety yellow. The camouflage version exists only as a 3D render and is planned.'))}
      ${fact(t('Liên hệ', 'Contact'), `<a href="mailto:${c.email}">${c.email}</a> · <a href="tel:${c.phoneE164}">${c.phoneDisplay}</a> (Zalo)`)}
      ${fact(t('Không liên quan tới', 'Not affiliated with'), t('Tập đoàn Bảo Việt hay bất kỳ công ty bảo hiểm nào', 'Bao Viet Holdings (Tập đoàn Bảo Việt) or any insurance company'))}
    </dl>

    <h2 class="h2 mt-l" style="font-size:clamp(1.4rem,3vw,2rem)">${t('Ai làm gì', 'Who did what')}</h2>
    <ul class="done-list mt-s">
      <li>${t(`${esc(cfg.founder.name)} thiết kế sản phẩm, tìm xưởng sản xuất, đặt làm mẫu và lo vận chuyển mẫu.`, `${esc(cfg.founder.name)} designed the product, found the factory, ordered samples and handled shipping.`)}</li>
      <li>${t('Người sáng lập tự nhấn chìm hoàn toàn một chiếc Yamaha R15 trong khoang mẫu để thử. Đây là thử nghiệm cá nhân, không phải kiểm định phòng thí nghiệm. Trang web không đăng video của lần thử này.', 'The founder fully submerged a Yamaha R15 inside a sample to test it. It was a personal test, not a laboratory certification. This website does not show video of that test.')}</li>
      <li>${t('Phim giới thiệu 53 giây quay với sản phẩm thật. Cảnh xe ngập ở đầu phim là của kênh Vuong Khang Motor và được ghi nguồn.', 'The 53-second product film uses the real product. The flooded-bike footage at the start comes from the Vuong Khang Motor channel and is credited.')}</li>
      <li>${t('Sản phẩm được làm tại một xưởng bên ngoài theo thiết kế của người sáng lập.', "The product is made by an outside factory to the founder's design.")}</li>
    </ul>

    <h2 class="h2 mt-l" style="font-size:clamp(1.4rem,3vw,2rem)">${t('Bằng chứng bạn có thể xem', 'Evidence you can look at')}</h2>
    <ul class="done-list mt-s">
      <li><a href="${url('home')}#phim">${t('Phim giới thiệu 53 giây', 'The 53-second product film')}</a>, ${t('quay với sản phẩm thật', 'shot with the real product')}</li>
      <li><a href="${url('story')}">${t('Ảnh sản phẩm ngoài đường', 'Street photos of the product')}</a></li>
      <li><a href="${url('home')}#tinh-nang">${t('Các clip ngắn cắt từ phim', 'Short clips cut from the film')}</a></li>
      <li><a href="${url('product')}">${t('Bảng thông số và bản vẽ kích thước', 'The spec sheet and dimension drawing')}</a></li>
    </ul>

    <h2 class="h2 mt-l" style="font-size:clamp(1.4rem,3vw,2rem)">${t('Những gì trang web không nói', 'What this site does not claim')}</h2>
    <ul class="done-list no mt-s">
      <li>${t('Không có chứng nhận phòng thí nghiệm hay chỉ số chống nước IP.', 'No laboratory certification and no IP waterproof rating.')}</li>
      <li>${t('Không có số liệu bán hàng, cũng không có đánh giá của khách hàng.', 'No sales figures and no customer reviews.')}</li>
      <li>${t('Không nói sản phẩm chịu được mọi trận lũ.', 'It does not say the product will handle every flood.')}</li>
      <li>${t('Không nói mình là người đầu tiên hay duy nhất. Trên thị trường đã có túi chống ngập cho ô tô và cho xe máy.', 'It does not say this is the first or the only one. Flood bags for cars and for motorbikes are already on sale.')}</li>
      <li>${t('Hình nào không phải ảnh chụp thì đều có ghi chú: ảnh lũ ở đầu trang chủ là hình minh họa do AI tạo (không phải ảnh một trận lũ thật), bản rằn ri là bản dựng 3D, các sơ đồ là hình vẽ.', 'Every picture that is not a photo is labelled: the flood picture at the top of the home page is an AI-generated illustration (not a photo of a real flood), the camouflage version is a 3D render, and the diagrams are drawings.')}</li>
    </ul>
  </div>
</section>

<section aria-labelledby="src-h">
  <div class="wrap narrow">
    <p class="label">${t('Nguồn', 'Sources')}</p>
    <h2 class="h2" id="src-h">${t('Tất cả nguồn số liệu', 'Every source behind the figures')}</h2>
    <p class="lead mt-s">${t('Mỗi con số lấy từ bên ngoài trên trang web đều đến từ một trong các bài dưới đây. Các nguồn được mở lại và đối chiếu lần cuối vào tháng 10/2026.', 'Every outside figure on this website comes from one of the articles below. They were reopened and checked again in October 2026.')}</p>
  </div>
  <div class="wrap narrow s-light" style="border-radius:4px;padding:6px 22px;margin-top:24px">
    <ol class="source-list">${sourceItems}</ol>
  </div>
</section>

<section class="s-2" aria-labelledby="media-h">
  <div class="wrap narrow">
    <p class="label">${t('Video và ảnh của người khác', "Other people's videos and photos")}</p>
    <h2 class="h2" id="media-h">${t('Ghi nguồn video và ảnh', 'Video and photo credits')}</h2>
    <p class="mt-s">${t('Video được nhúng từ YouTube và chỉ tải khi bạn bấm phát. Việc nhúng video không có nghĩa là các kênh này hợp tác với hay xác nhận sản phẩm của ' + esc(brand) + '.', 'Videos are embedded from YouTube and only load when you press play. Embedding a video does not mean its channel partners with or endorses ' + esc(brand) + '.')}</p>
    <h3 class="h3 mt">YouTube</h3>
    <ul class="news-plain">${videoItems}</ul>
    <h3 class="h3 mt">Wikimedia Commons</h3>
    <ul class="news-plain">${photoItems}</ul>
    <h3 class="h3 mt" id="nguon-anh">${t('Ảnh minh họa ở đầu trang chủ', 'The illustration at the top of the home page')}</h3>
    <p class="mt-s">${t(hc.how.vi, hc.how.en)}</p>
    <ul class="news-plain">${hc.parts.map((p) => `<li><a href="${p.page}" target="_blank" rel="noopener">${esc(p.title)}</a><p>${esc(p.role[lang])} · ${t('Tác giả', 'Author')}: ${esc(p.author)} · ${p.licenseUrl ? `<a href="${p.licenseUrl}" target="_blank" rel="noopener license">${esc(p.license)}</a>` : esc(p.license)}</p></li>`).join('')}</ul>
  </div>
</section>

<section aria-labelledby="site-h">
  <div class="wrap narrow">
    <p class="label">${t('Về trang web này', 'About this website')}</p>
    <h2 class="h2" id="site-h">${t('Trang web hoạt động thế nào', 'How this website works')}</h2>
    <p class="mt-s">${t('Trang chạy trên Cloudflare Workers. Đơn đặt trước và tin nhắn được lưu trong cơ sở dữ liệu Cloudflare D1, và chỉ xem được trong trang quản trị có mật khẩu. Trang không dùng cookie quảng cáo hay công cụ theo dõi của bên thứ ba. Chi tiết về dữ liệu nằm trong', 'The site runs on Cloudflare Workers. Pre-orders and messages are stored in a Cloudflare D1 database and can only be viewed in a password-protected admin page. The site uses no advertising cookies and no third-party trackers. Details about data are in the')} <a class="y" href="${url('privacy')}">${t('Chính sách bảo mật', 'privacy policy')}</a>.</p>
    ${gh}
    <div class="btns mt"><a class="btn btn-primary" href="${url('contact')}">${t('Hỏi thêm', 'Ask a question')} ${icons.arrow}</a><a class="btn btn-ghost" href="mailto:${c.email}">${c.email}</a></div>
  </div>
</section>`;
  },
};
