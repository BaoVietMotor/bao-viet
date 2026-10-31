import home, { MOVED, pickSections } from './home.mjs';
import { routes, icons, breadcrumbLd, pageHero } from './_lib.mjs';
import { vkVideo, newsVideos } from '../data/media.mjs';
import { ytCard, commonsFig, timelineHtml, articlesHtml } from './_media.mjs';

export default {
  id: 'floods',
  path: routes.floods,
  title: {
    vi: 'Lũ và xe máy ở miền Trung: video, ảnh, báo chí | Bảo Việt Motor',
    en: 'Floods and motorbikes in central Vietnam: videos, photos, press | Bảo Việt Motor',
  },
  description: {
    vi: 'Video, ảnh và bài báo có nguồn về chuyện nước lũ làm gì với xe máy ở miền Trung: Huế, Đà Nẵng, Quảng Ngãi, Nha Trang.',
    en: 'Sourced videos, photos and news reports on what floodwater does to motorbikes in central Vietnam: Huế, Đà Nẵng, Quảng Ngãi and Nha Trang.',
  },
  jsonld: (ctx) => [breadcrumbLd(ctx, 'floods', ctx.t('Lũ & xe máy', 'Floods & motorbikes'))],

  body(ctx) {
    const moved = pickSections(home.fullBody(ctx), MOVED.floods);
    const { t, url, lang, price, esc, brand } = ctx;
    return `
${pageHero(ctx, {
  label: t('Lũ & xe máy', 'Floods & motorbikes'),
  title: t('Lũ và xe máy ở miền Trung', 'Floods and motorbikes in central Vietnam'),
  lead: t('Huế, Đà Nẵng, Quảng Ngãi, Nha Trang. Video, ảnh, báo chí. Tất cả có nguồn gốc.',
    'Huế, Đà Nẵng, Quảng Ngãi, Nha Trang. Videos, photos, news. All sourced.'),
})}

<section aria-labelledby="clips-h">
  <div class="wrap">
    <p class="label">Video</p>
    <h2 class="h2" id="clips-h">${t('Xem tận mắt', 'See it for yourself')}</h2>
    <div class="mt">${ytCard(ctx, vkVideo, { featured: true, caption: esc(vkVideo.note[lang]) })}</div>
    <div class="grid g3 mt">${newsVideos.map((v) => ytCard(ctx, v)).join('')}</div>
    <p class="tiny mt-s">${t('Video nhúng từ YouTube, thuộc về các kênh ghi bên dưới, chỉ tải khi bạn bấm phát. Việc nhúng video không có nghĩa là các kênh này hợp tác với hay xác nhận sản phẩm của ' + esc(brand) + '.',
      'Videos are embedded from YouTube and belong to the channels named under each one. The player only loads when you press play. Embedding a video does not mean its channel partners with or endorses ' + esc(brand) + '.')}</p>
  </div>
</section>

<section class="s-2" aria-labelledby="photos-h">
  <div class="wrap">
    <p class="label">${t('Ảnh', 'Photos')}</p>
    <h2 class="h2" id="photos-h">${t('Huế, Đà Nẵng, Quảng Ngãi', 'Huế, Đà Nẵng, Quảng Ngãi')}</h2>
    <div class="cgal mt">
      ${commonsFig(ctx, 'hueAerial2020')}
      ${commonsFig(ctx, 'danangAir2009')}
      ${commonsFig(ctx, 'hueKetsana')}
      ${commonsFig(ctx, 'qnPush')}
      ${commonsFig(ctx, 'qnWade')}
      ${commonsFig(ctx, 'qnRiders')}
    </div>
    <p class="tiny mt">${t('Ảnh Wikimedia Commons, giấy phép tự do, không chỉnh sửa, ghi tác giả dưới mỗi ảnh.', 'Wikimedia Commons photos, free licences, unedited, author under each.')}</p>
  </div>
</section>

<section aria-labelledby="tl-h">
  <div class="wrap">
    <p class="label">${t('Dòng thời gian', 'Timeline')}</p>
    <h2 class="h2" id="tl-h">${t('Vài trận lũ ở miền Trung, từ 2009 tới 2025', 'Some of the floods in central Vietnam, 2009 to 2025')}</h2>
    <div class="mt">${timelineHtml(ctx)}</div>
  </div>
</section>

<section class="s-2" aria-labelledby="news-h">
  <div class="wrap">
    <p class="label">${t('Báo chí', 'In the press')}</p>
    <h2 class="h2" id="news-h">${t('Đọc từ chính các tờ báo', 'Read it in the papers themselves')}</h2>
    <div class="mt">${articlesHtml(ctx)}</div>
  </div>
</section>

${moved}
<div class="hazard" aria-hidden="true"></div>
<section class="s-yellow cta-band" aria-labelledby="fl-cta">
  <div class="wrap narrow">
    <h2 class="h2" id="fl-cta">${t('Lần tới, đừng để là xe của bạn.', "Next time, don't let it be yours.")}</h2>
    <p class="lead">${t('Bọc kín và neo chặt trước khi nước tới.', 'Seal it and tie it down before the water comes.')}</p>
    <div class="btns mt" style="justify-content:center"><a class="btn btn-dark" href="${url('preorder')}">${t('Đặt ngay', 'Order now')}, ${price} ${icons.arrow}</a><a class="btn btn-outline" href="${url('product')}">${t('Xem sản phẩm', 'See the product')}</a></div>
  </div>
</section>`;
  },
};
