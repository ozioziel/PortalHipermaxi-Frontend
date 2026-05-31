import React from 'react';
import type {
  GuideHighlightRect,
  SupplierFormGuideStep,
} from '../../hooks/nuevo-proveedor/useSupplierFormGuide';

interface SupplierFormGuideOverlayProps {
  isOpen: boolean;
  currentStep: SupplierFormGuideStep | null;
  currentStepIndex: number;
  totalSteps: number;
  highlightRect: GuideHighlightRect | null;
  isVoiceEnabled: boolean;
  hasSpeechSupport: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  onRepeatVoice: () => void;
  onToggleVoice: () => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const buildTooltipPosition = (
  highlightRect: GuideHighlightRect | null,
  tooltipWidth: number,
  tooltipHeight: number,
  viewportWidth: number,
  viewportHeight: number,
) => {
  if (!highlightRect) {
    return {
      left: clamp((viewportWidth - tooltipWidth) / 2, 16, viewportWidth - tooltipWidth - 16),
      top: 56,
    };
  }

  const hasRoomBelow = highlightRect.top + highlightRect.height + tooltipHeight + 20 <= viewportHeight;
  const hasRoomAbove = highlightRect.top - tooltipHeight - 20 >= 16;
  const besideRight = highlightRect.left + highlightRect.width + tooltipWidth + 20 <= viewportWidth;
  const besideLeft = highlightRect.left - tooltipWidth - 20 >= 16;

  if (hasRoomBelow) {
    return {
      left: clamp(highlightRect.left, 16, viewportWidth - tooltipWidth - 16),
      top: highlightRect.top + highlightRect.height + 16,
    };
  }

  if (besideRight) {
    return {
      left: highlightRect.left + highlightRect.width + 16,
      top: clamp(highlightRect.top, 16, viewportHeight - tooltipHeight - 16),
    };
  }

  if (besideLeft) {
    return {
      left: highlightRect.left - tooltipWidth - 16,
      top: clamp(highlightRect.top, 16, viewportHeight - tooltipHeight - 16),
    };
  }

  if (hasRoomAbove) {
    return {
      left: clamp(highlightRect.left, 16, viewportWidth - tooltipWidth - 16),
      top: highlightRect.top - tooltipHeight - 16,
    };
  }

  return {
    left: clamp((viewportWidth - tooltipWidth) / 2, 16, viewportWidth - tooltipWidth - 16),
    top: 16,
  };
};

export const SupplierFormGuideOverlay: React.FC<SupplierFormGuideOverlayProps> = ({
  isOpen,
  currentStep,
  currentStepIndex,
  totalSteps,
  highlightRect,
  isVoiceEnabled,
  hasSpeechSupport,
  onPrevious,
  onNext,
  onClose,
  onRepeatVoice,
  onToggleVoice,
}) => {
  if (!isOpen || !currentStep) {
    return null;
  }

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const tooltipWidth = Math.min(380, viewportWidth - 32);
  const tooltipMaxHeight = Math.max(260, viewportHeight - 32);
  const estimatedTooltipHeight = Math.min(360, tooltipMaxHeight);
  const tooltipPosition = buildTooltipPosition(
    highlightRect,
    tooltipWidth,
    estimatedTooltipHeight,
    viewportWidth,
    viewportHeight,
  );

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2300,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.64)',
          pointerEvents: 'none',
        }}
      />

      {highlightRect ? (
        <div
          style={{
            position: 'fixed',
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
            borderRadius: 12,
            border: '3px solid #f66014',
            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.96), 0 0 28px rgba(246, 96, 20, 0.7)',
            background: 'rgba(255, 255, 255, 0.04)',
            pointerEvents: 'none',
            zIndex: 2301,
          }}
        />
      ) : null}

      <aside
        style={{
          position: 'fixed',
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: tooltipWidth,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: tooltipMaxHeight,
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 18px 42px rgba(15, 23, 42, 0.28)',
          zIndex: 2302,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: 18, overflow: 'auto' }}>
          <span
            style={{
              display: 'inline-flex',
              padding: '6px 10px',
              borderRadius: 999,
              background: '#fff7ed',
              color: 'var(--hiper-orange-dark)',
              fontWeight: 700,
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            Paso {currentStepIndex + 1} de {totalSteps}
          </span>

          <h3 style={{ margin: '0 0 10px 0', fontSize: 20 }}>{currentStep.title}</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.55 }}>
            {currentStep.message}
          </p>

          {!hasSpeechSupport ? (
            <p style={{ margin: '12px 0 0 0', color: 'var(--text-muted)', fontSize: 13 }}>
              La sintesis de voz no esta disponible en este navegador.
            </p>
          ) : null}
        </div>

        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            padding: 12,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 10,
            background: '#ffffff',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={onRepeatVoice}
              disabled={!hasSpeechSupport}
            >
              Repetir voz
            </button>
            <button
              className="btn btn-secondary"
              onClick={onToggleVoice}
              disabled={!hasSpeechSupport}
            >
              {isVoiceEnabled ? 'Sin voz' : 'Con voz'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={onPrevious}
              disabled={currentStepIndex === 0}
            >
              Anterior
            </button>
            <button
              className="btn btn-primary"
              onClick={currentStepIndex === totalSteps - 1 ? onClose : onNext}
            >
              {currentStepIndex === totalSteps - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Salir
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SupplierFormGuideOverlay;
