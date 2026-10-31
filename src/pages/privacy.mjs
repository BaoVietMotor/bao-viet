import { routes, breadcrumbLd, pageHero } from './_lib.mjs';

export default {
  id: 'privacy',
  path: routes.privacy,
  title: { vi: 'Chính sách bảo mật | Bảo Việt Motor', en: 'Privacy policy | Bảo Việt Motor' },
  description: {
    vi: 'Bảo Việt Motor thu thập dữ liệu gì, dùng để làm gì, lưu bao lâu và bạn có những quyền gì đối với dữ liệu cá nhân của mình.',
    en: 'What personal data Bảo Việt Motor collects, why, how long it is kept, and your rights over it.',
  },
  jsonld: (ctx) => [breadcrumbLd(ctx, 'privacy', ctx.t('Chính sách bảo mật', 'Privacy policy'))],

  body(ctx) {
    const { t, url, esc, cfg } = ctx;
    const c = cfg.contact;
    const b = esc(cfg.brand.name);
    const f = esc(cfg.founder.name);
    const v = cfg.legal.privacyVersion;
    const d = cfg.legal.effectiveDate;
    const vi = `
<p><b>Phiên bản ${v} · Có hiệu lực từ ${d.split('-').reverse().join('/')}</b></p>
<p>Chính sách này giải thích cách ${b} xử lý dữ liệu cá nhân của bạn, phù hợp với Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và các văn bản hướng dẫn. Chúng tôi cố gắng viết ngắn gọn và dễ hiểu.</p>

<h2>1. Ai chịu trách nhiệm</h2>
<p>${b} là một dự án do ${f} sáng lập và vận hành với tư cách cá nhân. ${f} là người kiểm soát và xử lý dữ liệu của bạn. Liên hệ: <a href="mailto:${c.email}">${c.email}</a> · ${c.phoneDisplay}.</p>

<h2>2. Chúng tôi thu thập gì</h2>
<table>
<thead><tr><th>Khi nào</th><th>Dữ liệu</th></tr></thead>
<tbody>
<tr><td>Bạn gửi mẫu đặt trước</td><td>Họ tên, số điện thoại/Zalo, email (nếu có), tỉnh/thành phố, dòng xe (nếu có), số lượng, cách liên hệ mong muốn, ghi chú, thời điểm bạn đồng ý.</td></tr>
<tr><td>Bạn gửi mẫu liên hệ</td><td>Họ tên, số điện thoại và/hoặc email, chủ đề, nội dung tin nhắn, thời điểm bạn đồng ý.</td></tr>
<tr><td>Bạn truy cập trang</td><td>Chúng tôi <b>không</b> dùng cookie theo dõi, không dùng công cụ phân tích hay quảng cáo của bên thứ ba. Trình duyệt của bạn lưu lựa chọn ngôn ngữ (VI/EN) trên chính máy bạn; thông tin này không được gửi cho chúng tôi.</td></tr>
<tr><td>Chống spam</td><td>Khi bạn gửi mẫu, máy chủ tạo một mã băm một chiều từ địa chỉ IP để giới hạn số lần gửi. Mã này không lưu cùng thông tin bạn gửi và tự hết hạn sau khoảng một giờ. Chúng tôi không lưu địa chỉ IP gốc.</td></tr>
</tbody>
</table>
<p>Nhà cung cấp hạ tầng (Cloudflare) xử lý dữ liệu kỹ thuật thông thường của mỗi lượt truy cập, như địa chỉ IP và loại trình duyệt, để vận hành và bảo vệ trang web.</p>
<p><b>Nội dung từ bên thứ ba.</b> Một số trang hiển thị ảnh từ Wikimedia Commons và ảnh xem trước video từ YouTube. Trình duyệt của bạn tải các ảnh này trực tiếp từ máy chủ của họ (upload.wikimedia.org, thumb.wikimedia.org, i.ytimg.com), nên họ nhận được địa chỉ IP và loại trình duyệt của bạn. Trình phát YouTube chỉ được tải từ youtube-nocookie.com <b>khi bạn bấm phát</b>; từ lúc đó, YouTube (Google) có thể đặt cookie theo chính sách riêng của họ.</p>

<h2>3. Dùng để làm gì</h2>
<ul>
<li>Liên hệ xác nhận và thực hiện đơn đặt trước của bạn.</li>
<li>Trả lời câu hỏi và yêu cầu của bạn.</li>
<li>Ngăn chặn spam và lạm dụng.</li>
</ul>
<p>Chúng tôi không dùng dữ liệu của bạn cho quảng cáo, không bán và không trao đổi dữ liệu cá nhân.</p>

<h2>4. Cơ sở xử lý</h2>
<p>Sự đồng ý của bạn, được thể hiện khi bạn đánh dấu vào ô đồng ý trước khi gửi mẫu. Ô này không được đánh dấu sẵn. Bạn có thể rút lại sự đồng ý bất cứ lúc nào; việc rút lại không ảnh hưởng đến việc xử lý đã diễn ra trước đó.</p>

<h2>5. Chia sẻ và chuyển dữ liệu ra nước ngoài</h2>
<p>Dữ liệu chỉ được những nhà cung cấp dịch vụ cần thiết để vận hành trang web xử lý thay cho chúng tôi:</p>
<ul>
<li>Cloudflare, Inc. lưu trữ trang web và cơ sở dữ liệu. Máy chủ của Cloudflare có thể đặt ở ngoài Việt Nam, vì vậy dữ liệu của bạn có thể được chuyển ra nước ngoài để lưu trữ. Khi đồng ý, bạn đồng ý với việc chuyển này.</li>
<li>Một dịch vụ gửi email, chỉ khi chúng tôi bật thông báo email cho đơn mới. Khi đó nội dung đơn được gửi tới hộp thư của người sáng lập.</li>
</ul>
<p>Chúng tôi chỉ cung cấp dữ liệu cho cơ quan nhà nước khi pháp luật yêu cầu.</p>

<h2>6. Lưu trữ bao lâu</h2>
<ul>
<li>Thông tin đặt trước và liên hệ: tối đa 24 tháng kể từ lần liên hệ cuối, hoặc cho đến khi bạn yêu cầu xóa, tùy điều kiện nào đến trước.</li>
<li>Mã băm chống spam: khoảng một giờ.</li>
</ul>

<h2>7. Quyền của bạn</h2>
<p>Bạn có quyền được biết về việc xử lý dữ liệu; đồng ý hoặc không đồng ý; rút lại sự đồng ý; xem và nhận bản sao dữ liệu; yêu cầu chỉnh sửa; yêu cầu xóa; yêu cầu hạn chế xử lý; phản đối việc xử lý; và khiếu nại, khởi kiện theo quy định pháp luật.</p>
<p>Để thực hiện bất kỳ quyền nào, hãy email <a href="mailto:${c.email}">${c.email}</a> hoặc gửi mẫu tại trang <a href="${url('contact')}">Liên hệ</a> với chủ đề "Yêu cầu về dữ liệu cá nhân". Chúng tôi sẽ xác minh yêu cầu và phản hồi sớm nhất có thể, trong thời hạn pháp luật quy định.</p>

<h2>8. Bảo mật</h2>
<ul>
<li>Toàn bộ trang web dùng kết nối mã hóa HTTPS.</li>
<li>Chỉ nhà sáng lập truy cập được dữ liệu, qua trang quản trị có mật khẩu.</li>
<li>Chúng tôi chỉ thu thập những gì cần để liên hệ với bạn.</li>
</ul>
<p>Nếu xảy ra sự cố lộ lọt dữ liệu, chúng tôi sẽ thông báo cho bạn và cơ quan có thẩm quyền theo quy định.</p>

<h2>9. Trẻ em</h2>
<p>Trang web không hướng tới trẻ em. Nếu bạn dưới 16 tuổi, vui lòng chỉ gửi thông tin khi có sự đồng ý của cha mẹ hoặc người giám hộ.</p>

<h2>10. Thay đổi chính sách</h2>
<p>Khi chính sách thay đổi, chúng tôi cập nhật số phiên bản và ngày hiệu lực ở đầu trang. Thay đổi quan trọng sẽ được thông báo trước khi áp dụng.</p>`;

    const en = `
<p><b>Version ${v} · Effective ${d}</b></p>
<p>This policy explains how ${b} handles your personal data, in line with Vietnam's Law on Personal Data Protection No. 91/2025/QH15 and its implementing regulations. We have tried to keep it short and readable.</p>

<h2>1. Who is responsible</h2>
<p>${b} is a project founded and run by ${f} as an individual. ${f} is the controller and processor of your data. Contact: <a href="mailto:${c.email}">${c.email}</a> · ${c.phoneDisplay}.</p>

<h2>2. What we collect</h2>
<table>
<thead><tr><th>When</th><th>Data</th></tr></thead>
<tbody>
<tr><td>You send the pre-order form</td><td>Name, phone/Zalo, email (if given), province/city, bike model (if given), quantity, preferred contact method, notes, and the time you gave consent.</td></tr>
<tr><td>You send the contact form</td><td>Name, phone and/or email, topic, message, and the time you gave consent.</td></tr>
<tr><td>You visit the site</td><td>We do <b>not</b> use tracking cookies, analytics or third-party advertising tools. Your browser stores your language choice (VI/EN) on your own device; it is not sent to us.</td></tr>
<tr><td>Spam prevention</td><td>When you submit a form, the server creates a one-way hash of your IP address to limit repeat submissions. It is not stored with your submission and expires after about an hour. We do not store your raw IP address.</td></tr>
</tbody>
</table>
<p>Our infrastructure provider (Cloudflare) processes ordinary technical data for each visit, such as IP address and browser type, to run and protect the website.</p>
<p><b>Third-party content.</b> Some pages show photos from Wikimedia Commons and video preview images from YouTube. Your browser loads these directly from their servers (upload.wikimedia.org, thumb.wikimedia.org, i.ytimg.com), so they receive your IP address and browser type. The YouTube player is loaded from youtube-nocookie.com <b>only when you press play</b>; from then on, YouTube (Google) may set cookies under its own policy.</p>

<h2>3. What we use it for</h2>
<ul>
<li>Contacting you to confirm and fulfil your pre-order.</li>
<li>Answering your questions and requests.</li>
<li>Preventing spam and abuse.</li>
</ul>
<p>We do not use your data for advertising, and we never sell or trade personal data.</p>

<h2>4. Legal basis</h2>
<p>Your consent, given when you tick the consent box before submitting a form. The box is never pre-ticked. You can withdraw consent at any time; withdrawal does not affect processing that happened before.</p>

<h2>5. Sharing and transfers abroad</h2>
<p>Data is processed on our behalf only by service providers needed to run the website:</p>
<ul>
<li>Cloudflare, Inc. hosts the website and database. Cloudflare's servers may be located outside Vietnam, so your data may be transferred abroad for storage. By consenting, you agree to this transfer.</li>
<li>An email delivery service, only if we turn on email alerts for new orders. In that case order details are sent to the founder's inbox.</li>
</ul>
<p>We disclose data to public authorities only where the law requires it.</p>

<h2>6. How long we keep it</h2>
<ul>
<li>Pre-order and contact details: up to 24 months after our last contact with you, or until you ask us to delete them, whichever is sooner.</li>
<li>Spam-prevention hashes: about one hour.</li>
</ul>

<h2>7. Your rights</h2>
<p>You have the right to be informed about processing; to give or refuse consent; to withdraw consent; to access and receive a copy of your data; to have it corrected; to have it deleted; to restrict processing; to object to processing; and to complain or take legal action as provided by law.</p>
<p>To exercise any of these rights, email <a href="mailto:${c.email}">${c.email}</a> or use the <a href="${url('contact')}">Contact</a> page with the topic "Personal data request". We will verify the request and respond as soon as we can, within the time allowed by law.</p>

<h2>8. Security</h2>
<ul>
<li>The whole site uses encrypted HTTPS connections.</li>
<li>Only the founder can access the data, through a password-protected admin page.</li>
<li>We collect only what we need to contact you.</li>
</ul>
<p>If a data breach occurs, we will notify you and the competent authority as required by law.</p>

<h2>9. Children</h2>
<p>This site is not aimed at children. If you are under 16, please submit information only with the consent of a parent or guardian.</p>

<h2>10. Changes</h2>
<p>When this policy changes we update the version number and effective date at the top. Significant changes will be announced before they apply.</p>`;

    return `
${pageHero(ctx, { label: t('Chính sách bảo mật', 'Privacy policy'), title: t('Dữ liệu của bạn, nói cho dễ hiểu', 'Your data, in plain language') })}
<section><div class="wrap"><div class="prose">${t(vi, en)}</div></div></section>`;
  },
};
