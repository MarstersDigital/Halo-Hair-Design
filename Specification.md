# Antigravity Task Specification: Halo Hair Design Multipage Website

## 1. Project Overview & Multi-Page Mandate
Build a fast, semantic, multipage static website for **Halo Hair Design**, a boutique salon located at 59 Kirkgate, Otley, LS21 3HN.

### Core Architecture & Routing
The site must be structured across 5 distinct HTML pages with consistent navigation and relative links:
- `index.html` — **Home** (Editorial brand intro, highlights, moving marquee banner, location snapshot)
- `services.html` — **Services & Pricing** (Full semantic price menu parsed from image, treatment policies)
- `about.html` — **About the Salon** (Salon ethos, team approach, framed interior vignette)
- `gallery.html` — **Our Work** (Curated, compact portfolio grid of styling & colour transformations)
- `contact.html` — **Find Us & Booking** (Opening hours, shop front photo card, Otley parking notes, direct phone CTA)

### Image Quality Safeguards (STRICT RULE)
- The brand logo is high quality; all other photos (shop front, interior, headshots) are lower resolution / compressed.
- **NEVER use full-bleed hero image backgrounds or oversized banners on ANY page.**
- Rely on luxury editorial typography (serif headings + airy sans-serif body), generous whitespace, and warm borders (`#EBE7DF`).
- Restrict all photo containers to compact, framed dimensions (max 320px–360px wide) or downsampled marquee cards (180px–200px wide) so photos remain crisp on retina screens.

---

## 2. Design Tokens & Visual Hierarchy

### 2.1 Colors
- **Canvas / Background:** `#FBFBF9` (Warm linen / soft off-white)
- **Cards / Containers:** `#FFFFFF` (Pure white)
- **Primary Typography:** `#1F1F1F` (Deep charcoal)
- **Secondary Typography:** `#686663` (Muted warm slate)
- **Boutique Accent:** `#A38D6D` / `#C5A880` (Muted champagne gold)
- **Borders & Dividers:** `#EBE7DF` (Soft warm stone)

### 2.2 Typography
- **Headings (H1, H2, H3):** Editorial serif (`font-serif`, e.g., *Playfair Display*, *Cormorant Garamond*, or *Fraunces*).
- **Body & Navigation:** Crisp sans-serif (`font-sans`, e.g., *Plus Jakarta Sans*, *Inter*, or *Outfit*).

---

## 3. Local Asset Directory
Antigravity must inspect the `images/` directory in the project root:

```text
images/
├── [brand logo]          # e.g. logo.png / logo.svg
├── [shop front image]    # Exterior of 59 Kirkgate, Otley
├── [interior image]      # Salon interior / styling stations
├── [headshot images...]  # Headshots & hair transformations
└── [price list image]    # Reference image containing services & £ prices