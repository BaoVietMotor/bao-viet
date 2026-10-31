import home, { MOVED, pickSections } from './home.mjs';
import { routes, icons, productLd, breadcrumbLd } from './_lib.mjs';
import { loopClip } from './_media.mjs';
import { dimensions } from './_art.mjs';

export default {
  id: 'product',
  path: routes.product,
  title: {
    vi: 'Thông số khoang chống ngập Bảo Việt Motor: kích thước, chất liệu, cách neo',
    en: 'Bảo Việt Motor flood enclosure: specs, sizing and anchoring',
  },
  description: {
    vi: 'Lòng trong 2.300 × 1.200 × 1.450 mm, bạt PVC 600 GSM, khóa kéo chống nước khoảng 3 m, 4 khoen neo, nặng khoảng 10 kg. Giá 100 USD. Kiểm tra xe của bạn có vừa không.',
    en: 'Inside 2,300 × 1,200 × 1,450 mm, 600 GSM PVC, a waterproof zipper about 3 m long, 4 anchor rings, about 10 kg. $100. Check whether your bike fits.',
  },
  jsonld: (ctx) => [productLd(ctx), breadcrumbLd(ctx, 'product', ctx.t('Sản phẩm', 'Product'))],

  body(ctx) {
    const moved = pickSections(home.fullBody(ctx), MOVED.product);
    const { t, url, img, esc, price, usd, vnd, was, brand, cfg, lang } = ctx;
    const s = cfg.product.specs;
    const n = ctx.formatInt;
    const row = (k, v, note = '') => `<tr><th scope="row">${k}</th><td><b>${v}</b>${note ? `<span>${note}</span>` : ''}</td></tr>`;
    return `
<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="${t('Đường dẫn', 'Breadcrumb')}"><a href="${url('home')}">${t('Trang chủ', 'Home')}</a> / <span aria-current="page">${t('Sản phẩm', 'Product')}</span></nav>
    <div class="split top">
      <div>
        <p class="label">${t('Sản phẩm', 'Product')}</p>
        <h1 class="h2">${t(`Khoang chống ngập ${esc(brand)}`, `The ${esc(brand)} flood enclosure`)}</h1>
        <p class="lead mt-s">${t('Bọc cả chiếc xe từ sàn lên. Một khóa kéo chống nước. Neo bốn góc. Dùng trong nhà xe, trong nhà, chỗ có mái che.', 'Wraps the whole bike, floor up. One waterproof zipper. Tied down at four corners. For garages, homes and covered spaces.')}</p>
        <div class="price-line"><s class="was">${was}</s><b>${usd}</b><span class="vnd">${vnd}</span><span>${t('giá đặt trước, một bộ', 'pre-order price, per unit')}</span></div>
        <div class="btns"><a class="btn btn-primary" href="${url('preorder')}">${t('Đặt ngay', 'Order now')} ${icons.arrow}</a><a class="btn btn-ghost" href="#vua-xe">${t('Xe tôi có vừa không?', 'Will my bike fit?')}</a></div>
        <ul class="ticks"><li>${t('Không trả trước', 'Pay nothing now')}</li><li>${t('Hủy bất cứ lúc nào', 'Cancel any time')}</li><li>${t(`Lô đầu ${cfg.launch.firstBatchUnits} chiếc`, `First batch: ${cfg.launch.firstBatchUnits} units`)}</li></ul>
      </div>
      <figure class="photo rv">${img('real-ridein', { alt: t('Khoang Bảo Việt Motor màu vàng mở sẵn trên đường, một người ngồi trên chiếc Yamaha R15 chuẩn bị chạy vào', 'A yellow Bảo Việt Motor enclosure laid open on the street while a rider on a Yamaha R15 gets ready to roll in'), sizes: '(max-width: 820px) 100vw, 440px', eager: true })}
        <figcaption>${t('Mở sẵn, chờ xe vào.', 'Open and ready for the bike.')}</figcaption></figure>
    </div>
  </div>
</section>

<section aria-labelledby="specs-h">
  <div class="wrap split top">
    <div>
      <p class="label">${t('Thông số', 'Specifications')}</p>
      <h2 class="h2" id="specs-h">${t('Bảng thông số', 'Spec sheet')}</h2>
      <div class="spec-label mt">
        <div class="hd"><b>${esc(brand)}</b><span>${t('THÔNG SỐ', 'SPECS')}</span></div>
        <table>
          <tbody>
          ${row(t('Lòng trong (dài × rộng × cao)', 'Inside (length × width × height)'), `${n(s.internalLengthMm)} × ${n(s.internalWidthMm)} × ${n(s.internalHeightMm)} mm`)}
          ${row(t('Khối lượng', 'Weight'), t(`Khoảng ${s.weightKg} kg`, `About ${s.weightKg} kg`))}
          ${row(t('Chất liệu', 'Material'), t(`Bạt polyester phủ PVC, ${s.materialGsm} GSM`, `PVC-coated polyester tarpaulin, ${s.materialGsm} GSM`), t('Chống thấm, thiết kế để khó rách và dùng lại nhiều lần', 'Waterproof, designed to resist tearing and to be reused'))}
          ${row(t('Đóng kín', 'Closure'), t(`Khóa kéo chống nước, khoảng ${s.zipperM} m`, `Waterproof zipper, about ${s.zipperM} m`), t('Chạy giữa, dọc nóc', 'Runs down the middle of the top'))}
          ${row(t('Neo', 'Anchoring'), t(`${s.anchorPoints} khoen kim loại gia cường`, `${s.anchorPoints} reinforced metal rings`), t('Mỗi góc đáy một khoen, dùng với dây thừng hoặc dây đai', 'One at each bottom corner, for rope or straps'))}
          ${row(t('Màu', 'Colour'), cfg.product.colourNow[lang], t('Bản rằn ri đang trong kế hoạch', 'A camouflage version is planned'))}
          ${row(t('Dùng cho', 'Made for'), t('Bảo vệ tạm thời khi ngập', 'Temporary flood protection'), t('Trong nhà xe, trong nhà hoặc chỗ có mái che', 'In a garage, inside a house or under a roof'))}
          ${row(t('Chứng nhận', 'Certification'), t('Chưa có', 'None yet'), t('Không công bố chỉ số IP. Lần thử nhấn chìm do người sáng lập tự làm.', 'No IP rating claimed. The submersion test was done by the founder.'))}
          </tbody>
        </table>
        <div class="ft">${t('Thông số do người sáng lập cung cấp từ thiết kế sản phẩm.', 'Specs supplied by the founder from the product design.')}</div>
      </div>
    </div>
    <div class="rv">
      ${dimensions(t('Bản vẽ kích thước lòng trong: dài 2300 mm, cao 1450 mm, rộng 1200 mm, khóa kéo khoảng 3000 mm dọc nóc, bốn khoen ở bốn góc đáy', 'Inside dimensions: 2300 mm long, 1450 mm tall, 1200 mm wide, a zipper of about 3000 mm along the top, four rings at the bottom corners'), lang)}
      <p class="tiny mt-s"><span class="badge illus">${t('Sơ đồ', 'Diagram')}</span> ${t('Hình vẽ minh họa theo thông số, không phải bản vẽ sản xuất.', 'A drawing of the stated dimensions, not a manufacturing drawing.')}</p>
    </div>
  </div>
</section>

<section class="s-2" id="vua-xe" aria-labelledby="fit-h">
  <div class="wrap narrow">
    <p class="label">${t('Kiểm tra kích thước', 'Fit check')}</p>
    <h2 class="h2" id="fit-h">${t('Xe bạn có vừa không?', 'Will your bike fit?')}</h2>
    <p class="lead mt-s">${t('Nhập kích thước tổng thể (sổ tay hoặc thông số hãng). Chiều rộng tính cả gương.', "Enter your bike's overall size (owner's manual or maker's specs). Include the mirrors.")}</p>
    <form class="calc mt" data-fit data-l="${s.internalLengthMm}" data-w="${s.internalWidthMm}" data-h="${s.internalHeightMm}" data-lang="${lang}" novalidate>
      <div class="fit">
        <div class="field"><label for="fitL">${t('Dài (mm)', 'Length (mm)')}</label><input id="fitL" name="l" type="number" inputmode="numeric" min="500" max="4000" placeholder="2085" required></div>
        <div class="field"><label for="fitW">${t('Rộng (mm)', 'Width (mm)')}</label><input id="fitW" name="w" type="number" inputmode="numeric" min="300" max="2000" placeholder="812" required></div>
        <div class="field"><label for="fitH">${t('Cao (mm)', 'Height (mm)')}</label><input id="fitH" name="h" type="number" inputmode="numeric" min="500" max="2500" placeholder="1051" required></div>
        <button class="btn btn-primary" type="submit">${t('Kiểm tra', 'Check')}</button>
      </div>
      <div class="fit-result" id="fitResult" role="status" aria-live="polite"></div>
    </form>
    <p class="tiny mt-s">${t('Chỉ so số đo. Tay lái, gương, thùng sau vẫn có thể ảnh hưởng. Số mẫu trong ô: BMW S 1000 RR 2026 (báo Thế giới & Việt Nam).', 'Numbers only. Bars, mirrors and top boxes can still matter. Example numbers: BMW S 1000 RR 2026 (Báo Thế giới & Việt Nam).')}</p>
  </div>
</section>

<section aria-labelledby="use-h">
  <div class="wrap">
    <p class="label">${t('Dùng cho đúng', 'Use it right')}</p>
    <h2 class="h2" id="use-h">${t('Dùng khi nào. Không dùng khi nào.', 'When to use it. When not to.')}</h2>
    <div class="grid g2 mt">
      <div class="card rv"><span class="kicker">${t('Phù hợp', 'Made for')}</span>
        <ul class="done-list">
          <li>${t('Xe để trong nhà xe, tầng trệt hoặc chỗ có mái che', 'Bikes kept in a garage, on a ground floor or under a roof')}</li>
          <li>${t('Nước dâng lên từ từ, không có dòng chảy mạnh', 'Water that rises slowly, without strong currents')}</li>
          <li>${t('Có chỗ cố định chắc chắn để buộc bốn khoen', 'A solid fixed point to tie the four rings to')}</li>
          <li>${t('Dựng xong trước khi nước tới', 'Set up before the water arrives')}</li>
        </ul></div>
      <div class="card c-red rv"><span class="kicker">${t('Không phù hợp', 'Not made for')}</span>
        <ul class="done-list no">
          <li>${t('Lũ quét, nước chảy xiết hoặc có nhiều rác lớn', 'Flash floods, strong currents or heavy debris')}</li>
          <li>${t('Để ngoài trời không có che chắn', 'Outdoors with no shelter')}</li>
          <li>${t('Dùng mà không neo', 'Using it without anchoring')}</li>
          <li>${t('Thay cho việc đưa người và xe lên chỗ cao khi có cảnh báo', 'Replacing moving people and vehicles to higher ground when there is a warning')}</li>
        </ul></div>
    </div>
    <div class="note red mt"><p>${t(`Thiết kế để giữ xe khô và đứng yên, khi được neo đúng cách. Kết quả tùy độ sâu, dòng chảy, rác trôi, cách neo và cách dựng. Không hứa chịu được mọi trận lũ. Không phải bảo hiểm.`, `Designed to keep a properly anchored bike dry and in place. Results depend on depth, current, debris, anchoring and setup. No promise for every flood. Not insurance.`)}</p></div>
  </div>
</section>

<section class="s-2" aria-labelledby="care-h">
  <div class="wrap split">
    <div>
      <p class="label">${t('Bảo quản', 'Care')}</p>
      <h2 class="h2" id="care-h">${t('Cất gọn. Dùng lại mùa sau.', 'Pack it away. Use it again.')}</h2>
      <ul class="done-list mt">
        <li>${t('Rửa bùn, phơi thật khô, rồi cuộn', 'Rinse off the mud, dry fully, then roll')}</li>
        <li>${t('Giữ khóa kéo sạch cát', 'Keep grit out of the zipper')}</li>
        <li>${t('Cất chỗ khô, tránh vật sắc', 'Store dry, away from sharp things')}</li>
        <li>${t('Kiểm tra trước mỗi mùa mưa', 'Check it before each rainy season')}</li>
      </ul>
    </div>
    <div class="rv">${loopClip(ctx, 'roll', { tags: [['tl', t(`≈${s.weightKg} kg, một cuộn`, `≈${s.weightKg} kg, one roll`)]] })}</div>
  </div>
</section>

${moved}
<div class="hazard" aria-hidden="true"></div>
<section class="s-yellow cta-band">
  <div class="wrap narrow">
    <h2 class="h2">${t('Bạn đã sẵn sàng cho mùa bão chưa?', 'Ready for the storm?')}</h2>
    <div class="btns mt" style="justify-content:center"><a class="btn btn-dark" href="${url('preorder')}">${t('Đặt ngay', 'Order now')}, ${price} ${icons.arrow}</a><a class="btn btn-outline" href="${url('faq')}">${t('Đọc hỏi đáp', 'Read the FAQ')}</a></div>
  </div>
</section>`;
  },
};
