# Yonder – Design System

Yonder helps people find land and a prefab home in Portugal, guided by **Land AI** – a concise, expert advisor embedded in a chat-first workspace.

This document is the reference for tokens, components and voice. The visual sheet lives in `Yonder Design System.html` and the key screens live in `screens/`.

---

## 1. Principles

1. **Quiet surfaces.** The product is about *places*, not UI. Chrome stays out of the way; content (photos of land, maps, plots) carries the page.
2. **Advisor, not assistant.** Land AI writes like a good buyer's agent: short, specific, no filler, no emoji.
3. **One accent.** Coral (`--accent`) is used sparingly — verified marks, the AI icon, primary links, active states. Everything else is paper, ink, and warm grey.
4. **Panels over pages.** The app is a pair of floating white panels on a warm-grey canvas. Content scrolls inside a panel; the canvas itself never scrolls.
5. **Photographs do the heavy lifting.** Cards are small, flat, and let the imagery speak. No gradients, no drop shadows, no decorative SVG.

---

## 2. Color

```
--paper          #FFFFFF    panel background, input background
--canvas         #EEEEEA    warm light grey behind panels
--canvas-dark    #1B1B1B    status bar / device chrome only
--ink            #111111    primary text, titles
--ink-2          #3A3A38    body copy
--ink-3          #6B6B68    secondary, captions
--ink-4          #A6A6A1    meta, placeholders, dividers
--line           #E6E5DF    hairline borders between rows / panels
--line-2         #F1F0EC    subtle dividers inside cards
--accent         #E85D3A    coral — verified, Land AI, primary links
--accent-ink     #C54827    coral on hover / pressed
--accent-wash    #FCEDE7    coral tint for badges, filter-chip active bg
--success        #2E7D52    "Verified" pill text
--success-wash  #E6F1EA    "Verified" pill background
--warn           #8A6A1E    "Unverified" pill text
--warn-wash      #F1ECDB    "Unverified" pill background
```

**Usage rules**

- `--accent` never fills a large area. Max surface area per screen: ~2% (icons, pills, one link at a time).
- Body text is `--ink-2`, not pure black. Titles get `--ink`.
- Borders between panels and the canvas are **not** drawn — the warm grey gap around the panel *is* the border.

---

## 3. Type

System sans, tuned to feel like Helvetica Neue / SF Pro.

```
font-family: "Helvetica Neue", "Inter", -apple-system, system-ui, sans-serif;
```

Scale (px / line-height / weight / tracking):

| Token           | Size | LH   | Weight | Letter-spacing | Use                               |
|-----------------|------|------|--------|----------------|-----------------------------------|
| `display`       | 28   | 34   | 600    | -0.01em        | Panel title ("Home Project")      |
| `title`         | 20   | 26   | 600    | -0.005em       | Detail page name ("Rua Vale…")    |
| `section`       | 15   | 20   | 600    | 0              | "Details", "Utilities"            |
| `body`          | 15   | 22   | 400    | 0              | Chat text, descriptions           |
| `body-sm`       | 14   | 20   | 400    | 0              | Listing rows, attribute values    |
| `label`         | 13   | 16   | 500    | 0              | Tabs, buttons, chips              |
| `meta`          | 12   | 16   | 400    | 0              | Price, area, "Starting at"        |
| `eyebrow`       | 11   | 14   | 500    | 0.04em (upper) | Region above detail title         |

**No italic. No underline except focus ring. No drop caps.**

---

## 4. Spacing & Layout

4-point grid.

```
--s-1  4px
--s-2  8px
--s-3  12px
--s-4  16px
--s-5  20px
--s-6  24px
--s-8  32px
--s-10 40px
--s-12 48px
```

### Panels

- Radius: **12px**.
- Inner padding: **24px** top/sides, **24px** bottom (desktop); **16px** (mobile).
- Gap between panels: **8px**.
- Canvas padding around panels: **8px** on mobile, **16px** on desktop.

### Left rail (icon nav)

- Width: **40px** on mobile, **48px** on desktop.
- Hairline right divider (`--line`).
- Icons: 20×20, stroke 1.5, color `--ink-3`. Active icon is enclosed in an 28×28 rounded square with `--line-2` background.

---

## 5. Radii, borders, elevation

```
--r-sm   6px     chips, pills, filter tags
--r-md   10px    buttons, inline cards, event cards, listing thumbnails
--r-lg   12px    panels, attribute tiles, image gallery items
--r-full 999px   verified badge, user reply bubble, "Add to Chat"
```

**Borders:** always **1px** and always `--line`. Never doubled. Never colored.

**Elevation:** none. Do not add box-shadow anywhere. The panel-on-canvas gap is the only separator the UI needs.

---

## 6. Iconography

- Line icons, **1.5px stroke**, rounded caps and joins, 20×20 or 16×16.
- No filled icons except:
  - the **verified coral badge** (circle with white check, 16px)
  - the **Land AI mark** (4-point sparkle, coral, 16px)
- Attribute tiles use monoline icons at 16px in `--ink-3`.

---

## 7. Components

### 7.1 Panel
White surface with 12px radius. Lives directly on the canvas with an 8–16px gap. Scrolls internally.

### 7.2 Left rail
Vertical stack of 4 icons separated by 8px. Top icon is the verified coral badge (brand mark). Others: Land AI sparkle, Homes, Chat. Active state = `--line-2` rounded-square background behind the icon.

