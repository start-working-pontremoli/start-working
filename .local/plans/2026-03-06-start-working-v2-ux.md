---
Generated: 2026-03-06
Type: ux
Source-Design: (from current site analysis + user session)
Status: draft
Pipeline-Step: ux
---

# Start Working v2.0 — UX Specification

## Executive Summary

- **Product**: Single-page bilingual website for Start Working Pontremoli — a smart working community in Lunigiana, Tuscany
- **Target Users**: Remote workers, digital nomads, professionals considering relocation to rural Italy
- **Total Screens**: 1 (single-page with 8 sections)
- **Key Flows**: Discovery scroll, language toggle, contact via email
- **Stack**: Plain HTML + CSS + JS (no frameworks)

---

## User Personas

### Persona: Digital Nomad / Remote Worker

- **Demographics**: 28-45, tech/creative professional, works remotely, based in a large city
- **Goals**: Find a community-oriented place to live and work with good quality of life
- **Pain Points**: Urban stress, isolation of remote work, difficulty finding authentic communities
- **Context**: Browsing from laptop or phone, likely found via press coverage or social media
- **Devices**: 60% mobile, 40% desktop
- **Languages**: Italian or English

### Persona: Curious Professional

- **Demographics**: 35-55, employed, considering a lifestyle change or partial relocation
- **Goals**: Understand what Start Working offers before committing to a visit
- **Pain Points**: Skepticism about rural infrastructure, needs social proof
- **Context**: Researching from home, comparing options
- **Devices**: Primarily desktop

---

## User Journey Map

### Journey: First-time Visitor Discovery

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  1. Land on │───>│  2. Scroll  │───>│  3. Read    │───>│  4. Send    │
│   Hero      │    │  & Discover │    │  Testimonials│   │   Email     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
  "What is this?"   "Interesting..."   "Real people!"     "I want in."

  Feeling: Curious → Intrigued → Trusting → Motivated
```

**Touchpoints**:
1. Hero — Captures attention with landscape + headline
2. About + Territory — Explains the mission and the place
3. Services — Shows practical value (coworking, community, etc.)
4. Testimonials — Builds trust through real voices
5. Press — Validates credibility
6. FAQ — Removes doubts
7. Contact — Converts interest to action

---

## Navigation Structure

```
[Single Page — Scroll Sections]

Header (sticky)
├── Logo (scrolls to top)
├── Nav Links (desktop only):
│   ├── Chi siamo
│   ├── Lunigiana
│   ├── Servizi
│   ├── Community
│   ├── FAQ
│   └── Contatti
├── Language Toggle: IT | EN
└── Hamburger Menu (mobile only)
    └── Full-screen overlay with all links
```

**Navigation Behavior:**
- Transparent over hero, solid background on scroll (with subtle shadow)
- Active section highlighted in nav as user scrolls
- Smooth scroll to sections on click
- Language toggle switches all text instantly (JS + localStorage)

---

## Screen: Full Page — Desktop Wireframe

### Section 1: Header (Sticky)

```
TRANSPARENT STATE (over hero):
┌──────────────────────────────────────────────────────────────────┐
│  [SW Logo]    Chi siamo  Lunigiana  Servizi  Community  FAQ     │
│                                              Contatti   IT|EN   │
└──────────────────────────────────────────────────────────────────┘

SCROLLED STATE (solid background):
┌──────────────────────────────────────────────────────────────────┐
│  [SW Logo]    Chi siamo  Lunigiana  Servizi  Community  FAQ     │
│                                              Contatti   IT|EN   │
├──────────────────────────────────────────────────────────────────┤
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ subtle shadow ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

