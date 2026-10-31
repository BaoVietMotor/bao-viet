/**
 * Third-party media shown on the site, focused on central Vietnam (Huế, Đà Nẵng, Quảng Ngãi, Nha Trang).
 * Every item checked on 2026-10-13.
 *
 * Videos: embedded from YouTube (titles and channels confirmed through YouTube's oEmbed API,
 *   which also confirms the owner allows embedding). Nothing loads from YouTube until the
 *   visitor presses play; the player then comes from youtube-nocookie.com.
 * Photos: free licences on Wikimedia Commons (CC BY 2.0 / 3.0, CC BY-SA 3.0 / 4.0), shown unmodified
 *   from Wikimedia's servers, with author, licence and a link to the file page.
 *   Captions use the date and place recorded on each file page.
 * Articles: linked, never copied. Summaries are our own words.
 */

export const vkVideo = {
  id: 'YkiSJvBsNbs',
  title: 'TÔI VỘI VÃ ĐI CỨU HỘ KHÁCH BỊ NGẬP LŨ Ở NHA TRANG - MẤT HẾT TẤT CẢ RỒI...',
  channel: 'Vuong Khang Motor',
  channelUrl: 'https://www.youtube.com/@VuongKhangMotor',
  note: {
    vi: 'Kênh Vuong Khang Motor ghi lại chuyến đi cứu hộ khách hàng có xe bị ngập lũ ở Nha Trang.',
    en: 'The Vuong Khang Motor channel follows a trip to rescue customers whose bikes were caught in the Nha Trang floods.',
  },
};

/** News clips from central Vietnam. `place` is shown as a tag. */
export const newsVideos = [
  { id: 'wjo-QDIz5a0', title: 'Các tiệm sửa xe Nha Trang “vỡ trận” sau lũ: Xe xếp hàng dài, thợ làm không kịp thở', channel: 'Báo Nghệ An', place: 'Nha Trang' },
  { id: 'JK81kH-ZAJQ', title: 'Nha Trang khốn đốn vì ngập sâu, tài sản xe cộ chìm trong 1 mét nước | Tin nhanh', channel: 'Báo Pháp Luật TP HCM', place: 'Nha Trang' },
  { id: 'X_MLKscZU0o', title: 'Sau lũ ở Huế, xe máy hư hỏng xếp hàng la liệt chờ sửa', channel: 'Tuổi Trẻ Media', place: 'Huế' },
  { id: 'HNKTA_pNHgg', title: 'Cứu hộ giao thông chạy đầy đường, các cửa hàng sửa xe máy ở Huế sắp quá tải sau lũ', channel: 'Báo Lao Động', place: 'Huế' },
  { id: 'AodI41Nljpk', title: 'Ôtô chết máy nằm la liệt trên đường phố Đà Nẵng sau trận mưa kỷ lục | VTV24', channel: 'VTV24', place: 'Đà Nẵng' },
  { id: 'Y-EgY0RgXHs', title: 'Hàng ngàn xe máy ngập nước, phơi đầy đường ở Phú Yên cũ sau trận lũ lịch sử', channel: 'Tạp chí VietTimes', place: 'Phú Yên' },
];

