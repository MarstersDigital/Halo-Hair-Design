import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

// Navigation definition for all 5 pages
const navItems = [
  { name: 'Home', href: 'index.html', id: 'home' },
  { name: 'Services & Pricing', href: 'services.html', id: 'services' },
  { name: 'About the Salon', href: 'about.html', id: 'about' },
  { name: 'Our Work', href: 'gallery.html', id: 'gallery' },
  { name: 'Find Us & Booking', href: 'contact.html', id: 'contact' }
];

// Local Business Schema JSON-LD
const schemaJson = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "Halo Hair Design",
  "image": "https://www.halohairdesignotley.co.uk/images/storefront.jpg",
  "@id": "https://www.halohairdesignotley.co.uk",
  "url": "https://www.halohairdesignotley.co.uk",
  "telephone": "+441943850008",
  "priceRange": "££",
  "currenciesAccepted": "GBP",
  "paymentAccepted": "Cash, Credit Card, Debit Card",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "59 Kirkgate",
    "addressLocality": "Otley",
    "addressRegion": "West Yorkshire",
    "postalCode": "LS21 3HN",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 53.9056,
    "longitude": -1.6942
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Tuesday"], "opens": "09:30", "closes": "17:30" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Wednesday", "Thursday"], "opens": "09:00", "closes": "20:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Friday"], "opens": "09:00", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "09:00", "closes": "16:00" }
  ]
};

function renderHead(title, description, canonical) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title} | Halo Hair Design Otley</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://www.halohairdesignotley.co.uk/${canonical}">
  
  <meta property="og:type" content="business.business">
  <meta property="og:title" content="${title} | Halo Hair Design Otley">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://www.halohairdesignotley.co.uk/${canonical}">
  <meta property="og:image" content="https://www.halohairdesignotley.co.uk/images/storefront.jpg">
  
  <link rel="icon" type="image/png" href="images/logo.png">
  <link rel="stylesheet" href="css/style.css">
  
  <script type="application/ld+json">
${JSON.stringify(schemaJson, null, 2)}
  </script>
