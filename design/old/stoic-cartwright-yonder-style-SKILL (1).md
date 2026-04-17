# YONDER DESIGN SYSTEM — Style Skill (legacy draft)

> **Deprecated for implementation.** Use **`yonder-style-SKILL.md`** in this repo instead — it matches `app/globals.css` and the live site (`#F9F9F9`, shared nav, etc.).
>
> This file kept for history; early spec used warm paper (`#f2f0eb`) that the shipped site did not adopt.

---

## Overview

Yonder's homepage style is a direct clone of **cursor.com** — off-white background, dark text, Geist font, oil-painting landscape behind product screenshots, alternating feature rows, and orange as the only accent colour.

---

## Core Design Decisions

| Token | Value |
|---|---|
| Background | `#f2f0eb` — warm off-white, NOT pure white or dark |
| Card / section bg | `#e8e6e1` |
| Body text | `#1a1a18` — near-black charcoal |
| Muted text | `#6b6b68` |
| Border | `rgba(0,0,0,0.08)` |
| Orange accent | `#c84b0a` — used sparingly: links, spinners, badges, active states |
| Font | `Geist` (Google Fonts) — weights 400, 500, 600 |
| Border radius | `10px` cards, `999px` pills/buttons, `8px` app windows |

---

## Typography

```css
/* Hero headline */
font-size: clamp(28px, 4vw, 42px);
font-weight: 500;
letter-spacing: -0.02em;
line-height: 1.15;

/* Section headings */
font-size: clamp(22px, 3.5vw, 32px);
font-weight: 500;
letter-spacing: -0.015em;

/* Body / feature desc */
font-size: 14.5px;
color: #6b6b68;
line-height: 1.65;

/* Small labels / eyebrows */
font-size: 10–11px;
font-weight: 600;
letter-spacing: 0.08–0.1em;
text-transform: uppercase;
color: #c84b0a; /* orange */
```

---

## Navigation

Exact Cursor nav pattern:

```
[Logo mark] YONDER    |    Product  Who it's for  Pricing  Blog    |    Sign in  [Contact sales ○]  [Request access ●]
```

- Sticky, `border-bottom: 1px solid rgba(0,0,0,0.08)`
- Background: `#f2f0eb` with `backdrop-filter: blur(10px)` on scroll
- **Outline button**: `border: 1px solid rgba(0,0,0,0.22)`, transparent bg
- **Dark pill button**: `background: #1a1a18`, white text

---

## Buttons

```css
/* Primary dark pill — main CTA */
background: #1a1a18;
color: #fff;
border-radius: 999px;
padding: 12px 22px;
font-size: 14.5px;
font-weight: 500;

/* Outline pill — secondary */
background: transparent;
border: 1px solid rgba(0,0,0,0.22);
color: #1a1a18;
border-radius: 999px;
padding: 7px 16px;
```

---

## Hero

- Left-aligned, NOT centered
- Large headline, single dark pill CTA below it — nothing else
- Generous top padding: `72px`
- NO badge, NO subtitle — just headline + button (Cursor-style restraint)

---

## App Screenshot Block

The signature Cursor pattern — **landscape painting behind the product window**:

```css
/* Painting background — CSS approximation */
background:
  radial-gradient(ellipse at 30% 60%, rgba(180,160,110,0.35) 0%, transparent 55%),
  radial-gradient(ellipse at 70% 40%, rgba(140,160,130,0.3) 0%, transparent 50%),
  radial-gradient(ellipse at 50% 80%, rgba(100,120,90,0.25) 0%, transparent 40%),
  linear-gradient(180deg, rgba(190,185,165,0.4) 0%, rgba(160,175,150,0.3) 50%, rgba(130,145,120,0.35) 100%);
```

- App window: white bg, `border-radius: 8px 8px 0 0`, box-shadow
- Title bar: `#f0eeea`, 3 grey dots, centered title text in muted
- Window crops at bottom — doesn't have a rounded bottom
- Screenshot sits in a container with `padding: 36px 24px 0` — window bleeds off bottom

### App Window Inner Layout (3 columns)
1. **Sidebar** `210px` — `#f7f6f3`, sections with "IN PROGRESS / READY FOR REVIEW" labels
2. **Chat panel** — prompt box, action traces (Read `filename`), Thought Xs, response text, file chips
3. **Preview panel** — URL bar, content preview, data table

**Orange spinner**: `border-top-color: #c84b0a` on the in-progress items  
**Orange links in chat**: file references use `color: #c84b0a`

---

## Feature Rows (alternating)

Exact Cursor pattern — full-bleed sections alternating left/right:

```
[copy left]  [app screenshot right + painting bg]
[app screenshot left + painting bg]  [copy right]
```

```css
.feature-block {
  display: grid;
  grid-template-columns: 380px 1fr;
  min-height: 520px;
  background: #e8e6e1;
  border-top: 1px solid rgba(0,0,0,0.08);
}
```

