export const ZONES = [
  { min: 0,  max: 20,  color: '#C53030', label: 'At Risk'  },
  { min: 21, max: 75,  color: '#B7791F', label: 'Average'  },
  { min: 76, max: 100, color: '#276749', label: 'Good'     },
] as const;

export type Zone = typeof ZONES[number];

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getZone(score: number): Zone {
  if (score <= 20) return ZONES[0];  // At Risk: 0–20
  if (score <= 75) return ZONES[1];  // Average: 21–75
  return ZONES[2];                    // Good: 76–100
}

/**
 * Converts a score (0–100) to an x,y point on the gauge arc.
 * Score 0  → leftmost point  (9 o'clock)
 * Score 50 → topmost point   (12 o'clock)
 * Score 100→ rightmost point (3 o'clock)
 */
export function scoreToPoint(
  score: number,
  cx: number,
  cy: number,
  r: number
): { x: number; y: number } {
  const s = clamp(score, 0, 100);
  const angle = Math.PI * (1 - s / 100);
  return {
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  };
}

/**
 * Builds an SVG arc path from startScore to endScore along the gauge arc.
 * sweep-flag=0 (counterclockwise in SVG) produces the upward arc through the top.
 *
 * WARNING: Do not call with startScore=0 and endScore=100 simultaneously —
 * a 180° arc is geometrically degenerate and some renderers may draw a straight
 * line or the wrong semicircle. Split into two calls (e.g. 0→50 and 50→100) instead.
 */
export function arcPath(
  startScore: number,
  endScore: number,
  cx: number,
  cy: number,
  r: number
): string {
  const start = scoreToPoint(startScore, cx, cy, r);
  const end   = scoreToPoint(endScore,   cx, cy, r);
  return `M ${start.x.toFixed(2)},${start.y.toFixed(2)} A ${r},${r} 0 0,0 ${end.x.toFixed(2)},${end.y.toFixed(2)}`;
}
