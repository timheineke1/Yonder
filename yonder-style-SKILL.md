# Yonder design skill (canonical)

**Single source of truth for liveyonder.co / this repo.**  
Implementation lives in **`app/globals.css`** and **`app/page.tsx`**.  
When AI or humans add pages (e.g. `/deck`), use these tokens and patterns — not the older warm-paper spec in `yonder-style-SKILL (1).md`.

---

## Principles

- Cursor-inspired restraint: clear type, one orange accent for “product” emphasis, blue (`#3B82F6`) only for map/UI affordances where already used.
- Geist via `next/font` in `app/layout.tsx` (not a separate Google Fonts link).
- Cadastral grid motif: `.cadastral-grid`, `.cadastral-block`, `.cadastral-lines` in `globals.css`.

---

## CSS variables (`app/globals.css`)

| Token | Value | Use |
|--------|--------|-----|
| `--background` | `#F9F9F9` | Page background (not `#f2f0eb`) |
| `--foreground` | `#1a1a18` | Primary text |
| `--bg-card` | `#f0f0f0` | Screenshot strips, soft panels |
| `--muted` | `#6b6b68` | Secondary text |
| `--orange` | `#c84b0a` | Eyebrows, hover on nav links, spinners, land accent |
| `--accent` | `#3B82F6` | Map clusters, some UI chrome |
| `--text-hero` | `clamp(32px, 6vw, 48px)` | Hero (class `.text-hero`) |
| `--text-h2` | `clamp(22px, 3.2vw, 30px)` | Section titles (`.text-h2`) |
| `--text-eyebrow` | `10px` | Uppercase section labels |

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

Wordmark: `Yonder` — `text-[13px] font-semibold tracking-[0.06em] uppercase`.

---

## Navigation links (marketing)

- Product → `/#product`, For who → `/#who`, Coverage → `/#coverage`, Pricing → `/#pricing`
- `text-[13px] font-medium`, hover `text-[#c84b0a]`
- Right: Sign in (text link) + Get access (dark pill `bg-[#1a1a18]`)

---

## Buttons

- **Primary:** `rounded-full bg-[#1a1a18] text-white`, `text-[13px]`–`[14px] font-medium`
- **Secondary:** `rounded-full border border-black/[0.15] text-[#6b6b68]`, hover border/text darken

---

## Borders & cards

- Default border: `border-black/[0.08]` or `rgba(0,0,0,0.08)`
- Rounded sections: `rounded-[10px]` or `rounded-[12px]` for large shells
- Feature cells: `.cadastral-block` + `bg-[#F9F9F9]`

---

## Deck (`/deck`)

- **Not** the full marketing nav. Use `DeckHeader` only: cadastre logo → `/`, same **1152px** horizontal alignment as deck content. Optional: cadastral grid behind (`app/deck/page.tsx`).
- Body copy lives in `public/investor-deck.html`; CSS there must use the **same tokens** as this doc (`--text-hero`, `--text-h2`, `--bg`, `--surface`, `--ink`, `--muted`, `--orange`, Geist 15px/14px body). No warm paper (`#f2f0eb`) or landscape “painting” gradients behind UI mocks — use neutral `#f0f0f0` like the homepage screenshot strip.

---

## Deprecated

- **`yonder-style-SKILL (1).md`**: early spec with `#f2f0eb` / `#e8e6e1`. Do not use for new work; refer to this file + `globals.css` instead.
