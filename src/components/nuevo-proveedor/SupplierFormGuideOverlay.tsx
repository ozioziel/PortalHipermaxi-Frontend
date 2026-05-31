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
  const tooltipWidth = Math.min(360, viewportWidth - 32);

  const tooltipLeft = highlightRect
    ? clamp(highlightRect.left, 16, viewportWidth - tooltipWidth - 16)
    : 16;

  const tooltipTop = highlightRect
    ? highlightRect.top + highlightRect.height + 16 <= viewportHeight - 230
      ? highlightRect.top + highlightRect.height + 16
      : Math.max(16, highlightRect.top - 214)
    : 56;

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.62)',
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
            borderRadius: 14,
            border: '2px solid #f66014',
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.52)',
            background: 'transparent',
            pointerEvents: 'none',
            zIndex: 1001,
          }}
        />
      ) : null}

      <aside
        style={{
          position: 'fixed',
          top: tooltipTop,
          left: tooltipLeft,
          width: tooltipWidth,
          maxWidth: 'calc(100vw - 32px)',
          background: '#ffffff',
          borderRadius: 16,
          padding: 20,
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.24)',
          zIndex: 1002,
        }}
      >
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

        <h3 style={{ margin: '0 0 10px 0', fontSize: 22 }}>{currentStep.title}</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {currentStep.message}
        </p>

        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 18,
          }}
        >
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
            {isVoiceEnabled ? 'Desactivar voz' : 'Activar voz'}
          </button>
        </div>

        {!hasSpeechSupport ? (
          <p style={{ margin: '12px 0 0 0', color: 'var(--text-muted)', fontSize: 13 }}>
            La síntesis de voz no está disponible en este navegador.
          </p>
        ) : null}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            marginTop: 22,
          }}
        >
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
          </div>

          <button className="btn btn-secondary" onClick={onClose}>
            Salir
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SupplierFormGuideOverlay;
