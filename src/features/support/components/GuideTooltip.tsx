import React from 'react';
import type { ReactNode } from 'react';
import type { GuideStep } from '../types';

interface Props {
  step: GuideStep;
  rect: DOMRect | null;
  missingElement: boolean;
  children: ReactNode;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const GuideTooltip: React.FC<Props> = ({ step, rect, missingElement, children }) => {
  const margin = 16;
  const gap = 16;
  const width = Math.min(360, window.innerWidth - margin * 2);
  const estimatedHeight = 260;

  const position = (() => {
    if (!rect) {
      return { top: margin + 72, left: margin };
    }

    const rightRoom = window.innerWidth - rect.right;
    const leftRoom = rect.left;
    const bottomRoom = window.innerHeight - rect.bottom;

    if (rightRoom >= width + gap + margin) {
      return {
        top: clamp(rect.top, margin, window.innerHeight - estimatedHeight - margin),
        left: rect.right + gap,
      };
    }

    if (leftRoom >= width + gap + margin) {
      return {
        top: clamp(rect.top, margin, window.innerHeight - estimatedHeight - margin),
        left: rect.left - width - gap,
      };
    }

    if (bottomRoom >= estimatedHeight + gap + margin) {
      return {
        top: rect.bottom + gap,
        left: clamp(rect.left, margin, window.innerWidth - width - margin),
      };
    }

    return {
      top: clamp(rect.top - estimatedHeight - gap, margin, window.innerHeight - estimatedHeight - margin),
      left: clamp(rect.left, margin, window.innerWidth - width - margin),
    };
  })();

  return (
    <div className="guide-tooltip" style={{ ...position, width }}>
      <div className="guide-step-label">Paso {step.step}</div>
      <h3>{step.title}</h3>
      <p>{missingElement ? 'No encontre este elemento en la pantalla actual.' : step.message}</p>
      {step.example && <div className="guide-example">{step.example}</div>}
      {children}
    </div>
  );
};

export default GuideTooltip;
