# KNOT — Color Palette (with reasoning)

## Philosophy
Warm, grownup, editorial. Every color earns its place.
Should feel like **Aimé Leon Dore**, not **Glossier**. Like a small boutique studio.

---

## 🎨 NEUTRALS — the foundation (90% of the app)

### `bg-canvas` — `#F5F0E8`
**Why:** Off-white, slightly warmer than `#EDE8E2` (current). Pure white feels like Google Docs — this feels like linen paper. Softer on the eyes, more editorial. A backdrop that doesn't compete with content.

### `bg-surface` — `#FAF7F2`
**Why:** Cards need to be *lighter* than the canvas so they lift off visually — but still warm. Pure white cards on cream look harsh. This is the closest to white we'll ever get.

### `bg-muted` — `#EDE8E2`
**Why:** For subtle zones and section backgrounds. Creates quiet hierarchy without borders.

### `bg-sunken` — `#E5DED4`
**Why:** Input fields and pressed states. Slightly darker than canvas = the eye reads it as "indented," natural for form inputs.

### `border` — `#DDD4C6`
**Why:** Warm, not gray. Gray borders on a warm palette look like a bug. This matches.

---

## ✍️ TEXT — hierarchy

### `text-primary` — `#2D2420`
**Why:** Warm charcoal, not pure black. Pure black on cream looks harsh and "digital." This warm-undertone black belongs on warm paper. Still AAA contrast.

### `text-secondary` — `#5C5248`
**Why:** Labels, less important text. Same warm undertone, dimmed. Keeps the palette cohesive — no random gray sneaking in.

### `text-muted` — `#8A7F74`
**Why:** Metadata, timestamps, "3 hours ago." Still readable (AA) but recedes.

### `text-subtle` — `#B0A698`
**Why:** Placeholder text, disabled states. Quiet, doesn't demand attention.

---

## 🌿 PRIMARY — `#3A5A40` Forest Green

**Why this green specifically:**

- **Not lime/olive** — those read as "healthy startup," "kombucha," "wellness" — tired.
- **Not sage** — that's the color of every 2024 brand. Saturated out.
- **Deep forest** — reads as *grown up, established, confident*. Like a leather-bound book.
- **Ties to the name** — knots originated in nature (trees, ropes). A forest green is honest to that root.
- **Works with warm neutrals** — green is the complement of red; on cream it sings without fighting.
- **Gender-neutral** — not too masc, not too fem. KNOT is for both sides of the market.

### `primary-hover` — `#2D4632`
**Why:** Deeper shade on hover signals "pressed in." Lighter on hover = amateur mistake.

### `primary-light` — `#E8F0E9`
**Why:** Primary badges need a background that hints at green without being bold. This tint works as pill backgrounds.

---

## 🌾 SECONDARY — `#C9A878` Warm Sand

**Why:**
- **Earthy gold** — conjures linen, old books, terracotta tiles
- **Warmth partner to the forest green** — they're natural neighbors (trees + sand)
- **Used sparingly** — for verified badges, featured items. Exactly the places where "premium trust" matters
- **Not yellow** — yellow is warning/caution. Sand is luxury.

---

## 🧡 ACCENT — `#C2614C` Clay

**Why:**
- **The one pop color** — celebrations, "new" pills, emphasis moments
- **Not red** — red = error/alert
- **Not coral** — coral is 2018 startup
- **Clay** = terracotta pottery, sunset, Moroccan rugs. Editorial.
- **Why only one pop:** Every additional accent color dilutes the brand. Clay *earns* its moments. When you see clay, you know it means "something special."

---

## 🚦 SEMANTIC COLORS

### `success` — `#4A7C59`
**Why:** A brighter cousin of primary. Stays in the green family for cohesion, but lighter so "success" feels distinct from "default brand." No random mint-green that screams "Mailchimp."

### `error` — `#A84C3E`
**Why:** A deeper, muted red-brown — not a fire-truck red. Serious, not alarming. Matches the warm palette. Destructive buttons shouldn't look like they belong in a video game.

