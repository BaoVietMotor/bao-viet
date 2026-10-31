/**
 * SITE CONFIGURATION: the one file to edit for brand, price and contact changes.
 *
 * Renaming the brand: change `brand.name`, `brand.nameAscii` and `brand.orderPrefix`,
 * replace the logo files in static/img/logo-*.png|webp, then redeploy.
 * Every page, title, structured-data block and email is generated from these values.
 */
export default {
  brand: {
    name: 'Bảo Việt Motor',      // shown everywhere on the site
    nameAscii: 'Bao Viet Motor', // used where diacritics are unsafe (file names, some metadata)
    orderPrefix: 'BV',           // pre-order reference codes look like BV-7K3QX9
    slogan: 'Thành Trì Cho Chiến Mã',
    sloganEn: 'A Fortress for Your Steed',
    // The name "Bảo Việt" (part of this brand) is also used by Tập đoàn Bảo Việt (Bao Viet Holdings), an insurance group.
    // While the brand keeps this name, a short non-affiliation notice is shown in the footer.
    showNonAffiliationNotice: true,
  },

  product: {
    // Price is set in US dollars. The dong figure is a rounded conversion shown next to it.
    priceUSD: 100,
    regularPriceUSD: 200,       // regular price after the first batch; shown crossed out next to the launch price
    priceVND: 2600000,           // ≈ 100 × 26,020 (Vietcombank selling rate, 30/10/2026), rounded
    fx: { rate: 26020, date: '2026-10-30', source: 'vohFx' },
    availability: 'PreOrder',    // schema.org: PreOrder | InStock | OutOfStock
    colourNow: { vi: 'Vàng an toàn', en: 'Safety yellow' },
    // Specifications as supplied by the founder.
    specs: {
      internalLengthMm: 2300,
      internalWidthMm: 1200,
      internalHeightMm: 1450,
      weightKg: 10,              // approximate
      materialGsm: 600,
      zipperM: 3,                // approximate
      anchorPoints: 4,
    },
  },

  // First production batch, launching through partner dealerships.
  // Add dealership names here once the agreements can be made public; the Verify page lists them.
  launch: {
    firstBatchUnits: 100,
    dealers: [],
  },

  founder: {
    name: 'Bao (Simba) Nguyen',
    year: 2025,
  },

  contact: {
    email: 'nguyensimba17@gmail.com',
    phoneE164: '+84933026969',
    phoneDisplay: '0933 026 969',
    zalo: '0933026969',
  },

  legal: {
    privacyVersion: '1.1',
    // Date the current privacy policy and terms take effect (YYYY-MM-DD).
    effectiveDate: '2026-10-12',
  },

  links: {
    // Optional: paste your public GitHub repository address here to show it on the Verify page.
    github: '',
  },

  year: 2026,
};
