import { clamp, getZone, scoreToPoint, arcPath } from '../components/utils';

describe('clamp', () => {
  it('returns value within range unchanged', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });
  it('clamps below min to min', () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });
  it('clamps above max to max', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });
  it('returns exact min boundary', () => {
    expect(clamp(0, 0, 100)).toBe(0);
  });
  it('returns exact max boundary', () => {
    expect(clamp(100, 0, 100)).toBe(100);
  });
});

describe('getZone', () => {
  it('score 0 → At Risk', () => {
    expect(getZone(0).label).toBe('At Risk');
  });
  it('score 20 → At Risk (boundary)', () => {
    expect(getZone(20).label).toBe('At Risk');
  });
  it('score 21 → Average (boundary)', () => {
    expect(getZone(21).label).toBe('Average');
  });
  it('score 50 → Average', () => {
    expect(getZone(50).label).toBe('Average');
  });
  it('score 75 → Average (boundary)', () => {
    expect(getZone(75).label).toBe('Average');
  });
  it('score 76 → Good (boundary)', () => {
    expect(getZone(76).label).toBe('Good');
  });
  it('score 100 → Good', () => {
    expect(getZone(100).label).toBe('Good');
  });
});

describe('scoreToPoint', () => {
  const CX = 60, CY = 55, R = 45;
  it('score 0 → leftmost point', () => {
    const pt = scoreToPoint(0, CX, CY, R);
    expect(pt.x).toBeCloseTo(15, 0);
    expect(pt.y).toBeCloseTo(55, 0);
  });
  it('score 100 → rightmost point', () => {
    const pt = scoreToPoint(100, CX, CY, R);
    expect(pt.x).toBeCloseTo(105, 0);
    expect(pt.y).toBeCloseTo(55, 0);
  });
  it('score 50 → topmost point', () => {
    const pt = scoreToPoint(50, CX, CY, R);
    expect(pt.x).toBeCloseTo(60, 0);
    expect(pt.y).toBeCloseTo(10, 0);
  });
});

describe('arcPath', () => {
  it('returns SVG path string starting with M', () => {
    expect(arcPath(0, 50, 60, 55, 45)).toMatch(/^M /);
  });
  it('contains arc command A with correct radius', () => {
    expect(arcPath(0, 50, 60, 55, 45)).toContain('A 45,45');
  });
  it('uses sweep-flag 0 for counterclockwise arc', () => {
    expect(arcPath(0, 50, 60, 55, 45)).toMatch(/0,0/);
  });
});