### `warning` — `#B8833A`
**Why:** Amber. Classic caution. Slightly desaturated so it doesn't scream.

### `info` — `#4A6B7C`
**Why:** Deep blue-slate. One touch of cool in an otherwise warm palette — used *only* for informational states, so it reads as "neutral information" instead of "brand color."

---

## 🗺 CATEGORY COLORS

**Why separate category colors:**
- Categories (food/beauty/fashion) need visual variety so users scan lists fast
- But using brand colors for categories dilutes the brand
- Solution: **muted, earth-tone pairs** — each with a bg + text color
- All stay in the warm/neutral family so the whole palette feels unified
- No bright primary on a category pill

| Category | Background | Text | Why |
|---|---|---|---|
| Food | `#F2E4D9` | `#8A5A3E` | Cinnamon — evokes warmth, restaurants |
| Beauty | `#F0E4EA` | `#7E4F66` | Dusty rose — feminine but not pink |
| Lifestyle | `#E8E4D4` | `#6E6344` | Olive-beige — neutral, everyday |
| Fashion | `#E4E1E8` | `#4F4A5E` | Lavender-gray — editorial |
| Fitness | `#E0E8E2` | `#3F6049` | Sage — outdoors, active |
| Events | `#F2E8D9` | `#8A6E3E` | Honey — celebratory |

---

## 💡 RULES (and why)

1. **No pure white** → looks digital, breaks the warm feel
2. **No pure black** → too harsh on cream, kills editorial mood
3. **Primary is dark, not light** → depth signals premium
4. **One accent only** → multiple pops = zero pops
5. **Text contrast AA+** → accessibility + readability
6. **Gradients used sparingly** → only for trust score + celebration, nowhere else
7. **Shadows are warm** → `rgba(45,36,32,0.06)` — pure black shadows break the warmth

---

## ❌ WHAT WE'RE REMOVING

| Removed color | Why |
|---|---|
| `#4ECDC4` teal | Too playful, screams "kids app," breaks editorial feel |
| `#FF6B6B` coral | Too loud, 2018 startup aesthetic |
| `#A5A58D` olive | The exact color the user called "tired" |
| `#FFB347` mustard | Off-brand, too cheerful |
| `#6B8F71` fresh green | Too lime-ish, not grownup enough |

---

## 📋 FULL CSS VARIABLES

```css
:root {
  /* Backgrounds */
  --bg-canvas: #F5F0E8;
  --bg-surface: #FAF7F2;
  --bg-muted: #EDE8E2;
  --bg-sunken: #E5DED4;
  --border: #DDD4C6;

  /* Text */
  --text-primary: #2D2420;
  --text-secondary: #5C5248;
  --text-muted: #8A7F74;
  --text-subtle: #B0A698;

  /* Brand */
  --primary: #3A5A40;
  --primary-hover: #2D4632;
  --primary-light: #E8F0E9;
  --primary-border: #B8CCBC;
  --secondary: #C9A878;
  --secondary-hover: #B89565;
  --secondary-light: #F4EADB;
  --accent: #C2614C;
  --accent-light: #F5E4DD;

  /* Semantic */
  --success: #4A7C59;
  --success-light: #E0ECE3;
  --error: #A84C3E;
  --error-light: #F2E0DC;
  --warning: #B8833A;
  --warning-light: #F5ECD9;
  --info: #4A6B7C;
  --info-light: #DDE6EC;

  /* Shadows (warm) */
  --shadow-sm: 0 1px 2px rgba(45, 36, 32, 0.05);
  --shadow-md: 0 4px 12px rgba(45, 36, 32, 0.08);
  --shadow-lg: 0 12px 32px rgba(45, 36, 32, 0.10);
}
```

---

## 🎯 THE LOGIC IN ONE SENTENCE

**A grown-up earth palette — forest + clay + sand on linen — where every color has a job and nothing is decorative.**