### 7.3 Chat message – Land AI
```
[coral verified badge 16]  Land AI
                           Body copy in --ink-2, 15/22, wraps naturally.
                           Multiple paragraphs stack with 8px gap.
```
No bubble. The badge + label is the only marker of speaker. Left-aligned, full panel width minus the 28px icon gutter.

### 7.4 Chat message – User
- Right-aligned.
- Pill shape, radius `--r-full`, padding `8px 14px`.
- Background `--canvas` (the same warm grey as the app canvas), text `--ink`.
- Max width: 75% of the chat column.
- No avatar.

### 7.5 Quick replies
Row of chip buttons under a Land AI message. Border `1px --line`, radius `--r-sm`, padding `6px 12px`, label 13/16 medium, `--ink-2`. Selected = `--accent-wash` background, `--accent` text, same border.

### 7.6 Event card – Listings result
Inline in chat. Horizontal:
- 56×56 rounded-md photo on the left
- Stack: title (body, 500), "Browse" link in coral (label)
- Full card has 1px `--line` border, radius `--r-md`, padding `10px 12px`

### 7.7 Event card – Land AI analysis (running)
Same frame. Replaces photo with a small animated coral dot (8px, pulsing). Title: "Analysing Rua Vale de Lagar". Sub: progress line e.g. "Checking zoning • utilities • flood risk".

### 7.8 Event card – Land report (summary)
Same frame, expandable. Collapsed shows plot name + 3 inline stats (e.g. `1,440m²  ·  Urban  ·  €80,000`). Tap opens the full detail page.

### 7.9 Event card – Prefab match
Same frame. 56×56 photo of the model, title = model name, meta = "2 bed · from €64,000", right-side "View" link in coral.

### 7.10 Event card – Realtor reply
Same frame. 28×28 round avatar, name + role ("Land Owner"), first line of reply truncated, right-side timestamp in `--ink-4`.

### 7.11 Listing row (listings panel)
- 64×48 rounded-md photo
- Region (eyebrow, `--ink-3`) above title (body, 500)
- Meta line: `{area}m² · Starting at €{price}`
- Right-aligned verification pill

### 7.12 Verification pill
Small pill, `--r-full`, `4px 8px`, 12/16. Two variants:
- **Verified** – check icon + text, `--success` on `--success-wash`
- **Unverified** – ring icon + text, `--warn` on `--warn-wash`

### 7.13 Tabs
Text labels separated by 20px, label token, `--ink-3` inactive, `--ink` active with a 2px `--ink` underline exactly under the text. Tabs live on the right side of a panel header, aligned to content.

### 7.14 Attribute tile (detail page)
2-column grid. Each cell:
- 16px monoline icon, `--ink-3`
- Label (meta, `--ink-3`) on first line
- Value (body-sm, `--ink`, 500) on second line
- Padding `12px 14px`, 1px `--line` border, radius `--r-lg`
- No background fill.

### 7.15 Primary button ("Add to Chat")
- Pill, `--r-full`, padding `8px 14px`, label 13/16 medium, white text on `--ink` background.
- Hover: `--ink-2`.
- There is only one primary button on screen at a time.

### 7.16 Secondary button / close
Circular 28px, `--canvas` background, `--ink-3` icon.

### 7.17 Filter chip (selected)
Pill, `--r-full`, 13/16 medium. Selected = `--accent-wash` bg, `--accent` text, 1px border `--accent-wash`. Unselected = `--paper` bg, `--ink-2` text, 1px `--line`.

### 7.18 Input / composer
- Radius `--r-lg`, 1px `--line`, padding `12px 14px`, `--paper` background.
- Placeholder `--ink-4`.
- Focus: border `--ink`. No glow.

---

## 8. Voice (Land AI)

**Concise. Expert. No pleasantries unless necessary.** One idea per message. Lead with the action or the answer, not the setup.

Good:
> Found 7 prefab homes from Moca and Tini Living that match minimalist, big windows, color. Browse →

Not Yonder:
> Hey there! 🎉 I'm so excited to help you find your dream home! Here are some amazing options I curated just for you!

**Rules**

- Never use "I'm excited / happy to / sure!". Drop greetings after the first turn.
- Numbers are specific: "1,440m²", "€80,000", never "around 1.5k sqm".
- Lists are short. Four bullets max, each under 10 words.
- Questions come one at a time. Never chain ("What's your budget and where and when…").
- No emoji.

---

## 9. Layout – the three screens

### Chat (mobile, full screen)
Single panel, full viewport minus 8px canvas gutter. Left rail 40px. Header `Home Project`. Chat column scrolls. Composer docked at bottom of the panel.

### Chat + Listings (desktop / tablet split)
Two panels side by side, 8px gap. Chat = 380px fixed. Listings = flex. Listings panel has its own header (tabs right-aligned) and a scrolling rail of listing rows.

### Land detail
Replaces the listings panel. Shows: eyebrow region, title, "Add to Chat" + close top right, 3-photo horizontal gallery (scrolls), area + price line, tabs, then the section content (Details grid + Utilities grid).

---

## 10. Motion

- Panel changes crossfade in **120ms**, no slide.
- Quick replies and filter selection: background transition **90ms** linear.
- Land AI "typing" = three 4px dots in `--ink-4`, pulsing 1.2s.
- Nothing bounces, nothing springs.
