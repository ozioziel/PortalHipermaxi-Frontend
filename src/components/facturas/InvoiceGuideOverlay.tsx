import React, { useEffect, useState } from 'react';
import type { InvoiceGuideStep } from '../../hooks/facturas/useInvoiceGuide';

interface HighlightRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

interface InvoiceGuideOverlayProps {
  currentStep: InvoiceGuideStep | null;
  currentStepIndex: number;
  isActive: boolean;
  onExit: () => void;
  onNext: () => void;
  onPrevious: () => void;
  totalSteps: number;
}

const PADDING = 10;

const getTooltipPosition = (highlightRect: HighlightRect | null) => {
  if (!highlightRect) {
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  const tooltipWidth = Math.min(320, window.innerWidth - 32);
  const nextLeft = Math.min(
    Math.max(16, highlightRect.left),
    window.innerWidth - tooltipWidth - 16,
  );
  const spaceBelow =
    window.innerHeight - (highlightRect.top + highlightRect.height);
  const top =
    spaceBelow > 220
      ? highlightRect.top + highlightRect.height + 18
      : Math.max(16, highlightRect.top - 190);

  return {
    left: `${nextLeft}px`,
    top: `${top}px`,
    transform: 'none',
  };
};

const InvoiceGuideOverlay: React.FC<InvoiceGuideOverlayProps> = ({
  currentStep,
  currentStepIndex,
  isActive,
  onExit,
  onNext,
  onPrevious,
  totalSteps,
}) => {
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(
    null,
  );

  useEffect(() => {
    if (!isActive || !currentStep) {
      return;
    }

    const updateRect = () => {
      const target = document.querySelector(
        `[data-guide="${currentStep.target}"]`,
      );

      if (!(target instanceof HTMLElement)) {
        setHighlightRect(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      setHighlightRect({
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width,
      });
    };

    const scrollTarget = document.querySelector(
      `[data-guide="${currentStep.target}"]`,
    );

    if (scrollTarget instanceof HTMLElement) {
      scrollTarget.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }

    const animationId = window.requestAnimationFrame(updateRect);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [currentStep, isActive]);

  if (!isActive || !currentStep) {
    return null;
  }

  const tooltipPosition = getTooltipPosition(highlightRect);

  return (
    <div aria-live="polite" className="guide-overlay" role="presentation">
      <div className="guide-overlay__scrim" />

      {highlightRect ? (
        <div
          className="guide-overlay__highlight"
          style={{
            height: `${highlightRect.height + PADDING * 2}px`,
            left: `${highlightRect.left - PADDING}px`,
            top: `${highlightRect.top - PADDING}px`,
            width: `${highlightRect.width + PADDING * 2}px`,
          }}
        />
      ) : null}

      <div className="guide-overlay__tooltip" style={tooltipPosition}>
        <div className="guide-overlay__step">
          Paso {currentStepIndex + 1} de {totalSteps}
        </div>
        <div className="guide-overlay__title">{currentStep.title}</div>
        <p className="guide-overlay__message">{currentStep.message}</p>

        <div className="guide-overlay__actions">
          <button
            className="invoice-btn invoice-btn--secondary"
            disabled={currentStepIndex === 0}
            onClick={onPrevious}
            type="button"
          >
            Anterior
          </button>
          <button
            className="invoice-btn invoice-btn--secondary"
            onClick={onExit}
            type="button"
          >
            Salir
          </button>
          <button
            className="invoice-btn invoice-btn--primary"
            onClick={onNext}
            type="button"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGuideOverlay;
