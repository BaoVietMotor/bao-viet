import { routes, breadcrumbLd, pageHero } from './_lib.mjs';

export default {
  id: 'terms',
  path: routes.terms,
  title: { vi: 'Điều khoản sử dụng và đặt trước | Bảo Việt Motor', en: 'Terms of use and pre-order terms | Bảo Việt Motor' },
  description: {
    vi: 'Điều khoản sử dụng trang web, điều khoản đặt trước và giới hạn sử dụng của túi chống ngập Bảo Việt Motor.',
    en: 'Website terms, pre-order terms and usage limits for the Bảo Việt Motor flood enclosure.',
  },
  jsonld: (ctx) => [breadcrumbLd(ctx, 'terms', ctx.t('Điều khoản', 'Terms'))],

  body(ctx) {
    const { t, url, esc, cfg, priceBoth: price } = ctx;
    const c = cfg.contact;
    const b = esc(cfg.brand.name);
    const f = esc(cfg.founder.name);
    const d = cfg.legal.effectiveDate;
    const na = cfg.brand.showNonAffiliationNotice;
    const vi = `
<p><b>Có hiệu lực từ ${d.split('-').reverse().join('/')}</b></p>

<h2>1. Về chúng tôi</h2>
<p>Trang web này giới thiệu và nhận đặt trước sản phẩm ${b}, khoang chống ngập cho xe máy và mô tô. ${b} do ${f} sáng lập và vận hành với tư cách cá nhân. Liên hệ: <a href="mailto:${c.email}">${c.email}</a> · ${c.phoneDisplay}.${na ? ` ${b} không liên quan đến Tập đoàn Bảo Việt hay bất kỳ công ty bảo hiểm nào.` : ''}</p>

<h2>2. Thông tin sản phẩm</h2>
<ul>
<li>Thông số sản phẩm do nhà sáng lập cung cấp từ thiết kế. Hình minh họa và sơ đồ được ghi rõ là minh họa.</li>
<li>Thử nghiệm nhấn chìm được mô tả trên trang là thử nghiệm do nhà sáng lập tự thực hiện, không phải kiểm định phòng thí nghiệm. Sản phẩm chưa có chứng nhận và chúng tôi không công bố chỉ số chống nước (IP) nào.</li>
<li>Sản phẩm được thiết kế để dùng bên trong nhà xe, nhà ở hoặc khu vực có mái che, và phải được neo đúng cách. Hiệu quả phụ thuộc vào độ sâu ngập, vận tốc dòng nước, rác trôi, cách neo và cách lắp đặt. Chúng tôi không cam kết sản phẩm hoạt động trong mọi tình huống ngập.</li>
<li>${b} không phải sản phẩm bảo hiểm và không chi trả bồi thường.</li>
<li>Phiên bản rằn ri là kế hoạch tương lai; hình ảnh là bản thiết kế và chưa nhận đặt hàng.</li>
</ul>

<h2 id="dat-truoc">3. Điều khoản đặt trước</h2>
<ul>
<li><b>Đặt trước không phải là mua hàng.</b> Gửi mẫu đặt trước chỉ là đăng ký giữ chỗ. Bạn không phải trả bất kỳ khoản nào trên trang web và không có nghĩa vụ phải mua.</li>
<li><b>Xác nhận.</b> Chúng tôi sẽ liên hệ qua thông tin bạn để lại để xác nhận số lượng, giá (hiện là ${price} một bộ), phí giao hàng nếu có và thời gian giao hàng dự kiến.</li>
<li><b>Hợp đồng mua bán chỉ hình thành</b> khi bạn đồng ý các điều kiện đã được xác nhận và thanh toán theo hướng dẫn chúng tôi gửi trực tiếp cho bạn.</li>
<li><b>Hủy.</b> Bạn có thể hủy đặt trước bất cứ lúc nào trước khi thanh toán, chỉ cần báo cho chúng tôi.</li>
<li><b>Giá.</b> Giá hiển thị trên trang tại thời điểm bạn gửi mẫu là giá áp dụng cho đơn đặt trước đó, trừ khi bạn đồng ý khác khi được liên hệ.</li>
<li>Chúng tôi có thể từ chối hoặc hủy một đơn đặt trước (ví dụ khi số lượng sản xuất có hạn) và sẽ thông báo cho bạn. Vì bạn chưa thanh toán, bạn không chịu chi phí nào.</li>
</ul>

<h2>4. An toàn</h2>
<p>An toàn của con người luôn là ưu tiên. Hãy tuân theo hướng dẫn và lệnh sơ tán của chính quyền địa phương. Không ở lại hoặc quay lại khu vực nguy hiểm chỉ để kiểm tra phương tiện.</p>

<h2>5. Trách nhiệm</h2>
<p>Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm đối với thiệt hại gián tiếp phát sinh từ việc sử dụng trang web. Không điều khoản nào ở đây hạn chế các quyền của bạn theo pháp luật về bảo vệ quyền lợi người tiêu dùng.</p>

<h2>6. Sở hữu trí tuệ</h2>
<p>Hình ảnh sản phẩm, phim giới thiệu, logo và nội dung trên trang thuộc về ${b} và nhà sáng lập. Các bài báo được dẫn nguồn thuộc về các cơ quan báo chí tương ứng; chúng tôi chỉ tóm tắt và dẫn liên kết, không sao chép.</p>

<h2>7. Liên kết bên ngoài</h2>
<p>Trang web có liên kết tới các nguồn bên ngoài để bạn kiểm chứng số liệu. Chúng tôi không chịu trách nhiệm về nội dung của các trang đó.</p>

<h2>8. Luật áp dụng</h2>
<p>Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam.</p>

<h2>9. Dữ liệu cá nhân</h2>
<p>Xem <a href="${url('privacy')}">Chính sách bảo mật</a>.</p>`;

    const en = `
<p><b>Effective ${d}</b></p>

<h2>1. About us</h2>
<p>This website presents and takes pre-orders for ${b}, a flood enclosure for motorcycles. ${b} is founded and run by ${f} as an individual. Contact: <a href="mailto:${c.email}">${c.email}</a> · ${c.phoneDisplay}.${na ? ` ${b} is not affiliated with Bao Viet Holdings (Tập đoàn Bảo Việt) or any insurance company.` : ''}</p>

<h2>2. Product information</h2>
<ul>
<li>Product specifications are supplied by the founder from the product design. Illustrations and diagrams are labelled as such.</li>
<li>The submersion test described on this site was conducted by the founder; it is not a laboratory certification. The product has no certification and we claim no IP waterproof rating.</li>
<li>The product is designed for use inside a garage, house or covered area and must be anchored properly. Performance depends on flood depth, water velocity, debris, anchoring and installation. We do not guarantee it will work in every flood.</li>
<li>${b} is not an insurance product and pays out nothing.</li>
<li>The camouflage edition is a future plan; its image is a design render and it is not available to order.</li>
</ul>

<h2 id="dat-truoc">3. Pre-order terms</h2>
<ul>
<li><b>A pre-order is not a purchase.</b> Sending the pre-order form only reserves a unit. You pay nothing on this website and are under no obligation to buy.</li>
<li><b>Confirmation.</b> We will contact you using the details you provide to confirm quantity, price (currently ${price} per unit), any delivery charge and the expected delivery time.</li>
<li><b>A sales contract is formed only</b> when you accept the confirmed terms and pay according to instructions we send you directly.</li>
<li><b>Cancelling.</b> You can cancel a pre-order at any time before payment simply by telling us.</li>
<li><b>Price.</b> The price shown when you send the form is the price for that pre-order, unless you agree otherwise when we contact you.</li>
<li>We may decline or cancel a pre-order (for example if a production run is limited) and will tell you if we do. As you have not paid, you bear no cost.</li>
</ul>

<h2>4. Safety</h2>
<p>People's safety always comes first. Follow local authorities' instructions and evacuation orders. Never stay in, or return to, a dangerous area just to check on a vehicle.</p>

<h2>5. Liability</h2>
<p>To the extent permitted by law, we are not liable for indirect losses arising from use of this website. Nothing in these terms limits your rights under consumer protection law.</p>

<h2>6. Intellectual property</h2>
<p>Product photos, the product film, the logo and site content belong to ${b} and its founder. Cited news articles belong to their publishers; we summarise them in our own words and link to them, and we don't copy them.</p>

<h2>7. External links</h2>
<p>This site links to outside sources so you can check our figures. We are not responsible for the content of those sites.</p>

<h2>8. Governing law</h2>
<p>These terms are governed by the laws of Vietnam.</p>

<h2>9. Personal data</h2>
<p>See the <a href="${url('privacy')}">Privacy Policy</a>.</p>`;

    return `
${pageHero(ctx, { label: t('Điều khoản', 'Terms'), title: t('Điều khoản sử dụng và đặt trước', 'Terms of use and pre-orders') })}
<section><div class="wrap"><div class="prose">${t(vi, en)}</div></div></section>`;
  },
};
