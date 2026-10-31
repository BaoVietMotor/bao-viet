# Bảo Việt Motor

This is the code for the Bảo Việt Motor website and its pre-order system. Bảo Việt Motor is my flood enclosure for motorcycles: a sealed PVC bag you wheel the bike into, zip shut along the top, and tie down to the floor at four corners.

Live site: add the link here once it's online (DEPLOY.md shows how).

Bao (Simba) Nguyen

## The product

The enclosure is polyester with a 600 GSM PVC coating. Inside it measures 2300 × 1200 × 1450 mm, and the whole thing weighs about 10 kg. One waterproof zipper, about 3 m long, closes it along the top. There is a reinforced ring at each bottom corner, so you can tie it to something fixed and it won't float off when the water comes up. The colour in production is safety yellow. A camo version is planned, and so far it only exists as a 3D render.

## What I did

I designed the enclosure, found a factory to make it, ordered the samples and sorted out shipping them to me. Then I fully submerged a Yamaha R15 inside a sample to see if water got in. It didn't, in that test. That was my own test and not a lab certification, and the site says so every time it mentions it.

## How the website was made

I built this site with help from an AI coding assistant (Claude, by Anthropic). The product, the photos, the decisions and the facts I wanted checked came from me; the assistant wrote most of the code and helped me check every number against its source. I'm saying this here so nobody has to guess.

The picture at the top of the home page is an AI-generated illustration (Google Gemini), labelled on the page. It is not a photo of a real flood; the real product is in the photos further down.

## What's in it

The site is in English at `/` and Vietnamese at `/vi/`; old addresses redirect to the new ones. It has a home page, a product page with a fit check, a page on floods and motorbikes, the story page, a verify page that lists every source, an FAQ, pre-order and contact forms, a privacy policy, terms, and a 404 page.

Every statistic from outside comes with a link to the article it came from. The news clips are YouTube videos that only load when you press play. The flood photos come from Wikimedia Commons under CC BY or CC BY-SA licences and are shown uncropped with the photographer and licence named.

Pre-orders go into a small database with a reference code like `BV-7K3QX9`. Nobody pays anything online; I confirm each order by phone or Zalo. The launch price is $100 (about ₫2,600,000), 50% off the $200 regular price, and the first batch is 100 units launching at partner dealerships. There's a password-protected `/admin` page where I can search orders, change their status, add notes and export everything to a spreadsheet.

There's also the usual behind-the-scenes stuff: a consent checkbox under Vietnam's Personal Data Protection Law (91/2025/QH15), spam protection, rate limits, security headers, a sitemap, and the structured data search engines read.

## How it works

```
Browser -> Cloudflare Worker (src/worker/index.js)
             /api/*   -> api.js -> D1 database (pre-orders, messages)
             /admin   -> admin page + password-protected API
             the rest -> pages built into ./public
           Images, CSS and JS come straight from Cloudflare's cache.
```

`build.mjs` writes every page in both languages into `./public`. It has no dependencies.
`site.config.mjs` holds the brand name, price, specs and contact details.
`src/data/facts.mjs` holds every outside statistic with its source link.
`src/pages/` has the page templates and `src/worker/` has the backend.
`static/` has the CSS, JavaScript, images, film and the admin page.
`test/` has the automated tests.

## Running it on a computer

You need Node.js 22 or newer.

```bash
npm test          # builds the site and runs the tests
npm install       # installs Wrangler, Cloudflare's tool
npx wrangler dev  # runs the whole site and a local database at http://localhost:8787
```

The tests check things like: every page exists in both languages, every link and image works, each statistic still matches its source and keeps its link, the founder test is always labelled as one, there are no invented certifications or reviews, the forms need consent, and the API handles bad input, duplicates, rate limits and admin logins.

## Changing the price or contact details

Edit `site.config.mjs` on GitHub and save. Cloudflare rebuilds the site by itself in a minute or two.

## About the name

Tập đoàn Bảo Việt (Bao Viet Holdings) is a big insurance group in Vietnam. Bảo Việt Motor has nothing to do with it, and the site says that in the footer, the FAQ and the terms.

© 2026 Bao (Simba) Nguyen
