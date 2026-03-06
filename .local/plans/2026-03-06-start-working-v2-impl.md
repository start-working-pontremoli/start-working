---
Generated: 2026-03-06
Type: implementation
Source-UX: .local/plans/2026-03-06-start-working-v2-ux.md
Source-Prototype: prototypes/start-working-v2/index.html
Status: ready
Pipeline-Step: impl
---

# Start Working v2.0 — Implementation Plan

## Executive Summary

- **What We're Building**: A bilingual (IT/EN) single-page website for Start Working Pontremoli, replacing the current WordPress site
- **Technical Approach**: Static HTML/CSS/JS site, no build tools, JSON-based translations, deployed to GitHub Pages
- **Key Technologies**: HTML5, CSS3 (custom properties, grid, flexbox), vanilla JS, Google Fonts
- **Implementation**: Single phase, ~3-4 working sessions
- **Critical Path**: Project structure → HTML sections → CSS design system → JS interactions → content & deploy

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                   GitHub Pages                        │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Static Files (CDN)                 │ │
│  │                                                 │ │
│  │  index.html        ← Single page, all sections  │ │
│  │  css/style.css     ← Design system + responsive │ │
│  │  js/main.js        ← Nav, i18n, scroll spy     │ │
│  │  i18n/it.json      ← Italian translations      │ │
│  │  i18n/en.json      ← English translations      │ │
│  │  img/              ← Optimized images           │ │
│  │  CNAME             ← Custom domain (later)      │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**No backend, no build step, no dependencies.** Open `index.html` in a browser and it works.

---

## Project Structure

```
start-working-v2/
├── index.html              # Single-page site
├── css/
│   └── style.css           # All styles (design system + sections + responsive)
├── js/
│   └── main.js             # Language toggle, scroll spy, mobile menu, press marquee
├── i18n/
│   ├── it.json             # Italian content
│   └── en.json             # English content
├── img/
│   ├── hero.jpg            # Hero background (placeholder → real later)
│   ├── about.jpg           # About section photo
│   ├── lunigiana.jpg       # Territory section photo
│   ├── press/              # Press logos (SVG preferred)
│   │   ├── sole24ore.svg
│   │   ├── corriere.svg
│   │   └── ...
│   └── testimonials/       # Avatar photos (if available, else use initials)
├── favicon.ico             # Site favicon
└── README.md               # Setup and deployment instructions
```

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Markup | HTML5 semantic | SEO, accessibility, no framework overhead |
| Styling | CSS3 (custom properties) | Theming, responsive, no preprocessor needed |
| Scripting | Vanilla JS (ES6+) | Minimal interactivity, no bundler needed |
| Fonts | Google Fonts (Playfair Display + DM Sans) | Warm & organic typography from UX spec |
| Icons | Inline SVG or emoji | No icon library dependency |
| Images | Unsplash placeholders → real photos | Progressive enhancement of content |
| i18n | JSON files + data attributes | Clean separation of content from markup |
| Hosting | GitHub Pages | Free, git-based deploys, HTTPS |
| Domain | github.io URL (custom domain later) | Deploy fast, configure domain when ready |

---

## CSS Design System

Based on UX specification color palette and spacing:

```css
:root {
  /* Colors — Warm & Organic */
  --primary: #8B5E3C;          /* Terracotta brown */
  --primary-dark: #6B4226;     /* Darker brown for headings */
  --accent: #C4873A;           /* Muted gold for CTAs */
  --accent-hover: #A8712E;
  --bg: #FAF7F2;               /* Warm cream background */
  --bg-warm: #FFF8F0;          /* Card backgrounds */
  --bg-contact: #F0E6D8;       /* Contact section */
  --text: #2D2A26;             /* Dark warm gray */
  --text-light: #5C5650;       /* Body text */
  --text-muted: #8A8279;       /* Captions */

  /* Typography */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;

  /* Spacing */
  --section-pad: 80px;         /* Section vertical padding */
  --container-max: 1200px;
  --radius: 12px;
  --nav-height: 72px;

  /* Responsive overrides via media queries */
}
```

**Responsive breakpoints:**
- Desktop: > 900px (3-col testimonials, 2-col services, inline nav)
- Tablet: 601-900px (2-col testimonials, 2-col services, hamburger nav)
- Mobile: ≤ 600px (1-col everything, hamburger nav, stacked hero buttons)

---

## HTML Structure

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="..." data-i18n-attr="content:meta.description">
  <title data-i18n="meta.title">Start Working Pontremoli</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
</head>
<body>

  <header id="header">...</header>
  <div id="mobile-menu">...</div>

  <main>
    <section id="hero">...</section>
    <section id="chi-siamo">...</section>
    <section id="lunigiana">...</section>
    <section id="servizi">...</section>
    <section id="community">...</section>
    <section id="press">...</section>
    <section id="faq">...</section>
    <section id="contatti">...</section>
  </main>

  <footer>...</footer>

  <script src="js/main.js"></script>
