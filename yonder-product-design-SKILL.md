# Yonder product design skill (homepage + explorer)

Use this when building or restyling **`/`** (marketing), **`/explorer`** (app), or any UI that should match the live homepage and the Land Agent reference (chat + map).

**Companion:** `yonder-style-SKILL.md` covers marketing-only details; this file adds **explorer / chat** patterns and ties both to **`app/globals.css`** + **`app/page.tsx`** + **`app/components/YonderExplorerAppInner.tsx`**.

---

## 1. Marketing homepage (`/`) — copy exactly

### Shell
- **Page:** `relative min-h-screen bg-[#F9F9F9] text-[#1a1a18] font-sans overflow-x-hidden`
- **Grid:** `cadastral-grid fixed inset-0 -z-20 opacity-[0.12] pointer-events-none`
- **Content width:** `max-w-6xl` · horizontal padding `px-5 sm:px-6 lg:px-12`

### Typography
- **Font:** Geist only (`next/font` in `app/layout.tsx`, CSS `var(--font-geist-sans)`).
- **Hero:** class `.text-hero` → `--text-hero` from `globals.css`
- **Body:** `15px`, secondary `#6b6b68`
- **Nav wordmark:** `text-[13px] font-semibold tracking-[0.06em] uppercase` — `Yonder`

### Logo (2×2 cadastre)
- **Container:** `h-5 w-5`, `rounded-[4px]`, `bg-[#1a1a18]`, `gap-[1px]` grid
- **Tiles:** TL `#ffffff` · TR `#4a4a4a` · BL `#a8a8a8` · BR **`#c84b0a`** (brand orange)

### Nav (`SiteNav`)
- **Bar:** `sticky top-0 z-[100] border-b border-black/[0.08] bg-[#F9F9F9]`, inner `h-14 max-w-6xl`
- **Links:** `text-[13px] font-medium`, hover **`text-[#c84b0a]`**
- **Primary CTA:** `rounded-full bg-[#1a1a18] text-white` — “Get access” / “Search land”
- **Secondary:** `rounded-full border border-black/[0.15] text-[#6b6b68]`

### Buttons & borders (global tokens)
- **Default border:** `border-black/[0.08]` or `rgba(0,0,0,0.08)`
- **Large shells:** `rounded-[12px]`
- **Orange accent** (`--orange` / `#c84b0a`): marketing emphasis, spinners in mocks, **not** the primary map/chat blue in the app

### Hero mock window (“Yonder — Land Agent”)
- **Strip:** `rounded-[12px] bg-[#f0f0f0]`, optional `cadastral-lines`
- **Window:** `bg-white`, shadow `0_8px_48px_rgba(0,0,0,0.12)`
- **Titlebar:** `bg-[#fafafa]`, `border-b border-black/[0.08]`, traffic dots, centered grey title
- **Split:** chat column `border-r`, sidebar/list areas **`#F5F5F5`** and **`#ffffff`** as in `app/page.tsx`

---

## 2. Explorer app (`/explorer`) — mostly white, blue, tinted cards

### Principles
- **Backgrounds:** **`#ffffff`** main surfaces; chrome bars **`#fafafa`** (homepage titlebar parity). Map canvas stays light neutral (e.g. `#eef2f6`).
- **Text:** **`#1a1a18`** primary, **`#6b6b68`** / **`#888888`** secondary — same family as homepage.
- **Blue (`#3B82F6` / `#3b82f6`):** map clusters, cadastre/active UI, chat dots/progress, links in analysis — **sparse, intentional**.
- **Brand orange (`#c84b0a`):** rail logo BR tile only; **do not** replace system blue on map/chat with orange.
- **Black CTAs:** high-impact actions (e.g. “Select plots” pattern) → **`#1a1a18`** fill, white label.

### Chat / analysis cards
Use **rounded ~12px**, **light borders**, **no heavy shadows** — airy, reference-quality.

| Role | Background | Border (approx.) | Text |
|------|------------|------------------|------|
| **Positive / success** | `#ecfdf5` (mint) | `rgba(16, 185, 129, 0.22)` | Green family `#065f46` / existing `GREEN` |
| **Caution / flag** | `#fffbeb` (amber) | `rgba(245, 158, 11, 0.28)` | `#92400e` |
| **Neutral / “consider” / soft note** | `#fdf2f8` (blush) | `rgba(236, 72, 153, 0.22)` | keep muted ink |
| **Good match / blue analysis** | `#eff6ff` | `rgba(59, 130, 246, 0.2)` | existing blue accent |

- **Thinking / streaming assistant panel:** very light mint shell `#f0fdf4` + soft green border — still reads as “home” white field, not a heavy panel.
- **User bubble:** **`#1a1a18`** background, white text (homepage primary button invert).

### Map
- **Basemap:** Flat light grey (`#e8eaed`) with a slightly lighter Portugal silhouette — see `PortugalMap` SVG in `YonderExplorerAppInner.tsx`.
- **Listings:** Clusters + price tags use **match-score colour** (same as old pins): **≥85** strong green (`#16a34a`), **70–84** blue (`#2563eb`), **&lt;70** muted grey (`#6b6b68`). Clusters take the **max** score in the group; singles show a **left accent + small score** beside the price.
- Floating controls: white + light border; primary chrome matches homepage.

### Implementation map
- **Tokens:** `.yonder-explorer-page` in `app/globals.css` (`--explorer-*`, chat-friendly overrides).
- **Chat + verdict UI:** `YonderExplorerAppInner.tsx` — `VerdictMessage`, thinking bubbles, signal rows, `StepTracker` (green/blue rows already aligned).
- **Rail logo:** same 2×2 as SiteNav (orange BR square).

---

## 3. CSS variables (reference)

Root marketing tokens live in **`globals.css`** `:root` (`--background`, `--foreground`, `--orange`, `--accent`, etc.). Explorer overrides in **`.yonder-explorer-page`** — keep `--foreground` / `--border-default` consistent with homepage unless a surface must be pure white.

---

## 4. What *not* to do

- No second “homepage” route — only **`/`** + **`/explorer`**.
- No warm-paper legacy (`#f2f0eb`) for primary surfaces; use **`#F9F9F9`** / **`#fafafa`** / **`#ffffff`** per above.
- Do not mix orange as the primary **in-app** accent where blue is defined for map/chat (orange stays **marketing + rail logo**).

---

*When in doubt, match **`app/page.tsx`** hero + mock window pixel-for-pixel for marketing; match **`YonderExplorerAppInner` chat column + map toolbar** for the app.*
