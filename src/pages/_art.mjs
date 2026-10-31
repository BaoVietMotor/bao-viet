/** Original SVG illustrations (labelled as diagrams wherever they appear). */

export function simWithout(label, lang = 'vi') {
  return `<svg viewBox="0 0 400 250" role="img" aria-label="${label}">
  <defs><linearGradient id="wA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e7490" stop-opacity=".85"/><stop offset="1" stop-color="#062a3a" stop-opacity=".95"/></linearGradient></defs>
  <rect width="400" height="250" fill="#070b0f"/>
  <path d="M40 34V214H360V34" fill="none" stroke="#2a2e3a" stroke-width="2"/>
  <line x1="40" y1="214" x2="360" y2="214" stroke="#3a3f4d" stroke-width="3"/>
  <g>
    <circle cx="150" cy="190" r="22" fill="none" stroke="#c4c8d4" stroke-width="4"/>
    <circle cx="250" cy="190" r="22" fill="none" stroke="#c4c8d4" stroke-width="4"/>
    <path d="M150 190 182 152h46l22 38" fill="none" stroke="#c4c8d4" stroke-width="4" stroke-linejoin="round"/>
    <path d="M178 152l18-16h40l8 18" fill="#c4c8d4" opacity=".55"/>
    <path d="M182 152l-10-18" stroke="#c4c8d4" stroke-width="4" stroke-linecap="round"/>
    <animateTransform attributeName="transform" type="rotate" values="0 200 194;0 200 194;-13 200 194;-13 200 194" keyTimes="0;.25;.85;1" dur="5s" repeatCount="indefinite" additive="sum"/>
    <animateTransform attributeName="transform" type="translate" values="0 0;0 0;28 -36;28 -36" keyTimes="0;.25;.85;1" dur="5s" repeatCount="indefinite" additive="sum"/>
  </g>
  <rect x="40" width="320" fill="url(#wA)"><animate attributeName="y" values="214;214;112;112" keyTimes="0;.15;.85;1" dur="5s" repeatCount="indefinite"/><animate attributeName="height" values="0;0;102;102" keyTimes="0;.15;.85;1" dur="5s" repeatCount="indefinite"/></rect>
  <rect x="40" width="320" height="2" fill="#7dd3fc"><animate attributeName="y" values="214;214;112;112" keyTimes="0;.15;.85;1" dur="5s" repeatCount="indefinite"/></rect>
  <text x="200" y="240" fill="#ff3b3b" font-size="11" letter-spacing="2" font-family="monospace" text-anchor="middle">${lang === 'vi' ? 'XE BỊ NHẤC LÊN' : 'THE BIKE LIFTS'}</text>
</svg>`;
}

export function simWith(label, lang = 'vi') {
  return `<svg viewBox="0 0 400 250" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="wB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e7490" stop-opacity=".85"/><stop offset="1" stop-color="#062a3a" stop-opacity=".95"/></linearGradient>
    <linearGradient id="bv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe066"/><stop offset="1" stop-color="#ff8a00"/></linearGradient>
  </defs>
  <rect width="400" height="250" fill="#070b0f"/>
  <path d="M40 34V214H360V34" fill="none" stroke="#2a2e3a" stroke-width="2"/>
  <line x1="40" y1="214" x2="360" y2="214" stroke="#3a3f4d" stroke-width="3"/>
  <path d="M112 214Q112 126 200 120q88 6 88 94Z" fill="url(#bv)" stroke="#ffc400" stroke-width="2"/>
  <path d="M126 146q74-34 148 0" fill="none" stroke="#141414" stroke-width="3" stroke-dasharray="6 4"/>
  <path d="M112 214H84M288 214h28" stroke="#fff" stroke-width="2.5"/>
  <circle cx="84" cy="214" r="5" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="316" cy="214" r="5" fill="none" stroke="#fff" stroke-width="2.5"/>
  <circle cx="112" cy="214" r="4" fill="#fff"/><circle cx="288" cy="214" r="4" fill="#fff"/>
  <rect x="40" width="320" fill="url(#wB)" opacity=".6"><animate attributeName="y" values="214;214;112;112" keyTimes="0;.15;.85;1" dur="5s" repeatCount="indefinite"/><animate attributeName="height" values="0;0;102;102" keyTimes="0;.15;.85;1" dur="5s" repeatCount="indefinite"/></rect>
  <rect x="40" width="320" height="2" fill="#7dd3fc"><animate attributeName="y" values="214;214;112;112" keyTimes="0;.15;.85;1" dur="5s" repeatCount="indefinite"/></rect>
  <text x="200" y="240" fill="#ffc400" font-size="11" letter-spacing="2" font-family="monospace" text-anchor="middle">${lang === 'vi' ? 'KÍN VÀ CÓ NEO' : 'SEALED AND TIED DOWN'}</text>
</svg>`;
}

