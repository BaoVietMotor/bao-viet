/** Shared blocks for media: product loop clips, click-to-play YouTube, licensed photos, timeline, article cards. */
import { photos, timeline, articles, clips } from '../data/media.mjs';

/**
 * A short, silent, looping clip from the product film (works like a "live photo").
 * Nothing downloads until the clip is near the screen; it plays only while visible and has a pause button.
 * Without JavaScript (or with reduced motion) it shows the poster and normal video controls.
 */
export function loopClip(ctx, name, { tags = [], ratio = '16/9' } = {}) {
  const { t, esc, lang } = ctx;
  const label = clips[name];
  if (!label) throw new Error(`Unknown clip "${name}"`);
  return `<div class="clip"><video class="loop" data-clip muted loop playsinline controls preload="none" width="960" height="540" poster="/img/clip-${name}.webp" aria-label="${esc(label[lang])}" style="aspect-ratio:${ratio}">`
    + `<source src="/video/clips/${name}.mp4" type="video/mp4"></video>`
    + (tags[0] ? `<span class="tag" aria-hidden="true">${esc(tags[0][1])}</span>` : '')
    + `<button class="clip-btn" type="button" hidden aria-label="${esc(t('Tạm dừng clip', 'Pause clip'))}" data-l-pause="${esc(t('Tạm dừng clip', 'Pause clip'))}" data-l-play="${esc(t('Phát clip', 'Play clip'))}"><i aria-hidden="true"></i></button></div>`;
}

/**
 * YouTube card: the video's cover picture shows straight away; pressing play swaps in the real player
 * (privacy-enhanced youtube-nocookie.com) right on the page. A 'Watch on YouTube' link is kept as a fallback.
 */
export function ytCard(ctx, v, { featured = false, caption = '' } = {}) {
  const { t, esc } = ctx;
  const watch = `https://www.youtube.com/watch?v=${v.id}`;
  return `<figure class="yt${featured ? ' yt-featured' : ''}">
  <div class="yt-frame" data-yt="${esc(v.id)}" data-yt-title="${esc(v.title)}">
    <button class="yt-play" type="button" aria-label="${esc(t('Phát video', 'Play video'))}: ${esc(v.title)}">
      <img src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" width="480" height="360" alt="" loading="lazy" referrerpolicy="no-referrer">
      <span class="yt-btn" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
    </button>
    <span class="tag" aria-hidden="true">YouTube${v.place ? ` · ${esc(v.place)}` : ''}</span>
  </div>
  <figcaption>
    <b>${esc(v.title)}</b>
    <span class="yt-meta">${esc(v.channel)} · <a href="${watch}" target="_blank" rel="noopener">${t('Xem trên YouTube', 'Watch on YouTube')}</a></span>
    ${caption ? `<span class="yt-note">${caption}</span>` : ''}
  </figcaption>
</figure>`;
}

/** A Wikimedia Commons photo, shown whole and unmodified (no cropping) with author, licence and file-page link. */
export function commonsFig(ctx, key, { tag = true, cls = '' } = {}) {
  const { t, esc, lang } = ctx;
  const p = photos[key];
  return `<figure class="cfig${cls ? ` ${cls}` : ''}">
  <div class="ph">
    <img src="${p.src500}" srcset="${p.src500} 500w, ${p.src} ${p.w}w" sizes="(max-width: 560px) 100vw, (max-width: 1180px) 50vw, 560px" width="${p.w}" height="${p.h}" style="aspect-ratio:${p.w}/${p.h}" alt="${esc(p.caption[lang])}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
    ${tag ? `<span class="tag" aria-hidden="true">${esc(p.tag[lang])}</span>` : ''}
  </div>
  <figcaption>${esc(p.caption[lang])} <span class="credit">${t('Ảnh', 'Photo')}: <a href="${p.page}" target="_blank" rel="noopener">${esc(p.author)}</a> · <a href="${p.licenseUrl}" target="_blank" rel="noopener license">${esc(p.license)}</a> · Wikimedia Commons</span></figcaption>
</figure>`;
}

/** Dated run of real flood events. */
export function timelineHtml(ctx) {
  const { t, esc, lang, cite } = ctx;
  return `<ol class="ftl">${timeline.map((e) => {
    const src = e.source ? cite(e.source)
      : `<a href="${photos[e.photo].page}" target="_blank" rel="noopener">${t('Ảnh', 'Photo')}: Wikimedia Commons</a>`;
    return `<li class="rv"><span class="ftl-when">${esc(e.when[lang])}</span><b class="ftl-where">${esc(e.where[lang])}</b><p>${esc(e.what[lang])}</p><span class="src">${src}</span></li>`;
  }).join('')}</ol>`;
}

/** News cards linking to the original articles. */
export function articlesHtml(ctx, keys = null) {
  const { t, esc, lang, sourceUrl } = ctx;
  const list = keys ? articles.filter((a) => keys.includes(a.source)) : articles;
  return `<div class="news-grid">${list.map((a) => `<article class="news rv">
  <p class="news-meta"><b>${esc(a.outlet)}</b>${a.date ? ` · ${esc(a.date[lang])}` : ''}</p>
  <h3><a href="${sourceUrl(a.source)}" target="_blank" rel="noopener">${esc(a.title)}</a></h3>
  <p>${esc(a.summary[lang])}</p>
  <a class="news-link" href="${sourceUrl(a.source)}" target="_blank" rel="noopener">${t('Đọc bài gốc', 'Read the article')} →</a>
</article>`).join('')}</div>`;
}
