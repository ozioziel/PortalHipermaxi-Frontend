import React, { useEffect, useMemo, useState } from 'react';
import type { GuideResponse } from '../types';
import { HiperFlowApi } from '../services/HiperFlowApi';
import { VoiceService } from '../services/VoiceService';
import GuideSpotlight from './GuideSpotlight';
import GuideTooltip from './GuideTooltip';
import '../support.css';

interface Props {
  active: boolean;
  guide: GuideResponse | null;
  onClose: () => void;
}

const GuideOverlay: React.FC<Props> = ({ active, guide, onClose }) => {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const step = guide?.steps[index] ?? null;
  const missingElement = useMemo(() => active && !rect, [active, rect]);

  useEffect(() => {
    setIndex(0);
  }, [guide?.title]);

  useEffect(() => {
    if (!active) {
      setRect(null);
      VoiceService.cancel();
    }
  }, [active]);

  useEffect(() => {
    if (!active || !step) return undefined;

    const updateRect = () => {
      const element = document.querySelector(step.selector);

      if (!element) {
        setRect(null);
        return;
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      window.setTimeout(() => {
        setRect(element.getBoundingClientRect());
      }, 260);
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    void HiperFlowApi.logInteraction({
      process: 'registro_producto',
      type: 'guide_step',
      user_message: `Paso ${step.step}`,
      assistant_response: step.message,
      intent: 'GUIDE_STEP',
      confidence: 1,
      action_taken: 'SHOW_STEP',
      metadata: { step },
    }).catch(() => undefined);

    if (voiceEnabled) {
      const played = VoiceService.speak(step.voice_text);
      void HiperFlowApi.logInteraction({
        process: 'registro_producto',
        type: 'voice',
        user_message: `Paso ${step.step}`,
        assistant_response: step.voice_text,
        intent: played ? 'VOICE_PLAYED' : 'VOICE_UNAVAILABLE',
        confidence: 1,
        action_taken: played ? 'SPEAK' : 'SKIP',
        metadata: { step: step.step },
      }).catch(() => undefined);
    }

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [active, step, voiceEnabled]);

  if (!active || !guide || !step) return null;

  const close = () => {
    VoiceService.cancel();
    onClose();
  };

  const next = () => {
    setIndex((current) => Math.min(current + 1, guide.steps.length - 1));
  };

  const back = () => {
    setIndex((current) => Math.max(current - 1, 0));
  };

  const repeatVoice = () => {
    VoiceService.speak(step.voice_text);
  };

  return (
    <div className="guide-overlay" role="dialog" aria-modal="true">
      <GuideSpotlight rect={rect} />
      <GuideTooltip step={step} rect={rect} missingElement={missingElement}>
        <div className="guide-actions">
          <button className="btn btn-white" onClick={back} disabled={index === 0}>Anterior</button>
          <button className="btn btn-primary" onClick={next} disabled={index >= guide.steps.length - 1}>Siguiente</button>
          <button className="btn btn-white" onClick={repeatVoice}>Repetir voz</button>
          <button className="btn btn-white" onClick={() => setVoiceEnabled((value) => !value)}>
            {voiceEnabled ? 'Voz activa' : 'Voz apagada'}
          </button>
          <button className="btn btn-secondary" onClick={close}>Salir</button>
        </div>
      </GuideTooltip>
    </div>
  );
};

export default GuideOverlay;