/** Top-down plan: footprint, centre zipper, four corner rings tied to floor points. */
export function anchorPlan(label, lang) {
  const tag = lang === 'vi' ? ['KHÓA KÉO ≈3 M', 'KHOEN NEO', 'ĐIỂM CỐ ĐỊNH'] : ['ZIPPER ≈3 M', 'ANCHOR RING', 'FIXED POINT'];
  return `<svg viewBox="0 0 640 360" role="img" aria-label="${label}" style="background:#0b0f14;border-radius:14px;width:100%">
  <defs><pattern id="gp" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0v24" fill="none" stroke="#ffc400" stroke-opacity=".07"/></pattern></defs>
  <rect width="640" height="360" fill="url(#gp)"/>
  <rect x="150" y="96" width="340" height="168" rx="22" fill="#ffc400" fill-opacity=".16" stroke="#ffc400" stroke-width="2.5"/>
  <line x1="168" y1="180" x2="472" y2="180" stroke="#e11414" stroke-width="3" stroke-dasharray="9 6"><animate attributeName="stroke-dashoffset" from="30" to="0" dur="1.2s" repeatCount="indefinite"/></line>
  <text x="320" y="170" fill="#ff5a5a" font-size="13" font-family="monospace" text-anchor="middle" letter-spacing="1.5">${tag[0]}</text>
  ${[[150, 96, 70, 46], [490, 96, 570, 46], [150, 264, 70, 314], [490, 264, 570, 314]].map(([x, y, ax, ay]) => `
  <line x1="${x}" y1="${y}" x2="${ax}" y2="${ay}" stroke="#d6d9e1" stroke-width="2.5"/>
  <circle cx="${x}" cy="${y}" r="9" fill="#0b0f14" stroke="#fff" stroke-width="3"/>
  <rect x="${ax - 9}" y="${ay - 9}" width="18" height="18" fill="#2a2e3a" stroke="#9aa0ad" stroke-width="2"/>`).join('')}
  <text x="150" y="82" fill="#fff" font-size="12" font-family="monospace" text-anchor="middle">${tag[1]}</text>
  <text x="70" y="30" fill="#9aa0ad" font-size="12" font-family="monospace" text-anchor="middle">${tag[2]}</text>
  <text x="320" y="300" fill="#ffc400" font-size="13" font-family="monospace" text-anchor="middle" letter-spacing="1.5">2300 × 1200 MM</text>
</svg>`;
}

/** Side elevation used as step 4 artwork. */
export function anchorSide(label) {
  return `<svg class="step-art" viewBox="0 0 400 300" role="img" aria-label="${label}">
  <rect width="400" height="300" fill="#0b0f14"/>
  <line x1="20" y1="236" x2="380" y2="236" stroke="#3a3f4d" stroke-width="3"/>
  <path d="M96 236Q96 120 200 112q104 8 104 124Z" fill="#ffc400" fill-opacity=".9" stroke="#ffd84d" stroke-width="2"/>
  <path d="M112 146q88-40 176 0" fill="none" stroke="#141414" stroke-width="3" stroke-dasharray="7 5"/>
  <path d="M96 236 40 236M304 236l56 0" stroke="#fff" stroke-width="3"/>
  <circle cx="96" cy="236" r="7" fill="#0b0f14" stroke="#fff" stroke-width="3"/><circle cx="304" cy="236" r="7" fill="#0b0f14" stroke="#fff" stroke-width="3"/>
  <rect x="28" y="228" width="16" height="16" fill="#2a2e3a" stroke="#9aa0ad" stroke-width="2"/><rect x="356" y="228" width="16" height="16" fill="#2a2e3a" stroke="#9aa0ad" stroke-width="2"/>
  <path d="M96 236v0" stroke="#fff"/>
  <g fill="#ffc400"><circle cx="96" cy="236" r="3"><animate attributeName="r" values="3;12;3" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/></circle>
  <circle cx="304" cy="236" r="3"><animate attributeName="r" values="3;12;3" dur="2s" begin="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="2s" begin="1s" repeatCount="indefinite"/></circle></g>
</svg>`;
}

