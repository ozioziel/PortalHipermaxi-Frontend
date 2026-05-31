import React from 'react';
import type {AvdGuideStep} from '../../hooks/avd/useAvdGuide';

interface AvdGuideOverlayProps {
  currentStep: AvdGuideStep | null;
  currentStepIndex: number;
  highlightRect: DOMRect | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRepeatVoice: () => void;
  onToggleVoice: () => void;
  totalSteps: number;
  voiceEnabled: boolean;
}

const AvdGuideOverlay: React.FC<AvdGuideOverlayProps> = ({
  currentStep,
  currentStepIndex,
  highlightRect,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onRepeatVoice,
  onToggleVoice,
  totalSteps,
  voiceEnabled,
}) => {
  if (!isOpen || !currentStep) {
    return null;
  }

  const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 720 : window.innerHeight;
  const tooltipWidth = Math.min(360, viewportWidth - 32);
  const tooltipMaxHeight = Math.max(280, viewportHeight - 32);
  const estimatedTooltipHeight = Math.min(330, tooltipMaxHeight);

  const tooltipLeft = highlightRect
    ? Math.min(Math.max(16, highlightRect.left), viewportWidth - tooltipWidth - 16)
    : Math.max((viewportWidth - tooltipWidth) / 2, 16);

  const tooltipTop = highlightRect
    ? highlightRect.bottom + 18 + estimatedTooltipHeight < viewportHeight
      ? highlightRect.bottom + 22
      : Math.max(16, Math.min(highlightRect.top - estimatedTooltipHeight - 18, viewportHeight - estimatedTooltipHeight - 16))
    : Math.max((viewportHeight - estimatedTooltipHeight) / 2, 16);

  return (
    <div style={{position: 'fixed', inset: 0, zIndex: 1600, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.72)'}} />

      {highlightRect && (
        <div
          style={{
            position: 'fixed',
            top: Math.max(highlightRect.top - 8, 8),
            left: Math.max(highlightRect.left - 8, 8),
            width: Math.min(highlightRect.width + 16, viewportWidth - 16),
            height: Math.min(highlightRect.height + 16, viewportHeight - 16),
            borderRadius: 14,
            border: '2px solid #fb7185',
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.72)',
            background: 'transparent',
          }}
        />
      )}

      <div
        style={{
          position: 'fixed',
          top: tooltipTop,
          left: tooltipLeft,
          width: tooltipWidth,
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.35)',
          padding: 18,
          pointerEvents: 'auto',
          maxHeight: tooltipMaxHeight,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexShrink: 0}}>
          <div>
            <div style={{fontSize: 12, color: '#64748b'}}>Guia AVD</div>
            <strong>{`Paso ${currentStepIndex + 1} de ${totalSteps}`}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
            }}
          >
            Salir
          </button>
        </div>

        <div style={{overflow: 'auto', paddingRight: 2}}>
          <p style={{margin: 0, color: '#334155', lineHeight: 1.5}}>{currentStep.message}</p>
        </div>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14, flexShrink: 0}}>
          <button
            type="button"
            onClick={onToggleVoice}
            style={{
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#334155',
              borderRadius: 8,
              padding: '8px 10px',
              cursor: 'pointer',
            }}
          >
            {voiceEnabled ? 'Voz activada' : 'Voz desactivada'}
          </button>
          <button
            type="button"
            onClick={onRepeatVoice}
            style={{
              border: '1px solid #94a3b8',
              background: '#ffffff',
              color: '#1e293b',
              borderRadius: 8,
              padding: '8px 10px',
              cursor: 'pointer',
            }}
          >
            Repetir voz
          </button>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 16, flexShrink: 0}}>
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentStepIndex === 0}
            style={{
              border: '1px solid #cbd5e1',
              background: currentStepIndex === 0 ? '#f8fafc' : '#ffffff',
              color: currentStepIndex === 0 ? '#94a3b8' : '#334155',
              borderRadius: 8,
              padding: '9px 12px',
              cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={currentStepIndex === totalSteps - 1 ? onClose : onNext}
            style={{
              border: '1px solid #f97316',
              background: '#f97316',
              color: '#ffffff',
              borderRadius: 8,
              padding: '9px 14px',
              cursor: 'pointer',
            }}
          >
            {currentStepIndex === totalSteps - 1 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvdGuideOverlay;
