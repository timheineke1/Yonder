# Yonder design skill (canonical)

**Single source of truth for liveyonder.co / this repo — marketing site (`/`).**  
Implementation lives in **`app/globals.css`** and **`app/page.tsx`**.  
For **`/explorer`** (chat, map, cards), add **`yonder-product-design-SKILL.md`** — same brand, extended in-app tokens.

When AI or humans add pages (e.g. `/deck`), use these tokens and patterns — not the older warm-paper spec in `yonder-style-SKILL (1).md`.

---

## Principles

- Cursor-inspired restraint: clear type, one orange accent for “product” emphasis, blue (`#3B82F6`) only for map/UI affordances where already used.
- Geist via `next/font` in `app/layout.tsx` (not a separate Google Fonts link).
- Cadastral grid motif: `.cadastral-grid`, `.cadastral-block`, `.cadastral-lines` in `globals.css`.

---

## CSS variables (`app/globals.css`)

### Colour / surface (unchanged)

| Token | Value | Use |
|--------|--------|-----|
| `--background` | `#F9F9F9` | Page background (not `#f2f0eb`) |
| `--foreground` | `#1a1a18` | Primary text |
| `--bg-card` | `#f0f0f0` | Screenshot strips, soft panels |
| `--muted` | `#6b6b68` | Secondary text |
| `--orange` | `#c84b0a` | Eyebrows, hover on nav links, spinners, land accent |
| `--accent` | `#3B82F6` | Map clusters, some UI chrome |

### Typography — canonical ramp (`--type-*`, rem)

**One system.** Use CSS vars or Tailwind utilities from `@theme` (e.g. `text-body`, `text-nav`). Legacy `--text-*` names alias to `--type-*` for older snippets.

| Role | CSS variable | Tailwind (when applicable) | Typical use |
|------|----------------|-----------------------------|-------------|
| Hero | `--type-hero` | `text-hero` | Marketing hero (also `.text-hero`) |
| Section H2 | `--type-h2` | `text-h2` | Section titles (also `.text-h2`) |
| Large UI / stat display | `--type-display` | `text-display` | Big numerals, modals |
| Title / H4-scale | `--type-title` | `text-title` | Sub-hero headings |
| H3 / page titles | `--type-h3` | `text-h3` | Page titles, pricing row labels |
| Lead / emphasis | `--type-lead` | `text-lead` | Stats, strong listing lines |
| Body (marketing) | `--type-body` | `text-body` | Marketing body, explorer `TC.title` |
| Body small | `--type-body-sm` | `text-body-sm` | Secondary marketing |
| Nav / meta / mono T | `--type-nav` | `text-nav` | Site nav, 13px meta |
| App body (dense) | `--type-app-body` | `text-app-body` | Explorer chat + list primary |
| App secondary | `--type-app-secondary` | `text-app-secondary` | Explorer secondary lines |
| Caption / chips | `--type-caption` | `text-caption` | Filters, chips, `TC.label` |
| Mono small | `--type-mono-sm` | `text-mono-sm` | IDs, refs in-app |
| Overline / eyebrow | `--type-overline` | `text-overline` | Uppercase labels (~10px) |
| Micro / CAD | `--type-micro` | `text-micro` | Diagram annotations (~9px) |

**Density:** Marketing defaults to `--type-body` (15px). Explorer chat/lists use **`--type-app-body`** (13px) and **`--type-caption`** (11px) — same ramp, tighter step — via `TC` / `TP` in `YonderExplorerAppInner.tsx`.

---

## Layout shell (marketing + deck)

Use the same outer wrapper as the homepage:

```tsx
<div className="relative min-h-screen bg-[#F9F9F9] text-[#1a1a18] font-sans overflow-x-hidden">
  <div className="cadastral-grid fixed inset-0 -z-20 opacity-[0.12] pointer-events-none" aria-hidden />
  <SiteNav />
  {/* content */}
</div>
```

- Nav: `sticky top-0 z-[100] border-b border-black/[0.08] bg-[#F9F9F9]`, inner `max-w-6xl`, `h-14`, horizontal padding `px-5 sm:px-6 lg:px-12`.

---

## Logo

2×2 cadastre blocks in a rounded black square (`rounded-[4px]`, `h-5 w-5`, `gap-[1px]`):

- TL white · TR `#4a4a4a` · BL `#a8a8a8` · BR `#c84b0a`

Wordmark: `Yonder` — `text-nav font-semibold tracking-[0.06em] uppercase`.

---

## Navigation links (marketing)

- Product → `/#product`, For who → `/#who`, Coverage → `/#coverage`, Pricing → `/#pricing`
- `text-nav font-medium`, hover `text-[#c84b0a]`
- Right: Sign in (text link) + Get access (dark pill `bg-[#1a1a18]`)

---

## Buttons

- **Primary:** `rounded-full bg-[#1a1a18] text-white`, `text-nav` or `text-body-sm font-medium`
- **Secondary:** `rounded-full border border-black/[0.15] text-[#6b6b68]`, hover border/text darken

---

## Borders & cards

- Default border: `border-black/[0.08]` or `rgba(0,0,0,0.08)`
- Rounded sections: `rounded-[10px]` or `rounded-[12px]` for large shells
- Feature cells: `.cadastral-block` + `bg-[#F9F9F9]`

---

## Deck (`/deck`)

- **Not** the full marketing nav. Use `DeckHeader` only: cadastre logo → `/`, same **1152px** horizontal alignment as deck content. Optional: cadastral grid behind (`app/deck/page.tsx`).
- Body copy lives in `public/investor-deck.html`; CSS there must use the **same tokens** as this doc (`--type-hero`, `--type-h2`, `--type-body`, `--type-body-sm`, `--bg`, `--surface`, `--ink`, `--muted`, `--orange`, Geist). No warm paper (`#f2f0eb`) or landscape “painting” gradients behind UI mocks — use neutral `#f0f0f0` like the homepage screenshot strip.

---

## Deprecated

- **`yonder-style-SKILL (1).md`**: early spec with `#f2f0eb` / `#e8e6e1`. Do not use for new work; refer to this file + `globals.css` instead.