</body>
</html>
```

**Key HTML patterns:**
- All translatable text uses `data-i18n="key"` attributes
- Semantic elements: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`
- Images use `loading="lazy"` for below-fold content
- Proper heading hierarchy: h1 (hero) → h2 (sections) → h3 (cards)

---

## JavaScript Modules (main.js)

All in a single file, organized by feature:

### 1. Language System (i18n)

```
- Fetch it.json or en.json based on current language
- Walk all [data-i18n] elements and set textContent/innerHTML
- Handle data-i18n-attr for attributes (meta description, alt text)
- Store preference in localStorage('sw-lang')
- Default: 'it' (unless navigator.language starts with 'en')
- Toggle buttons update active class and re-render
```

### 2. Header Scroll Behavior

```
- IntersectionObserver on hero section
- When hero is visible: header transparent (white text)
- When hero scrolls out: header solid (dark text, bg, shadow)
- CSS transition handles the animation
```

### 3. Scroll Spy

```
- IntersectionObserver on each section[id]
- When section enters viewport: highlight corresponding nav link
- Update URL hash (history.replaceState, not pushState to avoid history spam)
```

### 4. Smooth Scroll Navigation

```
- Click handler on nav links with href="#section-id"
- scrollIntoView({ behavior: 'smooth' })
- Account for sticky header offset via CSS scroll-padding-top
```

### 5. Mobile Menu

```
- Hamburger click → add .open class to overlay
- Close button or nav link click → remove .open class
- Toggle body overflow when open
```

### 6. Press Marquee

```
- CSS-only infinite scroll animation (@keyframes translateX)
- Duplicate logos in HTML for seamless loop
- Pause on hover via animation-play-state
- prefers-reduced-motion: stop animation
```

---

## i18n File Structure

**i18n/it.json:**
```json
{
  "meta": {
    "title": "Start Working Pontremoli — Lavora da un posto che puoi chiamare casa",
    "description": "Comunità di smart working in Lunigiana, Toscana. Coworking gratuito, fibra veloce, natura e comunità."
  },
  "nav": {
    "about": "Chi siamo",
    "territory": "Lunigiana",
    "services": "Servizi",
    "community": "Community",
    "faq": "FAQ",
    "contact": "Contatti"
  },
  "hero": {
    "title": "Lavora da un posto che puoi chiamare casa.",
    "subtitle": "Una comunità di lavoratori remoti nel cuore della Toscana selvaggia.",
    "cta_discover": "Scopri di più",
    "cta_contact": "Contattaci"
  },
  "about": {
    "title": "Chi Siamo",
    "text": "Start Working Pontremoli è un progetto nato per ripopolare l'Appennino..."
  },
  "...": "..."
}
```

**i18n/en.json:** Same keys, English values.

---

## Implementation Phases

### Phase 1: Foundation (Session 1)

**Goal:** Project structure + HTML skeleton + CSS design system

- [ ] Create repository and folder structure
- [ ] Set up `index.html` with semantic structure for all 8 sections
- [ ] Create `css/style.css` with:
  - CSS reset and custom properties (colors, fonts, spacing)
  - Typography scale with `clamp()` for fluid sizing
  - Container and section base styles
  - Utility classes
- [ ] Add Google Fonts link
- [ ] Create empty `js/main.js`, `i18n/it.json`, `i18n/en.json`

**Files:** `index.html`, `css/style.css`, `js/main.js`, `i18n/it.json`, `i18n/en.json`

### Phase 2: Section Styling (Session 2)

**Goal:** All sections visually complete

- [ ] **Header:** Transparent/solid states, nav layout, responsive hamburger
- [ ] **Hero:** Full-screen background, gradient overlay, centered text, CTA buttons, scroll indicator bounce animation
- [ ] **About:** Centered text + image placeholder
- [ ] **Lunigiana:** Split grid (image left, text right), stacks on mobile
- [ ] **Services:** 2x2 card grid with icons, hover lift effect
- [ ] **Testimonials:** CSS masonry grid (columns property), varying card heights
- [ ] **Press:** Horizontal auto-scrolling logo bar with `@keyframes`
- [ ] **FAQ:** Stacked cards, bold question + regular answer
- [ ] **Contact:** Warm background, centered CTA email button, social icons
- [ ] **Footer:** Dark background, centered text
- [ ] **Mobile menu:** Full-screen overlay with centered links

**Files:** `css/style.css` (bulk of the work)

### Phase 3: JavaScript Interactions (Session 3)

**Goal:** All interactive behaviors working

- [ ] **i18n system:**
  - Write JSON loader (fetch + cache)
  - DOM walker for `[data-i18n]` elements
  - Language toggle button handler
  - localStorage persistence
  - Meta tag updates (title, description)