- Copy sits at `justify-content: flex-end` (bottom of column)
- Title: 20px, weight 500
- Desc: 14.5px muted
- Link: orange, `font-weight: 500`
- Visual panel: painting bg (warm or cool variant) + app window inset from top-left

**Warm painting variant:**
```css
background:
  radial-gradient(ellipse at 40% 50%, rgba(195,175,130,0.5) 0%, transparent 60%),
  radial-gradient(ellipse at 75% 30%, rgba(150,170,140,0.4) 0%, transparent 50%),
  linear-gradient(160deg, rgba(200,190,160,0.6) 0%, rgba(160,175,150,0.4) 100%);
```

**Cool painting variant:**
```css
background:
  radial-gradient(ellipse at 60% 40%, rgba(140,160,150,0.5) 0%, transparent 55%),
  radial-gradient(ellipse at 30% 70%, rgba(160,175,130,0.4) 0%, transparent 50%),
  linear-gradient(160deg, rgba(170,180,165,0.5) 0%, rgba(145,160,145,0.4) 100%);
```

---

## Testimonials

- Section heading: `"The new way to find land."` — large, left-aligned
- 3×2 grid (or 3×1 on mobile)
- Unified border grid: `background: rgba(0,0,0,0.08)` on wrapper, each card `background: #f2f0eb`
- Card: quote text top, avatar + name/role bottom, `justify-content: space-between`
- Avatar: initials in a circle, no photo needed

---

## Feature Cards (Frontier grid)

3-col grid, each card has:
- Title + desc + orange link at top
- Mini product UI mockup at bottom (fills remaining space)
- Cards share a unified border grid (1px gap, same wrapper trick)

---

## Pricing

3 plans: Starter €29 / Pro €99 / Reports €499

- **Featured plan (Pro)**: `background: #1a1a18`, white text, white CTA button
- Other plans: `background: #f2f0eb`, outline CTA button
- Optional badge on featured: orange pill `"Most popular"`
- Footer note: `"2% agent fee, capped at €10,000"` — link in orange
- Unified border grid wrapper (same as testimonials)

---

## Yonder-specific Content

### Tagline
> "Built to make you extraordinarily fast at finding land."

### Eyebrow / live badge
> "Now live — Portugal & Spain · 12M+ plots indexed"

### Key data points
- 12M+ plots indexed
- 48h to first shortlist (vs. months manually)
- 94% constraint accuracy

### Coverage roadmap
| Market | Status |
|---|---|
| 🇵🇹 Portugal | Live |
| 🇪🇸 Spain | Live |
| 🇫🇷 France | 2025 |
| 🇮🇹 Italy | 2025 |
| 🇬🇷 Greece | 2026 |
| 🇳🇱 Netherlands | 2026 |
| 🇩🇪 Germany | TBD |

### ICP personas
1. Real estate investors & developers
2. Solar & energy developers
3. Agents & legal advisors
4. Agricultural & rural buyers
5. Land owners (sell-side)

### Pricing
| Plan | Price | Key features |
|---|---|---|
| Starter | €29/mo | 50 searches, basic constraints, PDF export |
| Pro | €99/mo | Unlimited, full constraints, Tracker, outreach tools |
| Reports | €499/mo | Deep intelligence reports, valuation, API, account manager |
| Enterprise | Custom | White-label, bulk data, custom integrations |
| Transaction | 2% (cap €10K) | Agent fee on closed deals |

### App UI sample queries
- `find rustic plots over 20ha near Évora, REN-clear, price under €1M`
- `solar sites over 50ha in Alentejo, grid distance under 5km`
- `identify brownfield plots reclassified in last 3 years, Lisbon region`

### Constraint terminology (in UI)
- **REN** — National Ecological Reserve (Reserva Ecológica Nacional)
- **RAN** — Agricultural Reserve (Reserva Agrícola Nacional)
- **AUGI** — Illegal/informal urban zones (Áreas Urbanas de Génese Ilegal)
- **PDM** — Municipal Master Plan (Plano Diretor Municipal)

---

## What NOT to do

- ❌ Dark/black background (that's the v2 dark variant — use light as default)
- ❌ Gold/amber accent — orange `#c84b0a` only
- ❌ Instrument Serif headlines — Geist only for Cursor clone style
- ❌ Centered hero layout
- ❌ Multiple CTA buttons in hero
- ❌ Glowing borders, gradients on text, neon effects
- ❌ Heavy use of badges, pills, and eyebrows — restraint is the point
- ❌ Inter, Roboto, or system fonts

---

## File history
| File | Description |
|---|---|
| `yonder-homepage-v2.html` | Dark/black Cursor-style variant |
| `yonder-homepage-v3.html` | Dark variant with all sections (pricing, who for, countries) |
| `yonder-homepage-v4.html` | ✅ **Current canonical** — light Cursor clone, full page |
