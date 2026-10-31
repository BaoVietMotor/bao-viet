/**
 * Frequently asked questions. Answers are plain text (no HTML) so they can also go into
 * FAQPage structured data. {price}, {brand}, {units} and {nonAffiliation} are filled in at build time.
 */
export const faq = [
  {
    group: 'product',
    q: { vi: '{brand} khác gì bạt phủ xe thông thường?', en: 'How is {brand} different from an ordinary bike cover?' },
    a: {
      vi: 'Bạt phủ che mưa từ trên xuống. {brand} là khoang kín bọc cả xe từ sàn lên: một khóa kéo chống nước khoảng 3 m dọc nóc, bốn khoen neo ở bốn góc đáy. Giữ nước ở ngoài, giữ xe tại chỗ.',
      en: 'A cover keeps rain off from above. {brand} seals the whole bike, floor up: one waterproof zipper about 3 m long on top, four anchor rings at the bottom corners. Water stays out, the bike stays put.',
    },
  },
  {
    group: 'product',
    q: { vi: 'Sao không dùng bạt thường cho rẻ?', en: 'Why not use a cheap tarp instead?' },
    a: {
      vi: 'Bạt thường từng cứu được xe (Nhân Dân, VnExpress có đưa tin). Nhưng chính những người đó kể: bạt rách, nước rỉ ở các góc túm phải bơm suốt đêm, nóc bị hở, phải tự tìm chỗ buộc. {brand} được thiết kế để xử lý từng chỗ đó.',
      en: 'Tarps have saved vehicles (Nhân Dân and VnExpress reported it). The same owners describe the problems: tears, leaks at the gathered corners bad enough to pump all night, an open top, nothing to tie to. {brand} is designed to fix each one.',
    },
  },
  {
    group: 'product',
    q: { vi: 'Có chắc chắn chống ngập 100% không?', en: 'Is it guaranteed to be 100% flood-proof?' },
    a: {
      vi: 'Không. Không ai trung thực hứa được điều đó. Mình đã nhấn chìm hoàn toàn một chiếc Yamaha R15 trong khoang mẫu và nước không vào, nhưng đó là thử nghiệm cá nhân, không phải kiểm định phòng thí nghiệm. Không có chỉ số IP. Thực tế còn tùy độ sâu, dòng chảy, rác trôi, cách neo và cách dựng.',
      en: "No. Nobody can honestly promise that. I fully submerged a Yamaha R15 inside a sample and no water got in, but it was a personal test, not a laboratory certification. No IP rating. Real results depend on depth, current, debris, anchoring and setup.",
    },
  },
  {
    group: 'product',
    q: { vi: 'Dùng ngoài trời hoặc chỗ nước chảy xiết được không?', en: 'Can I use it outdoors or in fast-flowing water?' },
    a: {
      vi: 'Không khuyên. {brand} làm cho nhà xe, trong nhà, chỗ có mái che, nơi nước dâng từ từ. Có lũ quét hay nước xiết: đưa người và xe lên chỗ cao trước.',
      en: "Not recommended. {brand} is made for garages, homes and covered spaces where water rises slowly. Flash floods or fast water: move people and vehicles to higher ground first.",
    },
  },
  {
    group: 'product',
    q: { vi: 'Xe của tôi có vừa không?', en: 'Will my bike fit?' },
    a: {
      vi: 'Lòng trong 2.300 × 1.200 × 1.450 mm (dài × rộng × cao). Xe nhỏ hơn cả ba số (rộng tính cả gương) là vừa. Kiểm tra nhanh ở trang Sản phẩm.',
      en: "Inside: 2,300 × 1,200 × 1,450 mm (length × width × height). If your bike is smaller on all three (width including mirrors), it fits. Quick check on the Product page.",
    },
  },
  {
    group: 'product',
    q: { vi: 'Neo như thế nào?', en: 'How do I anchor it?' },
    a: {
      vi: 'Buộc bốn khoen ở góc đáy vào chỗ cố định chắc chắn (móc sàn, cột, khung sắt) bằng dây thừng hoặc dây đai. Neo xong trước khi nước tới. Không neo, nước có thể đẩy cả khoang đi.',
      en: "Tie the four bottom-corner rings to something solid (floor anchor, column, steel frame) with rope or straps. Do it before the water comes. Unanchored, water can push the whole enclosure away.",
    },
  },
  {
    group: 'product',
    q: { vi: 'Nặng bao nhiêu, cất ở đâu?', en: 'How heavy is it, and where do I keep it?' },
    a: {
      vi: 'Khoảng 10 kg. Cuộn gọn để góc nhà xe. Lau sạch, phơi khô trước khi cuộn.',
      en: 'About 10 kg. Rolls up into a corner of the garage. Clean and dry it before rolling.',
    },
  },
  {
    group: 'product',
    q: { vi: 'Sản phẩm đã được kiểm định chưa?', en: 'Has it been certified?' },
    a: {
      vi: 'Chưa. Không có chứng nhận phòng thí nghiệm hay sản xuất, không có chỉ số IP. Bằng chứng duy nhất là lần thử nhấn chìm do mình tự làm, và luôn được ghi rõ như vậy.',
      en: "Not yet. No laboratory or manufacturing certification, no IP rating. The only evidence is the submersion test I did myself, and it's always labelled that way.",
    },
  },
  {
    group: 'product',
    q: { vi: '{brand} có phải sản phẩm bảo hiểm không?', en: 'Is {brand} an insurance product?' },
    a: {
      vi: 'Không. Đây là vật dụng che chắn xe, không phải hợp đồng bảo hiểm, không bồi thường.{nonAffiliation}',
      en: 'No. It is a physical cover for your bike, not an insurance policy, and it pays out nothing.{nonAffiliation}',
    },
  },
  {
    group: 'order',
    q: { vi: 'Đặt trước thế nào? Có phải trả tiền trước không?', en: 'How does pre-ordering work? Do I pay upfront?' },
    a: {
      vi: 'Điền mẫu, nhận mã đơn ngay. Không mất đồng nào. Mình gọi hoặc nhắn Zalo xác nhận số lượng, phí giao và thời gian, rồi bạn mới trả. Hủy lúc nào cũng được trước khi trả tiền.',
      en: "Fill in the form, get an order code instantly. It costs nothing. I call or message you on Zalo to confirm quantity, delivery cost and timing; only then do you pay. Cancel any time before paying.",
    },
  },
  {
    group: 'order',
    q: { vi: 'Giá bao nhiêu?', en: 'How much does it cost?' },
    a: {
      vi: '{price} một bộ. Giá đặt bằng USD; số tiền đồng là quy đổi theo tỷ giá bán của Vietcombank ngày 30/10/2026, làm tròn. Phí giao (nếu có) báo trước khi bạn trả tiền.',
      en: '{price} per unit. The price is set in US dollars; the dong figure is converted at Vietcombank\'s selling rate on 30 Oct 2026, rounded. Any delivery charge is confirmed before you pay.',
    },
  },
  {
    group: 'order',
    q: { vi: 'Khi nào tôi nhận được hàng?', en: 'When will I get it?' },
    a: {
      vi: 'Mình báo thời gian cụ thể khi gọi xác nhận. Không hứa ngày khi chưa chắc.',
      en: "I'll give you a specific time when I call to confirm. No promised dates I can't keep.",
    },
  },
  {
    group: 'order',
    q: { vi: 'Cửa hàng, đại lý nhập sỉ được không?', en: 'Can shops and dealers buy wholesale?' },
    a: {
      vi: 'Được. Gửi yêu cầu ở trang Liên hệ, chọn "Hợp tác / Bán sỉ".',
      en: 'Yes. Use the Contact page and pick "Partnerships / Wholesale".',
    },
  },
  {
    group: 'order',
    q: { vi: 'Thông tin cá nhân của tôi được dùng thế nào?', en: 'How is my personal information used?' },
    a: {
      vi: 'Chỉ để xác nhận đơn và trả lời bạn. Không bán, không chia sẻ cho quảng cáo. Bạn có thể yêu cầu xem, sửa, xóa bất cứ lúc nào. Chi tiết trong Chính sách bảo mật.',
      en: 'Only to confirm your order and reply to you. Never sold or shared for advertising. Ask to see, correct or delete it any time. Details in the privacy policy.',
    },
  },
  {
    group: 'order',
    q: { vi: 'Mua ở đâu?', en: 'Where can I buy it?' },
    a: {
      vi: 'Lô đầu tiên {units} chiếc ra mắt tại các đại lý đối tác. Bạn cũng có thể đặt trước ngay trên trang này.',
      en: 'The first batch of {units} units launches at partner dealerships. You can also pre-order right here on this site.',
    },
  },
];