const BY2 = { license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/' };
const BY3 = { license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0/' };
const BYSA3 = { license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/' };
const BYSA4 = { license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/' };
const TH = 'https://thumb.wikimedia.org/wikipedia/commons/thumb';
const UP = 'https://upload.wikimedia.org/wikipedia/commons';

export const photos = {
  hueAerial2020: {
    src500: `${TH}/8/83/L%C5%A9_l%E1%BB%A5t_Hu%E1%BA%BF_2020.jpg/500px-L%C5%A9_l%E1%BB%A5t_Hu%E1%BA%BF_2020.jpg`,
    src: `${UP}/8/83/L%C5%A9_l%E1%BB%A5t_Hu%E1%BA%BF_2020.jpg`,
    w: 960, h: 720,
    page: 'https://commons.wikimedia.org/wiki/File:L%C5%A9_l%E1%BB%A5t_Hu%E1%BA%BF_2020.jpg',
    author: 'Lê Minh Đức', ...BYSA4,
    caption: { vi: 'Thành phố Huế nhìn từ trên cao trong đợt lũ lụt miền Trung, 10/10/2020.', en: 'Huế seen from above during the central Vietnam floods, 10 Oct 2020.' },
    tag: { vi: 'Huế · 10/2020', en: 'Huế · Oct 2020' },
  },
  qnPush: {
    src500: `${TH}/2/2f/Inundo-Quang_Ngai-3.jpg/500px-Inundo-Quang_Ngai-3.jpg`,
    src: `${TH}/2/2f/Inundo-Quang_Ngai-3.jpg/960px-Inundo-Quang_Ngai-3.jpg`,
    w: 960, h: 720,
    page: 'https://commons.wikimedia.org/wiki/File:Inundo-Quang_Ngai-3.jpg',
    author: 'RG72', ...BYSA3,
    caption: { vi: 'Dắt xe máy qua phố ngập ở Quảng Ngãi sau nhiều ngày mưa lớn do ảnh hưởng của bão Hải Yến, 16/11/2013.', en: 'Pushing a motorbike through a flooded street in Quảng Ngãi after days of heavy rain on the edge of Typhoon Haiyan, 16 Nov 2013.' },
    tag: { vi: 'Quảng Ngãi · 11/2013', en: 'Quảng Ngãi · Nov 2013' },
  },
  qnWade: {
    src500: `${TH}/6/6d/Quang_Ngai_2013-11-16_33.jpg/500px-Quang_Ngai_2013-11-16_33.jpg`,
    src: `${TH}/6/6d/Quang_Ngai_2013-11-16_33.jpg/960px-Quang_Ngai_2013-11-16_33.jpg`,
    w: 960, h: 720,
    page: 'https://commons.wikimedia.org/wiki/File:Quang_Ngai_2013-11-16_33.jpg',
    author: 'RG72', ...BYSA4,
    caption: { vi: 'Người dân dắt xe máy lội qua đoạn đường ngập ở Quảng Ngãi, 16/11/2013.', en: 'People wheel their motorbikes through a flooded road in Quảng Ngãi, 16 Nov 2013.' },
    tag: { vi: 'Quảng Ngãi · 11/2013', en: 'Quảng Ngãi · Nov 2013' },
  },
  qnRiders: {
    src500: `${TH}/6/6e/Quang_Ngai_2013-11-16_28.jpg/500px-Quang_Ngai_2013-11-16_28.jpg`,
    src: `${TH}/6/6e/Quang_Ngai_2013-11-16_28.jpg/960px-Quang_Ngai_2013-11-16_28.jpg`,
    w: 960, h: 720,
    page: 'https://commons.wikimedia.org/wiki/File:Quang_Ngai_2013-11-16_28.jpg',
    author: 'RG72', ...BYSA4,
    caption: { vi: 'Xe máy lội qua một con phố ngập ở Quảng Ngãi, 16/11/2013.', en: 'Motorbikes ploughing through a flooded street in Quảng Ngãi, 16 Nov 2013.' },
    tag: { vi: 'Quảng Ngãi · 11/2013', en: 'Quảng Ngãi · Nov 2013' },
  },
  hueKetsana: {
    src500: `${TH}/3/31/Ketsana_2009%2C_Hue%2C_Vietnam_3.JPG/500px-Ketsana_2009%2C_Hue%2C_Vietnam_3.JPG`,
    src: `${TH}/3/31/Ketsana_2009%2C_Hue%2C_Vietnam_3.JPG/960px-Ketsana_2009%2C_Hue%2C_Vietnam_3.JPG`,
    w: 960, h: 720,
    page: 'https://commons.wikimedia.org/wiki/File:Ketsana_2009,_Hue,_Vietnam_3.JPG',
    author: 'Lưu Ly', ...BY3,
    caption: { vi: 'Đường vào Đại Nội, Huế, ngập sau bão Ketsana, 30/9/2009.', en: "The road to Huế's Imperial City, flooded after Typhoon Ketsana, 30 Sep 2009." },
    tag: { vi: 'Huế · 9/2009', en: 'Huế · Sep 2009' },
  },
  danangAir2009: {
    src500: `${TH}/8/87/Ketsana_2009%2C_%C4%90%C3%A0_N%E1%BA%B5ng.jpg/500px-Ketsana_2009%2C_%C4%90%C3%A0_N%E1%BA%B5ng.jpg`,
    src: `${UP}/8/87/Ketsana_2009%2C_%C4%90%C3%A0_N%E1%BA%B5ng.jpg`,
    w: 600, h: 338,
    page: 'https://commons.wikimedia.org/wiki/File:Ketsana_2009,_%C4%90%C3%A0_N%E1%BA%B5ng.jpg',
    author: 'haithanh (Flickr)', ...BY2,
    caption: { vi: 'Ngoại ô Đà Nẵng nhìn từ trên cao sau bão Ketsana, 30/9/2009.', en: 'The outskirts of Đà Nẵng seen from the air after Typhoon Ketsana, 30 Sep 2009.' },
    tag: { vi: 'Đà Nẵng · 9/2009', en: 'Đà Nẵng · Sep 2009' },
  },
};

/** A dated run of real events in central Vietnam. Floods are not a one-off. Each line paraphrases its source. */
export const timeline = [
  { when: { vi: '9/2009', en: 'Sep 2009' }, where: { vi: 'Huế', en: 'Huế' },
    what: { vi: 'Bão Ketsana: đường vào Đại Nội và nhiều con phố ngập nước; xe máy vẫn phải đi qua.', en: 'Typhoon Ketsana: the road to the Imperial City and many streets flood; motorbikes still have to get through.' },
    photo: 'hueKetsana' },
  { when: { vi: '11/2013', en: 'Nov 2013' }, where: { vi: 'Quảng Ngãi', en: 'Quảng Ngãi' },
    what: { vi: 'Nhiều ngày mưa lớn do ảnh hưởng bão Hải Yến; người dân dắt xe máy lội qua phố.', en: 'Days of heavy rain on the edge of Typhoon Haiyan; people wheel motorbikes through the streets.' },
    photo: 'qnPush' },
  { when: { vi: '10/2020', en: 'Oct 2020' }, where: { vi: 'Huế', en: 'Huế' },
    what: { vi: 'Lũ lụt miền Trung tràn vào thành phố; nhiều khu dân cư chìm trong nước.', en: 'The central Vietnam floods reach the city; whole neighbourhoods go under.' },
    photo: 'hueAerial2020' },
  { when: { vi: '10/2025', en: 'Oct 2025' }, where: { vi: 'Huế', en: 'Huế' },
    what: { vi: 'Xe máy ngâm nước 3-4 ngày. Chỉ riêng một điểm sửa xe miễn phí đã sửa hơn 1.000 chiếc trong hai ngày.', en: 'Bikes sit underwater for 3 to 4 days. One free repair point alone fixes over 1,000 of them in two days.' },
    source: 'nhandanHue' },
  { when: { vi: '30/10/2025', en: '30 Oct 2025' }, where: { vi: 'Đà Nẵng', en: 'Đà Nẵng' },
    what: { vi: 'Nước ngập hơn 1 mét. Chiếc ô tô được bọc kín bằng bạt nổi suốt hai ngày và khô ráo khi nước rút.', en: 'Water rises over a metre. A car sealed in a tarpaulin floats for two days and is dry when the water recedes.' },
    source: 'nhandan' },
  { when: { vi: '11/2025', en: 'Nov 2025' }, where: { vi: 'Nha Trang', en: 'Nha Trang' },
    what: { vi: 'Có nơi nước dâng hơn 2 mét; nhiều xe máy mắc kẹt hoặc bị cuốn trên đường 23 Tháng 10.', en: 'In places the water tops 2 metres; many motorbikes are stranded or swept away on 23 Tháng 10 Street.' },
    source: 'dtiNhaTrang' },
];

/** Linked news coverage. `source` keys live in facts.mjs. */
export const articles = [
  { source: 'dtiNhaTrang', outlet: 'Dân Trí (DTiNews)', date: { vi: '18/11/2025', en: '18 Nov 2025' },
    title: 'Nha Trang severely flooded following prolonged heavy rain',
    summary: { vi: 'Mưa lớn kéo dài khiến nhiều khu vực Nha Trang ngập sâu; có nơi nước hơn 2 mét. Nhiều xe máy mắc kẹt hoặc bị cuốn trôi trên đường 23 Tháng 10.', en: 'Prolonged rain leaves much of Nha Trang deep under water, above 2 metres in places. Many motorbikes are stranded or swept away on 23 Tháng 10 Street.' } },
  { source: 'nhandanHue', outlet: 'Báo Nhân Dân', date: { vi: '3/11/2025', en: '3 Nov 2025' },
    title: 'Giúp hàng nghìn người dân Huế sửa xe ngay sau lũ',
    summary: { vi: 'Xe máy ngâm nước 3-4 ngày sau lũ cuối tháng 10, và phần nhiều tiệm sửa xe cũng hư hại. Một điểm sửa miễn phí ở Trường cao đẳng Công nghiệp Huế sửa hơn 1.000 xe trong hai ngày.', en: 'Bikes sat underwater for 3 to 4 days after the late-October flood, and many repair shops were damaged too. A free repair point at Hue Industrial College fixed over 1,000 bikes in two days.' } },
  { source: 'nhandan', outlet: 'Báo Nhân Dân', date: { vi: '2/11/2025', en: '2 Nov 2025' },
    title: 'Chiếc xe ô-tô “mới cóng” thoát ngập lũ nhờ dùng bạt bọc kín',
    summary: { vi: 'Một chiếc ô tô ở Đà Nẵng nổi trên lũ suốt hai ngày và khô ráo nhờ được bọc kín bằng bạt, với hai máy bơm chạy suốt đêm.', en: 'A car in Đà Nẵng floated for two days and stayed dry inside a sealed tarp, with two pumps running all night.' } },
  { source: 'tuoitre', outlet: 'Tuổi Trẻ', date: { vi: '29/10/2025', en: '29 Oct 2025' },
    title: 'Mưa một ngày ở Huế lên tới 1.739mm, chỉ kém mưa kỷ lục thế giới 86mm',
    summary: { vi: 'Trạm Bạch Mã (Huế) đo được 1.739 mm mưa trong một ngày, nhiều nhất từng ghi nhận ở Việt Nam và chỉ kém kỷ lục thế giới 86 mm.', en: 'Bạch Mã station (Huế) recorded 1,739 mm of rain in one day, the most ever measured in Vietnam and 86 mm short of the world record.' } },
  { source: 'vneHueShops', outlet: 'VnExpress', date: { vi: '18/11/2023', en: '18 Nov 2023' },
    title: 'Tiệm sửa xe quá tải sau lũ',
    summary: { vi: 'Sau đợt lũ lớn nhất 10 năm ở Huế, tiệm sửa xe máy chật kín, phải từ chối khách hoặc hẹn vài hôm.', en: "After Huế's biggest flood in ten years, motorbike repair shops were full and had to turn customers away or book them days later." } },
  { source: 'vnnRepair', outlet: 'VietnamNet', date: { vi: '7/10/2025', en: '7 Oct 2025' },
    title: 'Chi phí sửa xe máy sau khi bị ngập nước hết bao nhiêu tiền?',
    summary: { vi: 'Xe ngập nhẹ, xử lý kịp thời tốn khoảng 400.000-1.000.000 đồng. Nếu hỏng IC thì 2-4 triệu với xe tay ga phổ biến, có thể tới 8 triệu với xe tay ga cao cấp.', en: 'A lightly flooded bike, treated promptly, costs about ₫400,000-1,000,000. A dead ignition unit (IC) costs ₫2-4 million on popular scooters and up to ₫8 million on premium ones.' } },
  { source: 'vneEngine', outlet: 'VnExpress', date: { vi: '3/8/2001', en: '3 Aug 2001' },
    title: 'Khi xe máy lội nước',
    summary: { vi: 'Nước lọt vào động cơ qua ống pô và lỗ thông hơi các-te, làm hỏng dầu trong vài ngày, kể cả khi xe vẫn nổ máy.', en: 'Water gets into the engine through the exhaust and crankcase breather and ruins the oil within days, even if the bike still starts.' } },
  { source: 'vneBags', outlet: 'VnExpress', date: { vi: '20/9/2024', en: '20 Sep 2024' },
    title: 'Muôn kiểu túi, bạt chống lũ ôtô',
    summary: { vi: 'Túi chống ngập chuyên dụng cho ô tô có giá 4-7 triệu đồng. Bài cũng khuyên cột xe vào vật cố định.', en: 'Purpose-made flood bags for cars cost ₫4-7 million. The article also advises tying the vehicle to a fixed point.' } },
];

/**
 * Short muted loops cut from the founder's own product film (static/video/clips, 960×540, no audio).
 * Poster = a frame of the same clip (static/img/clip-<name>.jpg).
 */
export const clips = {
  roll: { vi: 'Cuộn bạt được đặt xuống, trải ra và mở khóa kéo', en: 'The roll is set down, unrolled and unzipped' },
  push: { vi: 'Dắt chiếc Yamaha R15 vào khoang', en: 'Riding up and wheeling a Yamaha R15 into the enclosure' },
  zip: { vi: 'Kéo khóa kín quanh chiếc R15', en: 'Zipping the enclosure shut around the R15' },
  sealed: { vi: 'Khoang đã đóng kín quanh chiếc xe trong hầm để xe', en: 'The sealed enclosure around the bike in a parking garage' },
  water: { vi: 'Dội nước lên đường khóa kéo ở nóc khoang', en: 'Water poured over the zipper along the top' },
  tough: { vi: 'Đi giày giẫm lên lớp bạt PVC', en: 'Walking on the PVC in boots' },
};
