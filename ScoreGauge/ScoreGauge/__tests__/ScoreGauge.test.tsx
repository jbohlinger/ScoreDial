import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScoreGauge } from '../components/ScoreGauge';

describe('ScoreGauge component', () => {
  it('shows Good zone for score 80', () => {
    render(<ScoreGauge score={80} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Account score: 80 out of 100 — Good'
    );
  });

  it('shows Average zone for score 50', () => {
    render(<ScoreGauge score={50} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Account score: 50 out of 100 — Average'
    );
  });

  it('shows At Risk zone for score 10', () => {
    render(<ScoreGauge score={10} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Account score: 10 out of 100 — At Risk'
    );
  });

  it('score 20 is At Risk (upper boundary)', () => {
    render(<ScoreGauge score={20} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Account score: 20 out of 100 — At Risk'
    );
  });

  it('score 21 is Average (lower boundary)', () => {
    render(<ScoreGauge score={21} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Account score: 21 out of 100 — Average'
    );
  });

  it('score 76 is Good (lower boundary)', () => {
    render(<ScoreGauge score={76} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Account score: 76 out of 100 — Good'
    );
  });

  it('shows Not yet calculated for null', () => {
    render(<ScoreGauge score={null} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Score: Not yet calculated'
    );
  });

  it('shows Not yet calculated for undefined', () => {
    render(<ScoreGauge score={undefined} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Score: Not yet calculated'
    );
  });

  it('clamps score 150 to 100', () => {
    render(<ScoreGauge score={150} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Account score: 100 out of 100 — Good'
    );
  });

  it('clamps score -5 to 0', () => {
    render(<ScoreGauge score={-5} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Account score: 0 out of 100 — At Risk'
    );
  });

  it('renders score number in SVG text element', () => {
    const { container } = render(<ScoreGauge score={78} />);
    expect(container.querySelector('text')?.textContent).toBe('78');
  });

  it('renders dash in SVG text for null score', () => {
    const { container } = render(<ScoreGauge score={null} />);
    expect(container.querySelector('text')?.textContent).toBe('—');
  });

  it('renders visually hidden span with aria label text', () => {
    const { container } = render(<ScoreGauge score={80} />);
    const span = container.querySelector('.sr-only');
    expect(span?.textContent).toBe('Account score: 80 out of 100 — Good');
  });
});
