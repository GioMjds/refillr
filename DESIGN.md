---
name: Refillr
description: Fast local water refills and delivery tracking
colors:
  primary: "#087f74"
  foreground: "#1f3431"
  background: "#f9fcfb"
  secondary: "#e8f4f2"
  secondary-foreground: "#1e4642"
  muted: "#edf4f2"
  muted-foreground: "#55736f"
  accent: "#d6ede9"
  accent-foreground: "#19403c"
  destructive: "#dc2626"
  border: "#d2e2df"
  ring: "#087f74"
typography:
  headline:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-manrope), sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  sm: "calc(0.65rem * 0.6)"
  md: "calc(0.65rem * 0.8)"
  lg: "0.65rem"
  xl: "calc(0.65rem * 1.4)"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: Refillr

## 1. Overview

**Creative North Star: "The Civic Aqueduct"**

Refillr operates with the calm, unwavering reliability of essential public infrastructure. Ordering clean drinking water is a basic household necessity, not a luxury impulse purchase; the interface treats the user's task with quiet respect, crisp speed, and hygienic precision. Every surface is tuned for instant mobile comprehension, high information scent, and frictionless execution whether ordered from a sunlit doorway or dispatched from a moving delivery vehicle.

The system rejects decorative distraction, artificial urgency, and marketplace chaos. There are no flash-sale banners, gamified loyalty spinners, or generic SaaS decorative tropes. Instead, Refillr pairs deep mineral water tones with tactile, high-contrast typography and disciplined spatial rhythm.

**Key Characteristics:**
- **Hygienic Clarity**: Crisp mineral aqua accents against warm, glare-free surfaces.
- **Glanceable Hierarchy**: Instant legibility of order status, quantities, and delivery steps.
- **Thumb-Native Ergonomics**: Generous 44px+ touch targets optimized for single-handed mobile operation.
- **Frictionless Utility**: Streamlined inputs that guide the customer straight to confirmation in under 60 seconds.

## 2. Colors

A disciplined palette anchored in deep mineral aqua, dark riverbed green, and glare-resistant warm white.

### Primary
- **Deep Mineral Aqua** (`#087f74` / `oklch(0.52 0.105 176)`): Used exclusively for primary call-to-actions, active route progress indicators, selected navigation items, and focus indicators.

### Neutral
- **Mineral White Background** (`#f9fcfb` / `oklch(0.985 0.006 168)`): Base background providing clean clarity without harsh optical glare.
- **Dark Riverbed Foreground** (`#1f3431` / `oklch(0.25 0.035 183)`): Primary ink color for headings, titles, and high-priority data. Ensures >= 7:1 contrast.
- **Muted Slate Ink** (`#55736f` / `oklch(0.49 0.03 180)`): Secondary descriptions, timestamp labels, and supportive metadata. Maintains strict >= 4.5:1 contrast against light surfaces.
- **Soft Mineral Wash** (`#edf4f2` / `oklch(0.95 0.014 170)`): Neutral background for order cards, item summaries, and secondary chips.
- **Subtle Aqua Slate Border** (`#d2e2df` / `oklch(0.88 0.022 172)`): Crisp 1px structural division lines for cards, inputs, and section boundaries.

### Accent & Feedback
- **Fresh Aqua Tint** (`#d6ede9` / `oklch(0.91 0.045 173)`): Soft tint for active state pills, badge highlights, and subtle focus glows.
- **Alert Coral** (`#dc2626` / `oklch(0.58 0.22 27)`): High-contrast error indicators, destructive actions, and delivery exception alerts.

### Named Rules
**The Water Reserve Rule.** The primary aqua accent is reserved for primary actions, current selection, and critical status indicators. It is never used decoratively or on inactive surfaces.
**The Daylight Legibility Rule.** No body text or data label may fall below 4.5:1 contrast ratio against its resting background.

## 3. Typography

**Display / Heading Font:** Manrope (`var(--font-manrope), sans-serif`)
**Body Font:** Manrope (`var(--font-manrope), sans-serif`)
**Identifier / Technical Font:** Geist Mono (`var(--font-geist-mono), monospace`)

**Character:** Compact, geometric, and modern. Manrope provides geometric precision with warm open counters, while Geist Mono anchors order numbers, tracking hashes, and quantity metrics.