- [ ] **Header scroll:**
  - IntersectionObserver on hero
  - Toggle transparent/solid classes
- [ ] **Scroll spy:**
  - IntersectionObserver on sections
  - Update active nav link
- [ ] **Smooth scroll:**
  - Nav link click handlers
  - Mobile menu link handlers
- [ ] **Mobile menu:**
  - Open/close toggle
  - Body scroll lock
- [ ] **Accessibility:**
  - `prefers-reduced-motion` check → disable animations
  - Keyboard navigation for nav links
  - Focus management for mobile menu

**Files:** `js/main.js`, `i18n/it.json`, `i18n/en.json`

### Phase 4: Content & Polish (Session 4)

**Goal:** Real placeholder images, final content, deploy

- [ ] **Images:**
  - Source Unsplash photos for hero, about, lunigiana sections
  - Optimize (compress, proper dimensions, WebP with JPG fallback)
  - Create press logo placeholders (text-based SVGs or real if available)
- [ ] **Content finalization:**
  - Complete all Italian text in `it.json`
  - Complete all English translations in `en.json`
  - Write 5 testimonial quotes (placeholder or real)
  - Write 5 FAQ items (can adapt from current site)
- [ ] **SEO basics:**
  - Meta title and description (bilingual)
  - Open Graph tags for social sharing
  - Favicon
  - Proper alt text on all images
- [ ] **Testing:**
  - Test on Chrome, Firefox, Safari
  - Test on mobile (real device or DevTools)
  - Test language toggle round-trip
  - Test all nav links scroll correctly
  - Lighthouse audit (aim for 90+ on all categories)
- [ ] **Deploy:**
  - Push to GitHub repository
  - Enable GitHub Pages (Settings → Pages → main branch)
  - Verify live site works

**Files:** `img/*`, `i18n/*.json`, `index.html` (meta tags), `favicon.ico`

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 95+ |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total page weight | < 2MB (mostly images) |
| HTML/CSS/JS combined | < 50KB |

**Optimization techniques:**
- `loading="lazy"` on below-fold images
- Preconnect to Google Fonts
- Font-display: swap for text visibility
- CSS in `<link>` (not inline) for caching
- Compress images (TinyPNG or similar)
- SVG for press logos and icons
- `prefers-reduced-motion` to skip animations

---

## Accessibility Checklist

- [ ] Semantic HTML (`header`, `main`, `section`, `footer`, `nav`)
- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] All images have `alt` text (bilingual via i18n)
- [ ] Color contrast WCAG AA (4.5:1 body, 3:1 large text)
- [ ] Focusable interactive elements with visible focus rings
- [ ] Skip-to-content link
- [ ] `aria-label` on hamburger menu, language toggle, social links
- [ ] `aria-expanded` on mobile menu toggle
- [ ] `lang` attribute updates on language switch
- [ ] `prefers-reduced-motion` respected

---

## SEO Considerations

```html
<!-- Essential meta tags -->
<meta name="description" content="..." data-i18n-attr="content:meta.description">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://[github-pages-url]/">

<!-- Open Graph -->
<meta property="og:title" content="Start Working Pontremoli">
<meta property="og:description" content="...">
<meta property="og:image" content="img/og-image.jpg">
<meta property="og:type" content="website">

<!-- Structured data (Organization) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Start Working Pontremoli APS",
  "url": "https://start-working.it",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Via dei Mille 18",
    "addressLocality": "Pontremoli",
    "postalCode": "54027",
    "addressRegion": "MS",
    "addressCountry": "IT"
  }
}
</script>
```

---

## Deployment Strategy

**GitHub Pages setup:**
1. Create GitHub repository (e.g., `start-working-v2`)
2. Push code to `main` branch
3. Go to Settings → Pages → Source: Deploy from branch → `main` / root
4. Site goes live at `https://[username].github.io/start-working-v2/`

**Later — custom domain:**
1. Add `CNAME` file with `start-working.it`
2. Configure DNS: CNAME record pointing to `[username].github.io`
3. Enable "Enforce HTTPS" in GitHub Pages settings

**Update workflow:**
1. Edit files locally
2. `git add . && git commit -m "update" && git push`
3. GitHub Pages auto-deploys in ~1 minute

---

## Open Questions

- [ ] **Logo:** Do you have an SVG logo file? (needed for header + footer)
- [ ] **Real testimonials:** Will you provide actual quotes, or should I write fictional placeholders?
- [ ] **Press logos:** Do you have SVG/PNG files for the press outlets, or should I use text-only?
- [ ] **Social URLs:** Confirm Instagram, LinkedIn, Facebook profile URLs
- [ ] **GitHub account:** Which GitHub account/org will host the repo?

---

## Next Steps

1. **Review this plan** — any changes to scope or approach?
2. **Start building** — I can begin Phase 1 immediately
3. **Content gathering** — start collecting photos, testimonials, FAQ text in parallel