</head>
<body>`;
}

function renderHeader(activeId) {
  return `
  <!-- Primary Site Header -->
  <header class="site-header">
    <div class="container-custom" style="display: flex; align-items: center; justify-content: space-between; height: 4.75rem;">
      <!-- Brand Logo (Supplied by Client) -->
      <a href="index.html" style="display: flex; align-items: center; text-decoration: none;" aria-label="Halo Hair Design Home">
        <img src="images/logo.png" alt="Halo Hair Design Logo" style="height: 3.1rem; width: auto;" width="180" height="51">
      </a>

      <!-- Desktop Navigation -->
      <nav style="display: none;" class="desktop-nav" aria-label="Main Navigation">
        <ul style="display: flex; align-items: center; gap: 0.35rem; list-style: none; margin: 0; padding: 0;">
          ${navItems.filter(item => item.id !== 'contact').map(item => `
            <li>
              <a href="${item.href}" class="nav-link ${activeId === item.id ? 'active' : ''}">${item.name}</a>
            </li>
          `).join('')}
        </ul>
      </nav>

      <!-- Desktop Navigation CTA Trigger -->
      <div style="display: none;" class="desktop-cta">
        <a href="contact.html" class="btn-primary" style="padding: 0.65rem 1.35rem; font-size: 0.85rem;">
          Find Us &amp; Booking
        </a>
      </div>

      <!-- Mobile Hamburger Button -->
      <button type="button" id="mobileNavToggle" aria-label="Open menu" style="display: flex; background: none; border: none; cursor: pointer; padding: 0.5rem; color: var(--color-text-primary);" class="mobile-toggle-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <div id="mobileNavDrawer" class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
    <div class="mobile-drawer-panel">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <img src="images/logo.png" alt="Halo Hair Design" style="height: 2.6rem; width: auto;">
        <button type="button" id="mobileNavClose" aria-label="Close menu" style="background: none; border: none; cursor: pointer; padding: 0.5rem;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <nav style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 2rem;">
        ${navItems.map(item => `
          <a href="${item.href}" style="font-size: 1.1rem; font-weight: 600; padding: 0.65rem 0.5rem; border-bottom: 1px solid var(--color-border); color: ${activeId === item.id ? 'var(--color-accent)' : 'var(--color-text-primary)'};">${item.name}</a>
        `).join('')}
      </nav>

      <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.75rem;">
        <a href="contact.html" class="btn-primary" style="width: 100%; text-align: center;">
          Find Us &amp; Booking &rarr;
        </a>
        <p style="font-size: 0.75rem; text-align: center; color: var(--color-text-secondary); margin-top: 0.5rem;">59 Kirkgate, Otley, LS21 3HN</p>
      </div>
    </div>
  </div>

  <style>
    @media (min-width: 880px) {
      .desktop-nav { display: block !important; }
      .desktop-cta { display: block !important; }
      .mobile-toggle-btn { display: none !important; }
    }
  </style>`;
}

function renderMarqueeBanner() {
  const cuts = [
    { file: 'images/headshot-1.jpg', tag: 'Balayage', title: 'Sun-Kissed Waves' },
    { file: 'images/headshot-2.jpg', tag: 'Colour & Cut', title: 'Warm Honey Layers' },
    { file: 'images/headshot-3.jpg', tag: 'Highlights', title: 'Golden Highlights' },
    { file: 'images/headshot-4.jpg', tag: 'Brunette', title: 'Mocha Gloss Curls' },
    { file: 'images/headshot-5.jpg', tag: 'Bridal Updo', title: 'Braided Occasion Hair' },
    { file: 'images/headshot-6.jpg', tag: 'Colour Melt', title: 'Ash Blonde Balayage' },
    { file: 'images/headshot-7.jpg', tag: 'Blow Dry', title: 'Glass Hair Precision Cut' },
    { file: 'images/headshot-8.jpg', tag: 'Restyle', title: 'Face-Framing Curtain Bangs' }
  ];

  const cardsHtml = cuts.map(c => `
    <div class="marquee-card">
      <picture>
        <source srcset="${c.file.replace('.jpg', '.webp')}" type="image/webp">
        <img src="${c.file}" alt="${c.title} by Halo Hair Design Otley" width="210" height="210" loading="lazy">
      </picture>
      <div class="marquee-card-label">
        <span class="marquee-card-tag">${c.tag}</span>
        <div class="marquee-card-title">${c.title}</div>
      </div>
    </div>
  `).join('\n');

  const clonedHtml = cuts.map(c => `
    <div class="marquee-card" aria-hidden="true">
      <picture>
        <source srcset="${c.file.replace('.jpg', '.webp')}" type="image/webp">
        <img src="${c.file}" alt="" width="210" height="210" loading="lazy">
      </picture>
      <div class="marquee-card-label">
        <span class="marquee-card-tag">${c.tag}</span>
        <div class="marquee-card-title">${c.title}</div>
      </div>
    </div>
  `).join('\n');

  return `
  <!-- Moving Marquee Banner (Continuous Right to Left, Crisp 210px Retina Cards) -->
  <section class="marquee-section" aria-label="Showcase Gallery Banner">
    <div class="container-custom" style="margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: baseline;">
      <div>
        <span class="badge-hero">Portfolio Spotlight</span>
        <h2 style="font-size: clamp(1.6rem, 3vw, 2.25rem); margin-top: 0.35rem; color: #1E142B;">Recent Styling &amp; Colour Work</h2>
      </div>
      <a href="gallery.html" style="font-size: 0.85rem; font-weight: 700; color: var(--color-accent); text-decoration: none;">View full gallery &rarr;</a>
    </div>

    <div class="marquee-track" role="region" aria-label="Continuous Haircut Gallery">
      ${cardsHtml}
      ${clonedHtml}
    </div>
  </section>`;
}

function renderFooter() {
  return `
  <!-- Site Footer -->
  <footer style="background-color: #160E22; color: #D6D2CA; margin-top: auto; padding-top: 4rem; padding-bottom: 2rem; border-top: 1px solid #291C3D;">
    <div class="container-custom">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; margin-bottom: 3rem;">
        <!-- Col 1 -->
        <div>
          <a href="index.html" style="display: inline-block; background-color: #FFFFFF; padding: 0.5rem 0.85rem; border-radius: 0.75rem; margin-bottom: 1.25rem; text-decoration: none;" aria-label="Halo Hair Design Home">
            <img src="images/logo.png" alt="Halo Hair Design" style="height: 2.5rem; width: auto; display: block;" width="160" height="46">
          </a>
          <p style="font-size: 0.875rem; line-height: 1.6; color: #9C9890; margin-bottom: 1rem;">
            Boutique hairdressing salon based at 59 Kirkgate in Otley, West Yorkshire. Incorporating EKM Beauty for luxury BIAB nails and brow styling.
          </p>
          <div style="font-size: 0.8rem; color: #CBB8E3; font-weight: 600;">
            Great Lengths Certified • K18 Stockist
          </div>
        </div>

        <!-- Col 2 -->
        <div>
          <h3 style="font-family: var(--font-sans); font-size: 0.85rem; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.25rem;">Site Pages</h3>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem;">
            ${navItems.map(item => `
              <li><a href="${item.href}" style="color: #AEA9A0; text-decoration: none;">${item.name}</a></li>
            `).join('')}
          </ul>
        </div>

        <!-- Col 3 -->
        <div>
          <h3 style="font-family: var(--font-sans); font-size: 0.85rem; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.25rem;">Opening Schedule</h3>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.45rem; font-size: 0.85rem; color: #AEA9A0;">
            <li style="display: flex; justify-content: space-between;"><span>Tuesday:</span> <span style="color: #fff;">09:30 – 17:30</span></li>
            <li style="display: flex; justify-content: space-between;"><span>Wed &amp; Thu:</span> <span style="color: #CBB8E3; font-weight: 600;">09:00 – Late</span></li>
            <li style="display: flex; justify-content: space-between;"><span>Friday:</span> <span style="color: #fff;">09:00 – 18:00</span></li>
            <li style="display: flex; justify-content: space-between;"><span>Saturday:</span> <span style="color: #fff;">09:00 – 16:00</span></li>
            <li style="display: flex; justify-content: space-between;"><span>Mon &amp; Sun:</span> <span style="opacity: 0.5;">Closed</span></li>
          </ul>
        </div>

        <!-- Col 4 -->
        <div>
          <h3 style="font-family: var(--font-sans); font-size: 0.85rem; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.25rem;">Otley Salon</h3>
          <p style="font-size: 0.875rem; line-height: 1.6; color: #AEA9A0; margin-bottom: 1rem;">
            <strong>59 Kirkgate</strong><br>
            Otley, West Yorkshire, LS21 3HN
          </p>
          <a href="tel:+441943850008" style="color: #CBB8E3; font-weight: 700; font-size: 1.05rem; text-decoration: none; display: block; margin-bottom: 0.35rem;">
            📞 01943 850008
          </a>
          <span style="font-size: 0.78rem; color: #848078;">Walk-ins &amp; appointments welcome</span>
        </div>
      </div>

      <div style="border-top: 1px solid #291C3D; padding-top: 1.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; font-size: 0.8rem; color: #7F7B74;">
        <p>&copy; ${new Date().getFullYear()} Halo Hair Design. All rights reserved.</p>
        <p>Serving Otley, Ilkley, Menston, Guiseley, Burley-in-Wharfedale &amp; Wharfedale.</p>
      </div>
    </div>
  </footer>

  <!-- Mobile Fixed Bottom Action Bar (< 768px) -->
  <nav class="mobile-bottom-bar" aria-label="Mobile quick contact">
    <a href="contact.html" class="mobile-book-btn" aria-label="Find Us and Booking">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      <span>Find Us &amp; Booking</span>
    </a>
  </nav>

  <script src="js/main.js"></script>