### Hierarchy
- **Headline** (Bold 700, `clamp(1.75rem, 3.5vw, 2.5rem)`, line-height 1.2, tracking -0.02em): Primary view headings and hero titles.
- **Title** (Semibold 600, `1.25rem` / 20px, line-height 1.35, tracking -0.01em): Section titles, order card headers, and summary labels.
- **Body** (Regular 400, `1rem` / 16px, line-height 1.5, normal tracking): Descriptive paragraphs, instructions, line length capped at 65ch.
- **Label** (Medium 500 / Semibold 600, `0.875rem` / 14px, line-height 1.25): Form field labels, navigation items, status badges, and button text.
- **Mono Identifier** (Regular 400, `0.8125rem` / 13px, tracking 0.02em): Tracking IDs (`#REF-8921`), timestamps, and phone numbers.

### Named Rules
**The No Shouting Rule.** Display letter-spacing must never drop below -0.03em. Never apply all-caps tracked styling to section intros or headings.

## 4. Elevation

Refillr uses tonal layering and crisp 1px strokes rather than heavy drop shadows. Surfaces rest flat against the mineral background, drawing boundary clarity from subtle background tone shifts and clean borders.

### Shadow Vocabulary
- **Resting Layer** (`none`): Standard cards, list items, and input containers rely strictly on 1px borders and soft surface fills.
- **Elevated Mobile Sheet** (`0 -4px 16px rgba(31, 52, 49, 0.08)`): Fixed bottom navigation bars and slide-up action sheets.
- **Floating Overlay** (`0 8px 24px rgba(31, 52, 49, 0.12)`): Modals, confirmation dialogs, and popover menus.

### Named Rules
**The Flat By Default Rule.** Resting cards and panels are flat. Shadows exist only to signify genuine z-axis elevation on sticky sheets and dialog backdrops.

## 5. Components

### Buttons
- **Shape:** Rounded rectangle with 0.52rem radius (`calc(var(--radius) * 0.8)`).
- **Primary:** Deep Aqua (`#087f74`) background, white text, 12px 24px padding, minimum 44px height. Active state scales subtly (98%).
- **Outline:** Transparent background, 1px Aqua Slate border (`#d2e2df`), Dark Riverbed text, hover background wash (`#edf4f2`).
- **Focus:** 2px ring offset with Primary Aqua outline.

### Cards / Containers
- **Corner Style:** Rounded 0.65rem (`var(--radius)`).
- **Background:** White (`#ffffff`) or Soft Wash (`#edf4f2`).
- **Border:** 1px solid Subtle Aqua Slate (`#d2e2df`).
- **Internal Padding:** 16px on mobile, 20px-24px on tablet/desktop.

### Inputs / Fields
- **Style:** 1px border (`#d2e2df`), White background, 0.52rem radius, 44px height for touch convenience.
- **Focus:** Border transitions to Primary Aqua (`#087f74`) with a 2px semi-transparent ring.
- **Placeholder:** Muted slate (`#55736f`) with guaranteed 4.5:1 contrast.

### Navigation
- **Desktop Header:** Sticky top bar, 64px height, subtle bottom border, clean logo mark, clear text links with active indicator pill.
- **Mobile Bottom Navigation:** Fixed bottom bar, 64px height, 3-column grid (Home, Orders, Track) with 44px touch targets and clear icon + text pairing.

## 6. Do's and Don'ts

### Do:
- **Do** maintain minimum 44x44px interactive tap zones across all customer and field staff interfaces.
- **Do** ensure all text and numerical indicators meet or exceed WCAG AA 4.5:1 contrast against their backdrop.
- **Do** test forms and order flows for one-handed mobile phone usage.
- **Do** use Geist Mono for order IDs, tracking codes, and operational status codes.
- **Do** respect `prefers-reduced-motion` with immediate non-animated state transitions.

### Don't:
- **Don't** use gradient text (`background-clip: text`) or decorative multi-stop gradients anywhere.
- **Don't** add uppercase tracked eyebrows (`01 · PROCESS`, `ABOUT`) above section headings.
- **Don't** use decorative glassmorphism or blurry frosted glass cards as structural content backgrounds.
- **Don't** combine a 1px border with an oversized blur shadow (`box-shadow >= 16px`) on cards or buttons.
- **Don't** use cards with excessive border-radius (`border-radius >= 24px`); keep radius disciplined at 0.52rem to 0.65rem.
- **Don't** add marketing popups, countdown timers, coupon widgets, or artificial urgency banners.