/** Dimension drawing (side + plan). */
export function dimensions(label, lang) {
  const t = lang === 'vi' ? { side: 'MẶT BÊN', plan: 'MẶT BẰNG', zip: 'KHÓA KÉO ≈3000 MM', ring: 'KHOEN' } : { side: 'SIDE', plan: 'PLAN', zip: 'ZIPPER ≈3000 MM', ring: 'RING' };
  return `<svg viewBox="0 0 520 430" role="img" aria-label="${label}" style="width:100%;background:#0b0f14;border-radius:14px">
  <defs>
    <marker id="ae" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0l9 4.5L0 9z" fill="#ffc400"/></marker>
    <marker id="as" markerWidth="9" markerHeight="9" refX="1" refY="4.5" orient="auto"><path d="M9 0 0 4.5 9 9z" fill="#ffc400"/></marker>
    <pattern id="g2" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0v26" fill="none" stroke="#ffc400" stroke-opacity=".07"/></pattern>
  </defs>
  <rect width="520" height="430" fill="url(#g2)"/>
  <text x="30" y="34" fill="#7d8291" font-size="11" letter-spacing="2.5" font-family="monospace">${t.side}</text>
  <path d="M60 210Q60 90 175 78t225 18q40 12 40 114Z" fill="#ffc400" fill-opacity=".14" stroke="#ffc400" stroke-width="2"/>
  <line x1="60" y1="210" x2="440" y2="210" stroke="#ffc400" stroke-width="2"/>
  <path d="M78 122q152-56 346 8" fill="none" stroke="#e11414" stroke-width="2.5" stroke-dasharray="7 5"/>
  <text x="186" y="60" fill="#ff5a5a" font-size="11" font-family="monospace" letter-spacing="1.2">${t.zip}</text>
  <circle cx="60" cy="210" r="7" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="440" cy="210" r="7" fill="none" stroke="#fff" stroke-width="2.5"/>
  <line x1="60" y1="262" x2="440" y2="262" stroke="#ffc400" stroke-width="1.4" marker-start="url(#as)" marker-end="url(#ae)"/>
  <text x="250" y="282" fill="#ffc400" font-size="14" font-weight="700" font-family="monospace" text-anchor="middle">2300 mm</text>
  <line x1="482" y1="78" x2="482" y2="210" stroke="#ffc400" stroke-width="1.4" marker-start="url(#as)" marker-end="url(#ae)"/>
  <text x="470" y="150" fill="#ffc400" font-size="14" font-weight="700" font-family="monospace" text-anchor="middle" transform="rotate(-90 470 150)">1450 mm</text>
  <text x="30" y="330" fill="#7d8291" font-size="11" letter-spacing="2.5" font-family="monospace">${t.plan}</text>
  <rect x="60" y="344" width="380" height="62" rx="8" fill="#ffc400" fill-opacity=".1" stroke="#ffc400" stroke-width="2"/>
  <line x1="74" y1="375" x2="426" y2="375" stroke="#e11414" stroke-width="2" stroke-dasharray="7 5"/>
  ${[[60, 344], [440, 344], [60, 406], [440, 406]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#0b0f14" stroke="#fff" stroke-width="2.5"/>`).join('')}
  <line x1="482" y1="344" x2="482" y2="406" stroke="#ffc400" stroke-width="1.4" marker-start="url(#as)" marker-end="url(#ae)"/>
  <text x="470" y="376" fill="#ffc400" font-size="13" font-weight="700" font-family="monospace" text-anchor="middle" transform="rotate(-90 470 376)">1200</text>
</svg>`;
}