### Section 2: Hero (Full-screen)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │
│     ░░░░░░░░░  FULL-SCREEN BACKGROUND PHOTO  ░░░░░░░░░░░░░     │
│     ░░░░░░░░░  (Lunigiana landscape or video) ░░░░░░░░░░░░░     │
│     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │
│                                                                  │
│              LAVORA DA UN POSTO CHE                               │
│              PUOI CHIAMARE CASA.                                 │
│                                                                  │
│              Una comunita' di lavoratori remoti                   │
│              nel cuore della Toscana selvaggia.                   │
│                                                                  │
│              [ Scopri di piu' ]    [ Contattaci ]                │
│                                                                  │
│                                                                  │
│                          ▼                                       │
│                    scroll indicator                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- "Scopri di piu'" smooth-scrolls to About section
- "Contattaci" smooth-scrolls to Contact section
- Scroll indicator animates subtly (bounce)
- Background: static photo (or optional slow video if provided)
- Dark overlay gradient for text readability

### Section 3: Chi Siamo / About

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                        CHI SIAMO                                 │
│                                                                  │
│    Start Working Pontremoli e' un progetto nato per              │
│    ripopolare l'Appennino attirando professionisti               │
│    da tutto il mondo. Non solo un coworking: una                 │
│    comunita' vera, in un luogo che puoi chiamare casa.           │
│                                                                  │
│    ┌─────────────────────────────────────────────┐               │
│    │                                             │               │
│    │        [Photo: community / coworking]       │               │
│    │                                             │               │
│    └─────────────────────────────────────────────┘               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Section 4: Lunigiana / The Territory

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌──────────────────────────┐                                    │
│  │                          │    LUNIGIANA                       │
│  │   [Large landscape      │                                    │
│  │    photo of the          │    Non e' la Toscana che           │
│  │    territory — rivers,   │    immagini. E' selvaggia,        │
│  │    medieval villages,    │    irriverente, fatta di           │
│  │    mountains]            │    fiumi, foreste, borghi          │
│  │                          │    medievali e sentieri            │
│  │                          │    di montagna.                    │
│  └──────────────────────────┘                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Notes:** Split layout — image left, text right. On mobile: stacked (image on top).

### Section 5: Servizi / What We Offer

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    COSA PUOI TROVARE                              │
│                                                                  │
│   ┌──────────────────────┐   ┌──────────────────────┐           │
│   │       [icon]         │   │       [icon]         │           │
│   │     WELCOMING        │   │     COMMUNITY        │           │
│   │   ──────────────     │   │   ──────────────     │           │
│   │   Visite esplorative │   │   Connessioni        │           │
│   │   e immersione       │   │   sociali gia'       │           │
│   │   culturale          │   │   pronte e attivita' │           │
│   └──────────────────────┘   └──────────────────────┘           │
│                                                                  │
│   ┌──────────────────────┐   ┌──────────────────────┐           │
│   │       [icon]         │   │       [icon]         │           │
│   │     COWORKING        │   │     SERVIZI          │           │
│   │   ──────────────     │   │   ──────────────     │           │
│   │   Fibra veloce in    │   │   Sanita', trasporti,│           │
│   │   una sala del '400  │   │   sport, negozi      │           │
│   │   (gratuito)         │   │   tutto a portata    │           │
│   └──────────────────────┘   └──────────────────────┘           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** 2x2 grid on desktop, single column on mobile.
**Interaction:** Cards have subtle hover effect (slight lift + shadow).

### Section 6: Testimonianze / Testimonials

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                  LA NOSTRA COMMUNITY                             │
│                                                                  │
│   ┌───────────────┐  ┌───────────────┐  ┌────────────────┐     │
│   │               │  │               │  │                │     │
│   │  "Ho trovato  │  │  "La qualita' │  │  "Lavorare     │     │
│   │   qui quello  │  │   della vita  │  │   circondati   │     │
│   │   che in      │  │   e'          │  │   dalla natura │     │
│   │   citta' non  │  │   incompara-  │  │   cambia       │     │
│   │   esisteva."  │  │   bile."      │  │   tutto."      │     │
│   │               │  │               │  │                │     │
│   │  [Photo]      │  │  [Photo]      │  │  [Photo]       │     │
│   │  Nome         │  │  Nome         │  │  Nome          │     │
│   │  Ruolo/Citta' │  │  Ruolo/Citta' │  │  Ruolo/Citta'  │     │
│   └───────────────┘  └───────────────┘  │                │     │
│                                          │                │     │
│   ┌───────────────┐  ┌───────────────┐  │                │     │
│   │               │  │               │  └────────────────┘     │
│   │  "Quote..."   │  │  "Quote..."   │                         │
│   │               │  │               │                         │
│   │  [Photo]      │  │  [Photo]      │                         │
│   │  Nome         │  │  Nome         │                         │
│   └───────────────┘  └───────────────┘                         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** CSS masonry grid — 3 columns on desktop, 2 on tablet, 1 on mobile.
**Cards:** Quote text, small circular photo, name, role/origin city.
**Style:** Warm card backgrounds, soft rounded corners, varying heights for organic feel.

### Section 7: Rassegna Stampa / Press

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                      PARLANO DI NOI                              │
│                                                                  │
│  ◀ [Sole24Ore] [Corriere] [WSJ] [Ansa] [Repubblica] [Sky] ▶    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** Auto-scrolling horizontal logo bar (CSS animation, infinite loop).
**Interaction:** Logos are clickable, linking to the original articles. Pauses on hover.
**Mobile:** Same horizontal scroll, touch-swipeable.
**Style:** Logos in grayscale, color on hover.

### Section 8: FAQ

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                    DOMANDE FREQUENTI                              │
│                                                                  │
│   ┌──────────────────────────────────────────────────────┐      │
│   │  Come posso visitare Pontremoli?                     │      │
│   │  ────────────────────────────────                    │      │
│   │  Puoi prenotare una visita esplorativa scrivendoci   │      │
│   │  a info@start-working.it. Ti accoglieremo e ti      │      │
│   │  mostreremo il borgo e la comunita'.                 │      │
│   └──────────────────────────────────────────────────────┘      │
│                                                                  │
│   ┌──────────────────────────────────────────────────────┐      │
│   │  Il coworking e' gratuito?                           │      │
│   │  ────────────────────────────────                    │      │
│   │  Si, lo spazio coworking e' messo a disposizione     │      │
│   │  gratuitamente dal Comune di Pontremoli.             │      │
│   └──────────────────────────────────────────────────────┘      │
│                                                                  │
│   ┌──────────────────────────────────────────────────────┐      │
│   │  C'e' connessione internet veloce?                   │      │
│   │  ────────────────────────────────                    │      │
│   │  Si, fibra ottica disponibile nel coworking          │      │
│   │  e in gran parte del centro storico.                 │      │
│   └──────────────────────────────────────────────────────┘      │
│                                                                  │
│   [... more Q&A pairs ...]                                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Layout:** All Q&A visible (no accordion). Stacked cards with clear visual separation.
**Style:** Question in bold, answer in regular weight. Subtle card backgrounds.

### Section 9: Contatti / Contact

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ░░░░░░░░░░░░░ (warm background color) ░░░░░░░░░░░░░░░░░░░░░   │
│                                                                  │
│              Vuoi saperne di piu'?                                │
│              Raccontaci chi sei e cosa cerchi.                    │
│                                                                  │
│              [ Scrivici → info@start-working.it ]                │
│                                                                  │
│              Via dei Mille 18, Pontremoli (MS)                   │
│                                                                  │
│              [Instagram]  [LinkedIn]  [Facebook]                 │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Interaction:** Email button opens `mailto:info@start-working.it`.
**Social icons:** Link to respective profiles. Subtle hover effect.
**Style:** Warm accent background color to visually separate from FAQ.

### Section 10: Footer

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [SW Logo]                                                       │
│                                                                  │
│  Start Working Pontremoli APS                                    │
│  Via dei Mille 18, 54027 Pontremoli (MS)                        │
│  C.F. [codice fiscale]                                           │
│                                                                  │
│  Privacy Policy  |  Cookie Policy                                │
│                                                                  │
│  © 2026 Start Working Pontremoli APS                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Mobile Wireframe (Key Differences)

### Mobile Header + Menu

```
HEADER:
┌────────────────────────────┐
│  [Logo]        IT|EN   ☰  │
└────────────────────────────┘

MENU OVERLAY (☰ tapped):
┌────────────────────────────┐
│  [Logo]               ✕   │
│                            │
│       Chi siamo            │
│       Lunigiana            │
│       Servizi              │
│       Community            │
│       FAQ                  │
│       Contatti             │
│                            │
│       IT  |  EN            │
│                            │
│  [IG]  [LI]  [FB]         │
└────────────────────────────┘
```

### Mobile Hero

```
┌────────────────────────────┐
│                            │
│  ░░░ Background photo ░░░ │
│                            │
│  LAVORA DA UN POSTO        │
│  CHE PUOI CHIAMARE         │
│  CASA.                     │
│                            │
│  Una comunita' di          │
│  lavoratori remoti nel     │
│  cuore della Toscana       │
│  selvaggia.                │
│                            │
│  [ Scopri di piu' ]       │
│  [ Contattaci ]            │
│                            │
│          ▼                 │
└────────────────────────────┘
```

### Mobile Services (stacked)

```
┌────────────────────────────┐
│   COSA PUOI TROVARE        │
│                            │
│   ┌──────────────────────┐ │
│   │ [icon]  Welcoming    │ │
│   │ Desc text here...    │ │
│   └──────────────────────┘ │
│   ┌──────────────────────┐ │
│   │ [icon]  Community    │ │
│   │ Desc text here...    │ │
│   └──────────────────────┘ │
│   ┌──────────────────────┐ │
│   │ [icon]  Coworking    │ │
│   │ Desc text here...    │ │
│   └──────────────────────┘ │
│   ┌──────────────────────┐ │
│   │ [icon]  Servizi      │ │
│   │ Desc text here...    │ │
│   └──────────────────────┘ │
└────────────────────────────┘
```

### Mobile Testimonials (single column)

```
┌────────────────────────────┐
│  LA NOSTRA COMMUNITY       │
│                            │
│  ┌──────────────────────┐  │
│  │ "Quote text..."      │  │
│  │                      │  │
│  │ [Photo] Nome         │  │
│  │         Ruolo        │  │
│  └──────────────────────┘  │
│  ┌──────────────────────┐  │
│  │ "Quote text..."      │  │
│  │                      │  │
│  │ [Photo] Nome         │  │
│  │         Ruolo        │  │
│  └──────────────────────┘  │
│  ...                       │
└────────────────────────────┘
```

---

## Interaction Patterns

### Language Toggle (IT/EN)

- **Mechanism**: JS swaps text content via `data-it` and `data-en` attributes on elements
- **Persistence**: Stores preference in `localStorage`
- **Default**: Italian (unless browser language is English)
- **Toggle position**: Always visible in header (IT | EN with active state highlighted)
- **Transition**: Instant text swap, no page reload

### Smooth Scroll Navigation

- Nav links scroll to corresponding section with smooth behavior
- Active section highlighted in nav (scroll spy)
- URL hash updates on scroll (e.g., `#servizi`)

### Press Logo Bar

- CSS `@keyframes` infinite horizontal scroll
- Pauses on hover (desktop)
- Touch-swipeable on mobile
- Logos: grayscale default, color on hover

### Mobile Menu

- Hamburger icon → full-screen overlay with fade-in animation
- Body scroll locked when menu is open
- Clicking a nav link closes menu + scrolls to section
- Close button (✕) in top-right

---

## Accessibility Considerations

- **Semantic HTML**: Proper heading hierarchy (h1 in hero, h2 for sections, h3 for sub-items)
- **ARIA labels**: Navigation landmarks, language toggle button, social links
- **Color contrast**: WCAG AA minimum (4.5:1 for body text, 3:1 for large text)
- **Keyboard navigation**: Tab through nav links, Enter to activate, skip-to-content link
- **Alt text**: All images have descriptive alt text (bilingual)
- **Focus indicators**: Visible focus rings on interactive elements
- **Reduced motion**: `prefers-reduced-motion` disables scroll animations and logo bar auto-scroll

---

## Design System Notes

### Typography
- **Headings**: Serif or warm sans-serif (e.g., Playfair Display, Lora, or DM Serif Display)
- **Body**: Clean sans-serif (e.g., Inter, DM Sans, or system fonts)
- **Sizes**: Mobile-first scale, fluid typography with `clamp()`

### Color Palette (Warm & Organic)
- **Primary**: Warm earth tone (terracotta, warm brown, or olive)
- **Accent**: Muted gold or warm orange (CTAs)
- **Background**: Off-white / warm cream (#FAF7F2 range)
- **Text**: Dark warm gray (#2D2A26 range)
- **Cards**: Slightly warmer white (#FFF8F0 range)
- **Hero overlay**: Dark gradient for text contrast

### Spacing
- **Section padding**: 80px top/bottom (desktop), 48px (mobile)
- **Container max-width**: 1200px, centered
- **Card gap**: 24px
- **Standard padding**: 16px (mobile), 24px (desktop)

### Icons
- Simple line icons for services (hand-drawn or organic style preferred)
- Social icons: Simple SVG outlines

---

## Open Questions & Notes

### For Implementation
- [ ] Source high-quality photos of Lunigiana, coworking space, community
- [ ] Confirm exact FAQ content (questions + answers)
- [ ] Confirm testimonial quotes and names
- [ ] Confirm social media profile URLs
- [ ] Confirm press article URLs for logo links
- [ ] Logo file (SVG preferred)
- [ ] Privacy/Cookie policy pages or links

### Design Decisions to Validate
- Hero: photo vs. slow video background (performance consideration)
- Exact color palette should be tested with real photography
- Number of testimonials to display (suggest 5-6)

---

## Next Steps

- [ ] Review UX with stakeholders
- [ ] Gather content (photos, testimonials, FAQ text, press logos)
- [ ] Proceed to `/plan:impl` for technical implementation plan
- [ ] Optionally run `/plan:prototype` for a clickable HTML prototype
