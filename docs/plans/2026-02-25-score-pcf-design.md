# Score PCF Control — Design Document

**Date:** 2026-02-25
**Project:** LeadershipDemo — D365 CE Account Score Display

---

## Overview

A PCF field-level (bound) control that replaces the raw `novulis_score` number field on the Account form with a compact, colorful, ADA-compliant semicircular gauge dial.

---

## Architecture

- **Control type:** PCF field-level bound control, TypeScript + React
- **Binding:** `novulis_score` (Whole.None), read-only display
- **No writes:** `notifyOutputChanged` is never called

**File structure:**
```
ScoreGauge/
  ControlManifest.Input.xml
  index.ts
  components/
    ScoreGauge.tsx
    ScoreGauge.css
```

The PCF `index.ts` reads `novulis_score` from context and passes it as a prop to the `ScoreGauge` React component. On `updateView`, it re-renders with the current value.

---

## Visual Design

A compact SVG element (~120px wide × 70px tall): a 180° semicircular arc with three color zones and a rotating needle. The numeric score is displayed centered beneath the arc.

```
  ╭──────────────────╮
  │  [red][yel][grn] │   ← 180° arc, 3 color zones
  │        ↑         │   ← needle rotates 0° (left) to 180° (right)
  │       78         │   ← score number, bold
  ╰──────────────────╯
```

### Color Zones

| Zone   | Range  | Arc Span | Color     |
|--------|--------|----------|-----------|
| Red    | 0–20   | 36°      | `#C53030` |
| Yellow | 21–75  | 99°      | `#D69E2E` |
| Green  | 76–100 | 45°      | `#276749` |

- Colors are darkened from pure traffic-light hues to meet WCAG 2.1 AA contrast ratios against white/light backgrounds
- A light gray (`#E2E8F0`) background arc sits behind the zones for visual structure
- The needle is a thin line from the dial center, rotated proportionally: 0° = score 0 (far left), 180° = score 100 (far right)
- Score number is bold sans-serif, centered below the pivot, inheriting D365 form font

---

## ADA / Accessibility

- **ARIA:** SVG carries `role="img"` and a dynamic `aria-label`, e.g. `"Account score: 78 out of 100 — Good"`
- **Zone labels (screen reader only):** Red → "At Risk", Yellow → "Average", Green → "Good"
- **Visually-hidden span:** Repeats the aria-label message for assistive technologies that don't parse SVG ARIA
- **No color-only signaling:** The numeric score anchors meaning independently of color
- **Keyboard/focus:** Display-only; no interactive focus handling needed; host field retains normal D365 tab order

---

## Data Flow & PCF Lifecycle

- **`init`:** Mounts the React component with the initial score value from context
- **`updateView`:** Re-renders with the current score prop; no internal state required
- **Null handling:** If `novulis_score` is null/undefined, render dial at 0 with aria-label `"Score: Not yet calculated"`
- **Out-of-range handling:** Clamp values outside 0–100 to the nearest bound; no error thrown

### Manifest Property

```xml
<property name="novulis_score"
          display-name-key="Score"
          of-type="Whole.None"
          usage="bound"
          required="true" />
```

---

## Out of Scope

- Editing the score value via the control
- Tooltips or hover states
- Animations on value change (can be added later)