</body>
</html>`;
}

// =============================================================================
// PAGE 1: index.html (Home)
// =============================================================================
function generateIndexHtml() {
  const head = renderHead(
    'Boutique Hair Salon in Otley | Cuts, Colour & EKM Beauty',
    'Halo Hair Design is a boutique hairdressing salon at 59 Kirkgate in Otley, West Yorkshire. Master colourists, precision cuts, Great Lengths extensions, and in-salon EKM Beauty suite.',
    'index.html'
  );
  const header = renderHeader('home');
  const marquee = renderMarqueeBanner();
  const footer = renderFooter();

  const content = `
  <main>
    <!-- Editorial Brand Intro (No full-bleed background; generous whitespace & warm typography) -->
    <!-- Hero Section in Official Halo Ring Lilac (#D1C4E2) -->
    <section class="hero-section">
      <div class="container-custom">
        <div style="display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center;" class="intro-grid">
          <div>
            <h1 style="font-size: clamp(2.4rem, 4.8vw, 3.8rem); line-height: 1.1; margin-bottom: 1.5rem; font-weight: 700;">
              Thoughtful Hairdressing &amp; Relaxed Boutique Style.
            </h1>

            <p class="hero-desc">
              Located on historic Kirkgate in Otley, Halo Hair Design offers an intimate, friendly salon experience dedicated to bespoke hair colour, precision styling, Great Lengths certified extensions, and Ellie's in-salon EKM Beauty suite.
            </p>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.25rem;">
              <a href="services.html" class="btn-primary">
                Explore Services &amp; Prices &rarr;
              </a>
              <a href="contact.html" class="btn-secondary">
                Find Us &amp; Opening Hours
              </a>
            </div>

            <!-- Trust Points -->
            <div class="hero-trust">
              <span>✓ Certified Great Lengths Extensionists</span>
              <span>✓ Patented K18 &amp; Olaplex Hair Repair</span>
              <span>✓ Late Night Wednesday &amp; Thursday</span>
            </div>
          </div>

          <!-- Visual Showcase Cluster (Storefront, Team Selfie & Matrix Haircare) -->
          <div class="hero-visual-cluster">
            <!-- Main Storefront Card (No text underneath) -->
            <div class="hero-card hero-card-main">
              <picture>
                <source srcset="images/hero-storefront.webp" type="image/webp">
                <img src="images/hero-storefront.jpg" alt="Halo Hair Design boutique salon exterior at 59 Kirkgate, Otley" width="800" height="600" loading="eager">
              </picture>
              <span class="hero-card-chip">📍 59 Kirkgate</span>
            </div>

            <!-- Two Companion Cards: Team & Products -->
            <div class="hero-cards-row">
              <!-- Team Card -->
              <div class="hero-card hero-card-sub">
                <picture>
                  <source srcset="images/hero-team.webp" type="image/webp">
                  <img src="images/hero-team.jpg" alt="The welcoming styling team at Halo Hair Design" width="600" height="450" loading="eager">
                </picture>
                <span class="hero-card-chip">👋 Our Friendly Team</span>
              </div>

              <!-- Matrix Products Card -->
              <div class="hero-card hero-card-sub">
                <picture>
                  <source srcset="images/hero-products.webp" type="image/webp">
                  <img src="images/hero-products.jpg" alt="Matrix Total Results and luxury salon haircare at Halo Hair Design" width="600" height="450" loading="eager">
                </picture>
                <span class="hero-card-chip">✨ Matrix &amp; K18 Care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Highlights & Salon Pillars -->
    <section style="padding: 4rem 0; background-color: #FFFFFF; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
      <div class="container-custom">
        <div style="text-align: center; max-width: 650px; margin: 0 auto 3rem;">
          <span class="badge-purple">Our Approach</span>
          <h2 style="font-size: clamp(1.85rem, 3.2vw, 2.5rem); margin-top: 0.4rem; margin-bottom: 0.75rem;">Craftsmanship at Every Styling Chair</h2>
          <p style="color: var(--color-text-secondary); font-size: 0.95rem;">Every appointment begins with a personal consultation to match your hair type, maintenance routine, and lifestyle.</p>
        </div>

        <div class="pillars-grid">
          <!-- Pillar 1: Cutting -->
          <div class="pillar-card">
            <div class="pillar-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3>Precision Cutting &amp; Restyling</h3>
            <p>
              From tailored maintenance trims and bouncy blow waves to complete transformation restyles and gents scissor work.
            </p>
          </div>

          <!-- Pillar 2: Colour -->
          <div class="pillar-card">
            <div class="pillar-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 2 6.8 5 8.5.5.3 1.1-.1 1.1-.7v-1.1c0-1.1.9-2 2-2h1.4c2.5 0 4.5-2 4.5-4.5 0-.6.5-1.2 1.2-1.2h.8c2.2 0 4-1.8 4-4 0-4-4.5-7-10-7z"></path>
                <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"></circle>
                <circle cx="12" cy="7.5" r="1.5" fill="currentColor"></circle>
                <circle cx="16.5" cy="10.5" r="1.5" fill="currentColor"></circle>
              </svg>
            </div>
            <h3>Dimensional Colour &amp; Balayage</h3>
            <p>
              Full and half-head highlights, sun-kissed face-framing money pieces, custom gloss toners, and bespoke balayage.
            </p>
          </div>

          <!-- Pillar 3: Extensions -->
          <div class="pillar-card">
            <div class="pillar-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.9 6.1L4 11l6.1 1.9L12 19l1.9-6.1L20 11l-6.1-1.9L12 3z"></path>
                <path d="M19 3v4"></path>
                <path d="M21 5h-4"></path>
              </svg>
            </div>
            <h3>Great Lengths Extensions</h3>
            <p>
              Certified ethical 100% human hair extensions applied with precision bonds to deliver natural volume, thickness, and length.
            </p>
          </div>

          <!-- Pillar 4: EKM Beauty -->
          <div class="pillar-card">
            <div class="pillar-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 2h6v5H9z"></path>
                <path d="M6 7h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"></path>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="12" y1="7" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3>EKM Beauty Suite Inside</h3>
            <p>
              Enjoy the convenience of multi-treatment visits with Ellie’s BIAB builder gel nails, lash lifts, and brow lamination in-salon.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Moving Marquee Banner (Continuous Right to Left) -->
    ${marquee}

    <!-- Location Snapshot & Call to Action -->
    <section style="padding: 4.5rem 0; background-color: var(--color-canvas);">
      <div class="container-custom">
        <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 1.5rem; padding: 2.5rem; box-shadow: var(--shadow-subtle);">
          <div style="display: grid; grid-template-columns: 1fr; gap: 2.5rem; align-items: center;" class="location-snapshot-grid">
            <div>
              <span class="badge-purple">Visit Halo in Otley</span>
              <h2 style="font-size: clamp(1.85rem, 3.2vw, 2.5rem); margin-top: 0.5rem; margin-bottom: 1rem;">
                Convenient High Street Appointments
              </h2>
              <p style="color: var(--color-text-secondary); font-size: 0.95rem; line-height: 1.65; margin-bottom: 1.5rem;">
                We are situated in central Otley at 59 Kirkgate, surrounded by independent boutiques and coffee shops. Walk-in appointments are welcome, or telephone ahead to secure your preferred stylist and time.
              </p>
              
              <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; margin-bottom: 1.75rem;">
                <div>📍 <strong>Address:</strong> 59 Kirkgate, Otley, West Yorkshire, LS21 3HN</div>
                <div>📞 <strong>Telephone:</strong> <a href="tel:+441943850008" style="color: var(--color-accent); font-weight: 700;">01943 850008</a></div>
                <div>🚗 <strong>Parking:</strong> On-street bays on Kirkgate, plus Orchard Gate car park nearby</div>
              </div>

              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <a href="contact.html" class="btn-primary">
                  Find Us &amp; Booking &rarr;
                </a>
              </div>
            </div>

            <div style="display: flex; justify-content: center;">
              <!-- Compact Framed Vignette (STRICTLY CONSTRAINED to max 340px wide) -->
              <div class="photo-vignette-portrait">
                <picture>
                  <source srcset="images/interior.webp" type="image/webp">
                  <img src="images/interior.jpg" alt="Interior styling stations at Halo Hair Design" width="340" height="453" loading="lazy">
                </picture>
                <div style="padding: 0.75rem 0.5rem 0.25rem; text-align: center;">
                  <div style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 600;">Calm Boutique Interior</div>
                  <div style="font-size: 0.78rem; color: var(--color-text-secondary);">Styling stations &amp; backwash basin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <style>
    @media (min-width: 820px) {
      .intro-grid { grid-template-columns: 1.08fr 0.92fr !important; }
      .location-snapshot-grid { grid-template-columns: 1.15fr 0.85fr !important; }
    }
  </style>`;

  return head + header + content + footer;
}

// =============================================================================
// PAGE 2: services.html (Services & Pricing)
// =============================================================================
function generateServicesHtml() {
  const head = renderHead(
    'Services & Pricing | Complete Price Menu',
    'Transcribed semantic price list for Halo Hair Design in Otley. Blow waves, cut & blow dry, highlights, balayage, permanent tints, K18 treatments, and EKM Beauty.',
    'services.html'
  );
  const header = renderHeader('services');
  const footer = renderFooter();

  const content = `
  <main class="page-lilac-bg" style="padding: 4.5rem 0 5rem;">
    <div class="container-custom">
      <!-- Page Header -->
      <div style="text-align: center; max-width: 700px; margin: 0 auto 3rem;">
        <span class="badge-hero">Salon Menu</span>
        <h1 style="font-size: clamp(2.3rem, 4.2vw, 3.5rem); margin-top: 0.4rem; margin-bottom: 0.75rem; color: #1E142B;">
          Services &amp; Pricing
        </h1>
        <p style="color: #382D46; font-size: 1rem; line-height: 1.6;">
          Transcribed directly from our high-street salon board at 59 Kirkgate. Every service is priced transparently in £ with full consultations included.
        </p>
      </div>

      <!-- Essential Treatment Policies -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 3.5rem;">
        <div class="policy-card">
          <strong style="color: var(--color-accent-hover); font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">
            🧪 48-Hour Allergy Patch Test Notice
          </strong>
          <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.55;">
            Patch test with colours are required 48 hours before appointment! All new colour, highlights, and lash/brow clients must visit our Kirkgate salon for a quick skin test.
          </p>
        </div>

        <div class="policy-card" style="border-left-color: var(--color-text-secondary); background: #FAF9F6;">
          <strong style="color: var(--color-text-primary); font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">
            ⏱ 24-Hour Cancellation Policy
          </strong>
          <p style="font-size: 0.85rem; color: var(--color-text-secondary); line-height: 1.55;">
            If you need to reschedule or cancel, please provide at least 24 hours notice by calling 01943 850008 so we can offer the appointment to another client.
          </p>
        </div>
      </div>

      <!-- Semantic HTML Price List Groups -->
      <div style="max-width: 860px; margin: 0 auto;">
        <!-- Group 1: Cutting & Styling -->
        <section class="price-menu-group" aria-labelledby="catCutting">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <h2 id="catCutting" style="font-size: 1.85rem; margin: 0;">Cutting &amp; Styling</h2>
            <span class="badge-lilac">Wash &amp; Blow Waves</span>
          </div>

          <div>
            <div class="price-item-row">
              <div>
                <div class="price-item-name">Blow waves (short)</div>
                <div class="price-item-desc">Cleanse and blow wave styling tailored for shorter hair</div>
              </div>
              <div class="price-item-val">£24.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Blow waves</div>
                <div class="price-item-desc">Luxury wash, scalp massage, and classic bouncy or sleek blow wave finish</div>
              </div>
              <div class="price-item-val">£27.00</div>
            </div>

            <div class="price-item-row" style="background-color: #F6F1FA; padding: 0.85rem; border-radius: 0.5rem; border-bottom: none; margin: 0.4rem 0;">
              <div>
                <div class="price-item-name" style="color: var(--color-accent-hover);">Cut &amp; Blow Wave</div>
                <div class="price-item-desc">Our signature service — consultation, wash, precision haircut, and bespoke blow wave</div>
              </div>
              <div class="price-item-val" style="font-size: 1.3rem;">£45.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Dry cut</div>
                <div class="price-item-desc">Quick trim and precision shape on clean, dry hair</div>
              </div>
              <div class="price-item-val">£26.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Wet cut</div>
                <div class="price-item-desc">Wash and precision wet haircut without blow dry finish</div>
              </div>
              <div class="price-item-val">£29.50</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Restyle</div>
                <div class="price-item-desc">Complete shape and style transformation with dedicated consultation and luxury blow dry</div>
              </div>
              <div class="price-item-val">£55.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Curling</div>
                <div class="price-item-desc">Thermal wave or loose barrel curls using professional styling irons</div>
              </div>
              <div class="price-item-val">from £16.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Pin curls</div>
                <div class="price-item-desc">Classic set pin curls for maximum volume and long-lasting bounce</div>
              </div>
              <div class="price-item-val">from £25.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Hair Up</div>
                <div class="price-item-desc">Occasion updos, elegant chignons, romantic braids, and party styles</div>
              </div>
              <div class="price-item-val">from £37.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Gents Cut</div>
                <div class="price-item-desc">Precision scissor over comb, clipper work, and tailored styling</div>
              </div>
              <div class="price-item-val">from £25.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Extra thick hair</div>
                <div class="price-item-desc">Additional styling time and product allocation for extra long or dense hair</div>
              </div>
              <div class="price-item-val">£5.00</div>
            </div>
          </div>
        </section>

        <!-- Group 2: Colouring Services -->
        <section class="price-menu-group" aria-labelledby="catColour">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <h2 id="catColour" style="font-size: 1.85rem; margin: 0;">Colouring Services</h2>
            <span class="badge-purple">Patch Test Required (48h)</span>
          </div>

          <div>
            <div class="price-item-row">
              <div>
                <div class="price-item-name">Parting Highlights</div>
                <div class="price-item-desc">Foil placement along the parting for a quick, bright dimension lift</div>
              </div>
              <div class="price-item-val">£39.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Half Head Highlights</div>
                <div class="price-item-desc">Dimensional foils through crown, top sections, and face-framing sides</div>
              </div>
              <div class="price-item-val">£55.00</div>
            </div>

            <div class="price-item-row" style="background-color: #F6F1FA; padding: 0.85rem; border-radius: 0.5rem; border-bottom: none; margin: 0.4rem 0;">
              <div>
                <div class="price-item-name" style="color: var(--color-accent-hover);">Full Head Highlights</div>
                <div class="price-item-desc">Complete foil application throughout for comprehensive blonde or multi-tonal lift</div>
              </div>
              <div class="price-item-val" style="font-size: 1.3rem;">£65.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Full Head Colour</div>
                <div class="price-item-desc">Permanent all-over rich colour with 100% grey coverage and mirror shine</div>
              </div>
              <div class="price-item-val">£58.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Full Head Colour Semi</div>
                <div class="price-item-desc">Gentle semi-permanent gloss tone to enrich natural depth and condition</div>
              </div>
              <div class="price-item-val">£48.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Regrowth</div>
                <div class="price-item-desc">Root touch-up to match existing colour and camouflage natural growth</div>
              </div>
              <div class="price-item-val">£45.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Toner</div>
                <div class="price-item-desc">Neutralise unwanted brassy warmth or infuse delicate pastel/ash glazes</div>
              </div>
              <div class="price-item-val">from £21.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Additional add on colour</div>
                <div class="price-item-desc">Extra colour bowl, lowlights, or creative accent hues added to service</div>
              </div>
              <div class="price-item-val">from £19.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Money Piece</div>
                <div class="price-item-desc">High-contrast bright face-framing foils to illuminate eyes and cheekbones</div>
              </div>
              <div class="price-item-val">from £18.00</div>
            </div>
          </div>
        </section>

        <!-- Group 3: Treatments & Bond Repair -->
        <section class="price-menu-group" aria-labelledby="catTreatments">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <h2 id="catTreatments" style="font-size: 1.85rem; margin: 0;">Treatments &amp; Bond Repair</h2>
            <span class="badge-lilac">K18 &amp; Olaplex</span>
          </div>

          <div>
            <div class="price-item-row">
              <div>
                <div class="price-item-name">Olaplex Treatment</div>
                <div class="price-item-desc">Stand-alone bond multiplying treatment rebuilding broken disulfide bonds</div>
              </div>
              <div class="price-item-val">from £25.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Olaplex added into colour</div>
                <div class="price-item-desc">In-bowl bond protection shielding hair during chemical lightening or tinting</div>
              </div>
              <div class="price-item-val">from £15.00</div>
            </div>

            <div class="price-item-row" style="background-color: #F6F1FA; padding: 0.85rem; border-radius: 0.5rem; border-bottom: none; margin: 0.4rem 0;">
              <div>
                <div class="price-item-name" style="color: var(--color-accent-hover);">K18 Treatment</div>
                <div class="price-item-desc">Patented molecular peptide therapy reconnecting broken keratin chains permanently</div>
              </div>
              <div class="price-item-val" style="font-size: 1.25rem;">from £20.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">K18 added into colour</div>
                <div class="price-item-desc">Pre-service molecular mist and post-service leave-in peptide mask</div>
              </div>
              <div class="price-item-val">from £10.00</div>
            </div>
          </div>
        </section>

        <!-- Group 4: Specialist Services (Price On Consultation) -->
        <section class="price-menu-group" aria-labelledby="catPOC">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <h2 id="catPOC" style="font-size: 1.85rem; margin: 0;">Specialist Services</h2>
            <span class="badge-purple">Price On Consultation (POC)</span>
          </div>

          <p style="font-size: 0.88rem; color: var(--color-text-secondary); margin-bottom: 1.25rem;">
            These bespoke transformative services require an in-person salon assessment at 59 Kirkgate to evaluate hair condition, time required, and exact quotation.
          </p>

          <div>
            <div class="price-item-row">
              <div>
                <div class="price-item-name">Balayage</div>
                <div class="price-item-desc">Hand-painted seamless ribbon gradients tailored to your cut and texture</div>
              </div>
              <div class="price-item-val">POC</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Hair extensions (Great Lengths Certified)</div>
                <div class="price-item-desc">100% human hair extensions for unmatched volume, thickness, and length</div>
              </div>
              <div class="price-item-val">POC</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Keratin treatment</div>
                <div class="price-item-desc">Long-lasting smoothing treatment repelling frizz and humidity for up to 12 weeks</div>
              </div>
              <div class="price-item-val">POC</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Chemical straightening</div>
                <div class="price-item-desc">Permanent restructuring for permanently straight, sleek, manageable locks</div>
              </div>
              <div class="price-item-val">POC</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Colour correction</div>
                <div class="price-item-desc">Specialist remedial colour addressing uneven banding, box dye, or dramatic shifts</div>
              </div>
              <div class="price-item-val">POC</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Wedding hair</div>
                <div class="price-item-desc">Tailored bridal and bridal party styling packages, in-salon or on location</div>
              </div>
              <div class="price-item-val">POC</div>
            </div>
          </div>
        </section>

        <!-- Group 5: Children's Cuts -->
        <section class="price-menu-group" aria-labelledby="catChildren">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <h2 id="catChildren" style="font-size: 1.85rem; margin: 0;">Children's Cuts</h2>
            <span class="badge-lilac">Gentle &amp; Friendly</span>
          </div>

          <div>
            <div class="price-item-row">
              <div>
                <div class="price-item-name">Toddlers</div>
                <div class="price-item-desc">Gentle first trims in a patient, welcoming atmosphere</div>
              </div>
              <div class="price-item-val">£10.50</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Under 10's</div>
                <div class="price-item-desc">Neat, manageable cuts for young boys and girls</div>
              </div>
              <div class="price-item-val">£16.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Children's cut &amp; blow dry</div>
                <div class="price-item-desc">Full wash, haircut, and blow dry finish for older children</div>
              </div>
              <div class="price-item-val">£29.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Boys under 16 years</div>
                <div class="price-item-desc">Modern scissor and clipper styling for teenage boys</div>
              </div>
              <div class="price-item-val">from £16.00</div>
            </div>
          </div>
        </section>

        <!-- Group 6: EKM Beauty Suite -->
        <section class="price-menu-group" aria-labelledby="catEKM">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem;">
            <div>
              <h2 id="catEKM" style="font-size: 1.85rem; margin: 0;">EKM Beauty In-Salon Suite</h2>
              <div style="font-size: 0.85rem; color: var(--color-text-secondary); margin-top: 0.2rem;">By Ellie • @_ekmbeauty</div>
            </div>
            <span class="badge-purple">BIAB, Lashes &amp; Brows</span>
          </div>

          <div>
            <div class="price-item-row" style="background-color: #F6F1FA; padding: 0.85rem; border-radius: 0.5rem; border-bottom: none; margin: 0.4rem 0;">
              <div>
                <div class="price-item-name" style="color: var(--color-accent-hover);">BIAB Natural Nail Overlay</div>
                <div class="price-item-desc">Strengthening Builder in a Bottle overlay to nurture long-lasting natural nail growth</div>
              </div>
              <div class="price-item-val" style="font-size: 1.25rem;">£32.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">BIAB Overlay with Gel Colour</div>
                <div class="price-item-desc">Reinforced BIAB base finished with your choice of high-gloss gel shade</div>
              </div>
              <div class="price-item-val">£36.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Gel Manicure (Hands) / Pedicure (Toes)</div>
                <div class="price-item-desc">Nail shape, cuticle care, and chip-resistant gel polish</div>
              </div>
              <div class="price-item-val">£26.00 / £28.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Bespoke Nail Art</div>
                <div class="price-item-desc">French tips, chrome powders, florals, swirls, and accent designs</div>
              </div>
              <div class="price-item-val">from £5.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Lash Lift &amp; Tint</div>
                <div class="price-item-desc">Root-to-tip curl and tint lasting 6 to 8 weeks (Patch test required 48h prior)</div>
              </div>
              <div class="price-item-val">£38.00</div>
            </div>

            <div class="price-item-row">
              <div>
                <div class="price-item-name">Brow Lamination, Wax &amp; Tint</div>
                <div class="price-item-desc">Fluffy brow restructuring with bespoke tint and precision shaping</div>
              </div>
              <div class="price-item-val">£36.00</div>
            </div>
          </div>
        </section>
      </div>

      <!-- Bottom Booking Banner -->
      <div style="text-align: center; margin-top: 3.5rem; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 1.5rem; padding: 2.5rem 1.5rem; box-shadow: var(--shadow-subtle);">
        <h3 style="font-size: 1.85rem; margin-bottom: 0.75rem; color: #1E142B;">Ready to Book Your Chair?</h3>
        <p style="color: #382D46; max-width: 500px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
          Get in touch with our salon team, explore our opening hours, or visit us at 59 Kirkgate in Otley.
        </p>
        <a href="contact.html" class="btn-primary" style="font-size: 1rem; padding: 0.95rem 2rem;">
          Find Us &amp; Booking &rarr;
        </a>
      </div>
    </div>
  </main>`;

  return head + header + content + footer;
}

// =============================================================================
// PAGE 3: about.html (About the Salon)
// =============================================================================
function generateAboutHtml() {
  const head = renderHead(
    'About the Salon | Ethos & Kirkgate Boutique Experience',
    'Learn about Halo Hair Design at 59 Kirkgate in Otley. Our team approach, boutique ethos, Great Lengths certification, and in-salon EKM Beauty suite.',
    'about.html'
  );
  const header = renderHeader('about');
  const footer = renderFooter();

  const content = `
  <main class="page-lilac-bg" style="padding: 4.5rem 0 5rem;">
    <div class="container-custom">
      <!-- About Hero -->
      <div style="max-width: 720px; margin: 0 auto 3.5rem; text-align: center;">
        <span class="badge-hero">Our Story &amp; Ethos</span>
        <h1 style="font-size: clamp(2.3rem, 4.2vw, 3.5rem); margin-top: 0.4rem; margin-bottom: 1rem; color: #1E142B;">
          A Warm, Boutique Salon on Kirkgate
        </h1>
        <p style="color: #382D46; font-size: 1.1rem; line-height: 1.65;">
          Replacing rushed salon conveyor belts with personalized attention, genuine hairdressing expertise, and an unhurried atmosphere in the heart of Otley.
        </p>
      </div>

      <!-- Vignette & Story Grid -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 3.5rem; align-items: center; margin-bottom: 4.5rem;" class="about-grid">
        <!-- Compact Framed Interior Vignette (STRICTLY CONSTRAINED to max 340px wide) -->
        <div style="display: flex; justify-content: center;">
          <div class="photo-vignette-portrait">
            <picture>
              <source srcset="images/interior.webp" type="image/webp">
              <img src="images/interior.jpg" alt="Interior view of Halo Hair Design at 59 Kirkgate Otley" width="340" height="453" loading="eager">
            </picture>
            <div style="padding: 0.75rem 0.5rem 0.25rem; text-align: center;">
              <div style="font-family: var(--font-serif); font-size: 1.05rem; font-weight: 600; color: #1E142B;">The Styling Station</div>
              <div style="font-size: 0.78rem; color: #5B4E6C;">Warm wooden floors, ornate mirrors &amp; tranquil basins</div>
            </div>
          </div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 1.5rem; padding: 2.25rem 2rem; box-shadow: var(--shadow-subtle);">
          <span class="badge-purple" style="margin-bottom: 0.75rem;">Personalized Care</span>
          <h2 style="font-size: clamp(1.85rem, 3vw, 2.4rem); margin-top: 0.4rem; margin-bottom: 1.25rem; color: #1E142B;">
            Hairdressing Built on Consultation &amp; Trust
          </h2>

          <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.95rem; margin-bottom: 1.25rem;">
            Halo Hair Design was established with a clear philosophy: that getting your hair done should feel relaxing, uplifting, and completely bespoke. Based at 59 Kirkgate, our boutique salon offers a peaceful retreat from busy daily life.
          </p>

          <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.95rem; margin-bottom: 1.5rem;">
            Whether you are maintaining your classic cut &amp; blow wave or embarking on a full balayage transformation, our stylists listen attentively to your expectations. We evaluate your hair texture, face shape, and lifestyle maintenance to deliver results that look effortless weeks after your visit.
          </p>

          <div style="background: var(--color-canvas); border: 1px solid var(--color-border); border-radius: 1rem; padding: 1.25rem; margin-bottom: 1.75rem;">
            <div style="font-weight: 700; color: var(--color-accent-hover); margin-bottom: 0.35rem;">Certified Great Lengths Specialists</div>
            <p style="font-size: 0.88rem; color: var(--color-text-secondary); margin: 0;">
              We take pride in our certified Great Lengths extension expertise, working exclusively with ethically sourced 100% human hair to achieve discreet, weightless volume and natural length.
            </p>
          </div>

          <a href="services.html" class="btn-primary">
            Explore Our Salon Services &rarr;
          </a>
        </div>
      </div>

      <!-- In-Salon Partnership: EKM Beauty -->
      <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 1.5rem; padding: 2.75rem 2rem; box-shadow: var(--shadow-subtle); margin-bottom: 4rem;">
        <div style="max-width: 720px; margin: 0 auto; text-align: center;">
          <span class="badge-purple">In-Salon Suite</span>
          <h2 style="font-size: 2.2rem; margin-top: 0.4rem; margin-bottom: 1rem;">
            Incorporating EKM Beauty by Ellie
          </h2>
          <p style="color: var(--color-text-secondary); font-size: 0.95rem; line-height: 1.65; margin-bottom: 1.75rem;">
            Complementing our core hairdressing services, our private in-salon beauty suite offers specialized nail and facial aesthetics. Ellie is a dedicated specialist in Builder in a Bottle (BIAB) nail strengthening, high-definition brow lamination, and semi-permanent lash lifting.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a href="contact.html" class="btn-primary">
              Find Us &amp; Booking &rarr;
            </a>
            <a href="https://instagram.com/_ekmbeauty" target="_blank" rel="noopener" class="btn-secondary">
              Follow @_ekmbeauty &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  </main>

  <style>
    @media (min-width: 820px) {
      .about-grid { grid-template-columns: 0.85fr 1.15fr !important; }
    }
  </style>`;

  return head + header + content + footer;
}

// =============================================================================
// PAGE 4: gallery.html (Our Work)
// =============================================================================
function generateGalleryHtml() {
  const head = renderHead(
    'Our Work | Haircut & Colour Portfolio',
    'Browse our curated portfolio of hair transformations at Halo Hair Design in Otley. Balayage, highlights, precision cuts, and bridal hair up.',
    'gallery.html'
  );
  const header = renderHeader('gallery');
  const footer = renderFooter();

  const items = [
    { file: 'images/headshot-1.jpg', tag: 'Balayage & Waves', title: 'Sun-Kissed Dimensional Blonde', desc: 'Hand-painted blonde ribbon balayage with loose thermal waves.' },
    { file: 'images/headshot-2.jpg', tag: 'Cut & Colour', title: 'Warm Honey Dimension & Layers', desc: 'Luminous honey tones paired with soft, textured framing layers.' },
    { file: 'images/headshot-3.jpg', tag: 'Highlights', title: 'Golden Highlights & Blow Wave', desc: 'Precision foil placement finished with a classic bouncy blowout.' },
    { file: 'images/headshot-4.jpg', tag: 'Styling & Colour', title: 'Mocha Brunette & Bouncy Curls', desc: 'Rich gloss brunette enriched with defined thermal ringlets.' },
    { file: 'images/headshot-5.jpg', tag: 'Hair Up & Bridal', title: 'Bespoke Braided Occasion Updo', desc: 'Intricate plaited bubble ponytail tailored for weddings and proms.' },
    { file: 'images/headshot-6.jpg', tag: 'Colour Melt', title: 'Nordic Ash Blonde & Beach Waves', desc: 'Cool-toned platinum melt with seamless root smudge.' },
    { file: 'images/headshot-7.jpg', tag: 'Cut & Blow Wave', title: 'Precision Glass Hair & Blow Dry', desc: 'Silky smooth, high-shine brunette cut with blunt razor edges.' },
    { file: 'images/headshot-8.jpg', tag: 'Restyle', title: 'Face-Framing Curtain Bangs', desc: 'Soft 70s-inspired curtain fringe with airy salon blowout finish.' }
  ];

  const content = `
  <main class="page-lilac-bg" style="padding: 4.5rem 0 5rem;">
    <div class="container-custom">
      <!-- Gallery Header -->
      <div style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem;">
        <span class="badge-hero">Portfolio</span>
        <h1 style="font-size: clamp(2.3rem, 4.2vw, 3.5rem); margin-top: 0.4rem; margin-bottom: 0.75rem; color: #1E142B;">
          Our Recent Work
        </h1>
        <p style="color: #382D46; font-size: 1rem; line-height: 1.6;">
          Real transformations on real Otley clients. Each photo is framed in compact dimensions to preserve detail and natural hair shine.
        </p>
      </div>

      <!-- Curated Compact Portfolio Grid (Crisp 1:1 Square Retina Framing) -->
      <div class="gallery-grid">
        ${items.map(item => `
          <div class="gallery-card">
            <div class="gallery-card-img-wrap">
              <picture>
                <source srcset="${item.file.replace('.jpg', '.webp')}" type="image/webp">
                <img src="${item.file}" alt="${item.title} by Halo Hair Design Otley" class="gallery-card-img" width="500" height="500" loading="lazy">
              </picture>
            </div>
            <div style="padding: 0.25rem 0.25rem 0.5rem; display: flex; flex-direction: column; flex-grow: 1;">
              <span class="badge-lilac" style="font-size: 0.68rem; margin-bottom: 0.4rem; align-self: flex-start;">${item.tag}</span>
              <h2 style="font-size: 1.15rem; margin-bottom: 0.3rem;">${item.title}</h2>
              <p style="font-size: 0.825rem; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 0.85rem; flex-grow: 1;">
                ${item.desc}
              </p>
              <a href="contact.html" style="font-size: 0.8rem; font-weight: 700; color: var(--color-accent); text-decoration: none;">
                Book similar style &rarr;
              </a>
            </div>
          </div>
        `).join('\n')}
      </div>

      <!-- Consultation Trigger -->
      <div style="text-align: center; margin-top: 4.5rem; background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 1.25rem; padding: 2.5rem 1.5rem;">
        <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem;">Inspired by a Style?</h2>
        <p style="color: var(--color-text-secondary); font-size: 0.95rem; max-width: 500px; margin: 0 auto 1.5rem;">
          Bring your reference photos into 59 Kirkgate for a chat with our stylists.
        </p>
        <a href="contact.html" class="btn-primary">
          Find Us &amp; Booking &rarr;
        </a>
      </div>
    </div>
  </main>`;

  return head + header + content + footer;
}

// =============================================================================
// PAGE 5: contact.html (Find Us & Booking)
// =============================================================================
function generateContactHtml() {
  const head = renderHead(
    'Find Us & Booking | 59 Kirkgate, Hours & Parking',
    'Visit Halo Hair Design at 59 Kirkgate in Otley, LS21 3HN. Complete opening hours schedule, compact shop front photo, Otley parking notes, and phone booking.',
    'contact.html'
  );
  const header = renderHeader('contact');
  const footer = renderFooter();

  const content = `
  <main class="page-lilac-bg" style="padding: 4.5rem 0 5rem;">
    <div class="container-custom">
      <!-- Contact Header -->
      <div style="text-align: center; max-width: 680px; margin: 0 auto 3.5rem;">
        <span class="badge-hero">Location &amp; Appointments</span>
        <h1 style="font-size: clamp(2.3rem, 4.2vw, 3.5rem); margin-top: 0.4rem; margin-bottom: 0.75rem; color: #1E142B;">
          Find Us &amp; Booking
        </h1>
        <p style="color: #382D46; font-size: 1rem; line-height: 1.6;">
          Everything you need to visit Halo Hair Design on Kirkgate in Otley — opening hours, parking recommendations, and direct telephone contact.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr; gap: 3rem;" class="contact-layout-grid">
        <!-- Col 1: Details & Compact Shop Front Card -->
        <div>
          <!-- Compact Shop Front Photo Card (STRICTLY CONSTRAINED to max 360px wide) -->
          <div style="margin-bottom: 2rem; display: flex; justify-content: flex-start;">
            <div class="photo-vignette-compact" style="margin-left: 0;">
              <picture>
                <source srcset="images/storefront.webp" type="image/webp">
                <img src="images/storefront.jpg" alt="Halo Hair Design shop front exterior on Kirkgate in Otley" width="360" height="270" loading="eager">
              </picture>
              <div style="padding: 0.75rem 0.5rem 0.25rem;">
                <div style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 600; color: #1E142B;">59 Kirkgate, Otley</div>
                <div style="font-size: 0.8rem; color: #5B4E6C;">Direct street entrance with A-frame board &amp; floral topiary</div>
              </div>
            </div>
          </div>

          <!-- Direct Phone CTA Banner -->
          <div style="background: #FFFFFF; border: 1.5px solid var(--color-accent); border-radius: 1.25rem; padding: 1.75rem; margin-bottom: 2rem; box-shadow: var(--shadow-subtle);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge-purple" style="margin-bottom: 0.35rem;">Direct Phone Line</span>
                <div style="font-family: var(--font-serif); font-size: 1.65rem; font-weight: 700; color: var(--color-text-primary);">01943 850008</div>
                <div style="font-size: 0.85rem; color: var(--color-text-secondary);">Fastest way to check same-day chair availability</div>
              </div>
              <a href="tel:+441943850008" class="btn-primary" style="font-size: 0.95rem; padding: 0.85rem 1.65rem;">
                📞 Tap to Call
              </a>
            </div>
          </div>

          <!-- Otley Parking Guidance -->
          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 1.25rem; padding: 1.75rem; box-shadow: var(--shadow-subtle);">
            <h2 style="font-size: 1.35rem; margin-bottom: 0.75rem;">Local Parking &amp; Transit</h2>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem; color: var(--color-text-secondary);">
              <li style="display: flex; gap: 0.5rem;">
                <strong style="color: var(--color-text-primary);">• Kirkgate On-Street:</strong> Short-stay bays right outside the salon for trims and blow waves.
              </li>
              <li style="display: flex; gap: 0.5rem;">
                <strong style="color: var(--color-text-primary);">• Orchard Gate Car Park:</strong> Just a 2-minute level walk, ideal for longer balayage and extensions.
              </li>
              <li style="display: flex; gap: 0.5rem;">
                <strong style="color: var(--color-text-primary);">• Courthouse Street Car Park:</strong> Ample pay-and-display bays within 4 minutes stroll.
              </li>
              <li style="display: flex; gap: 0.5rem;">
                <strong style="color: var(--color-text-primary);">• Otley Bus Station:</strong> Located 3 minutes away connecting Wharfedale, Ilkley, and Leeds.
              </li>
            </ul>
          </div>
        </div>

        <!-- Col 2: Opening Hours Matrix & Google Map Embed -->
        <div>
          <!-- Opening Hours Matrix -->
          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 1.25rem; padding: 1.75rem; margin-bottom: 2rem; box-shadow: var(--shadow-subtle);">
            <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Opening Hours Matrix</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.925rem;">
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.65rem 0;">Monday</td>
                <td style="padding: 0.65rem 0; text-align: right; color: var(--color-text-secondary);">Closed</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.65rem 0; font-weight: 600;">Tuesday</td>
                <td style="padding: 0.65rem 0; text-align: right; font-weight: 600;">09:30 – 17:30</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border); background-color: #F6F1FA;">
                <td style="padding: 0.65rem 0.5rem; font-weight: 700; color: var(--color-accent-hover);">Wednesday (Late Night)</td>
                <td style="padding: 0.65rem 0.5rem; text-align: right; font-weight: 700; color: var(--color-accent-hover);">09:00 – Late (By Appt)</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border); background-color: #F6F1FA;">
                <td style="padding: 0.65rem 0.5rem; font-weight: 700; color: var(--color-accent-hover);">Thursday (Late Night)</td>
                <td style="padding: 0.65rem 0.5rem; text-align: right; font-weight: 700; color: var(--color-accent-hover);">09:00 – Late (By Appt)</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.65rem 0;">Friday</td>
                <td style="padding: 0.65rem 0; text-align: right;">09:00 – 18:00</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.65rem 0;">Saturday</td>
                <td style="padding: 0.65rem 0; text-align: right;">09:00 – 16:00</td>
              </tr>
              <tr>
                <td style="padding: 0.65rem 0;">Sunday</td>
                <td style="padding: 0.65rem 0; text-align: right; color: var(--color-text-secondary);">Closed</td>
              </tr>
            </table>
          </div>

          <!-- Google Maps Embed -->
          <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: 1.25rem; overflow: hidden; box-shadow: var(--shadow-subtle);">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2349.521873139365!2d-1.6963889!3d53.9056000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487955562764b8bb%3A0x7d025b6d510e4708!2s59%20Kirkgate%2C%20Otley%20LS21%203HN!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk" 
              width="100%" 
              height="360" 
              style="border:0; display: block;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              title="Google Maps Location for Halo Hair Design 59 Kirkgate Otley">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </main>

  <style>
    @media (min-width: 820px) {
      .contact-layout-grid { grid-template-columns: 1fr 1fr !important; }
    }
  </style>`;

  return head + header + content + footer;
}

// Generate all 5 files in ROOT_DIR
fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), generateIndexHtml());
console.log('✓ Written index.html');

fs.writeFileSync(path.join(ROOT_DIR, 'services.html'), generateServicesHtml());
console.log('✓ Written services.html');

fs.writeFileSync(path.join(ROOT_DIR, 'about.html'), generateAboutHtml());
console.log('✓ Written about.html');

fs.writeFileSync(path.join(ROOT_DIR, 'gallery.html'), generateGalleryHtml());
console.log('✓ Written gallery.html');

fs.writeFileSync(path.join(ROOT_DIR, 'contact.html'), generateContactHtml());
console.log('✓ Written contact.html');

console.log('All 5 specification pages created successfully!');
