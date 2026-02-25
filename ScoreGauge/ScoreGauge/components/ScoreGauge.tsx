import * as React from 'react';
import { ZONES, clamp, getZone, scoreToPoint, arcPath } from './utils';
import './ScoreGauge.css';

const CX = 60;
const CY = 55;
const R  = 45;

export interface ScoreGaugeProps {
  score: number | null | undefined;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const displayScore =
    score == null ? null : clamp(Math.round(score), 0, 100);
  const effectiveScore = displayScore ?? 0;
  const zone = getZone(effectiveScore);

  const ariaLabel =
    displayScore == null
      ? 'Score: Not yet calculated'
      : `Account score: ${displayScore} out of 100 — ${zone.label}`;

  const needleTip = scoreToPoint(effectiveScore, CX, CY, R - 8);

  return (
    <div className="score-gauge-container">
      <svg
        viewBox="0 0 120 70"
        width="120"
        height="70"
        role="img"
        aria-label={ariaLabel}
        className="score-gauge-svg"
      >
        {/* Background arc — split into two 90° halves to avoid a degenerate 180° path */}
        <path d={arcPath(0,  50, CX, CY, R)} fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="butt" />
        <path d={arcPath(50, 100, CX, CY, R)} fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="butt" />

        {/* Color zone arcs */}
        {ZONES.map((z) => (
          <path
            key={z.label}
            d={arcPath(z.min, z.max, CX, CY, R)}
            fill="none"
            stroke={z.color}
            strokeWidth="8"
            strokeLinecap="butt"
          />
        ))}

        {/* Needle */}
        <line
          x1={CX}
          y1={CY}
          x2={parseFloat(needleTip.x.toFixed(2))}
          y2={parseFloat(needleTip.y.toFixed(2))}
          stroke="#2D3748"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Center pivot dot */}
        <circle cx={CX} cy={CY} r="3" fill="#2D3748" />

        {/* Numeric score */}
        <text
          x={CX}
          y={CY + 12}
          textAnchor="middle"
          fontSize="11"
          fontWeight="bold"
          fill="#2D3748"
        >
          {displayScore != null ? displayScore : '—'}
        </text>
      </svg>

      {/* Visually hidden text for screen readers that don't parse SVG ARIA */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};
