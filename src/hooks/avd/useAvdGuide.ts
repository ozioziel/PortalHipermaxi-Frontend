import {useCallback, useEffect, useMemo, useState} from 'react';

export interface AvdGuideStep {
  selector: string;
  message: string;
}

const BASE_STEPS: AvdGuideStep[] = [
  {
    selector: '[data-guide="avd-header"]',
    message:
      'Aqui puedes revisar los datos principales de la Orden de Compra antes de generar el Aviso de Despacho.',
  },
  {
    selector: '[data-guide="avd-items-table"]',
    message:
      'Aqui se muestran los productos de la Orden de Compra, sus cantidades, precio unitario y subtotal.',
  },
  {
    selector: '[data-guide="dispatch-quantity"]',
    message:
      'Ingresa la cantidad que realmente vas a despachar. No debe superar la cantidad de la Orden de Compra.',
  },
  {
    selector: '[data-guide="copy-oc-quantity"]',
    message:
      'Puedes copiar automaticamente la cantidad de la Orden de Compra como cantidad despachada.',
  },
  {
    selector: '[data-guide="save-avd"]',
    message:
      'Presiona Guardar si quieres registrar el avance sin confirmar todavia el despacho.',
  },
  {
    selector: '[data-guide="confirm-avd"]',
    message:
      'Presiona Confirmar Despacho solo cuando estes seguro. Despues de confirmar, no podras modificar el AVD desde el portal.',
  },
];

const CONFIRMED_STEP: AvdGuideStep = {
  selector: '[data-guide="avd-restriction"]',
  message: 'Este AVD ya fue confirmado. El portal bloquea cualquier modificacion posterior.',
};

const canUseSpeechSynthesis = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
};

export const useAvdGuide = (isConfirmed: boolean) => {
  const steps = useMemo(() => {
    return isConfirmed ? [...BASE_STEPS, CONFIRMED_STEP] : BASE_STEPS;
  }, [isConfirmed]);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const safeStepIndex = Math.min(currentStepIndex, Math.max(steps.length - 1, 0));
  const currentStep = steps[safeStepIndex] ?? null;

  const stopSpeech = useCallback(() => {
    if (canUseSpeechSynthesis()) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!voiceEnabled || !canUseSpeechSynthesis()) {
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled],
  );

  const updateHighlight = useCallback(() => {
    if (!isGuideOpen || !currentStep || typeof document === 'undefined') {
      setHighlightRect(null);
      return;
    }

    const element = document.querySelector<HTMLElement>(currentStep.selector);
    if (!element) {
      setHighlightRect(null);
      return;
    }

    element.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'});
    setHighlightRect(element.getBoundingClientRect());
  }, [currentStep, isGuideOpen]);

  const startGuide = useCallback(() => {
    setCurrentStepIndex(0);
    setIsGuideOpen(true);
  }, []);

  const closeGuide = useCallback(() => {
    setIsGuideOpen(false);
    stopSpeech();
  }, [stopSpeech]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((currentIndex) => {
      if (currentIndex >= steps.length - 1) {
        return currentIndex;
      }

      return currentIndex + 1;
    });
  }, [steps.length]);

  const previousStep = useCallback(() => {
    setCurrentStepIndex((currentIndex) => {
      if (currentIndex <= 0) {
        return currentIndex;
      }

      return currentIndex - 1;
    });
  }, []);

  const repeatVoice = useCallback(() => {
    if (currentStep) {
      speak(currentStep.message);
    }
  }, [currentStep, speak]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((currentValue) => !currentValue);
  }, []);

  useEffect(() => {
    if (!isGuideOpen || !currentStep) {
      return undefined;
    }

    const syncHighlight = () => updateHighlight();
    const animationId = window.requestAnimationFrame(syncHighlight);
    window.addEventListener('resize', syncHighlight);
    window.addEventListener('scroll', syncHighlight, true);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', syncHighlight);
      window.removeEventListener('scroll', syncHighlight, true);
    };
  }, [currentStep, isGuideOpen, updateHighlight]);

  useEffect(() => {
    if (!isGuideOpen || !currentStep) {
      stopSpeech();
      return undefined;
    }

    speak(currentStep.message);
    return () => stopSpeech();
  }, [currentStep, isGuideOpen, speak, stopSpeech]);

  useEffect(() => {
    if (voiceEnabled) {
      return undefined;
    }

    stopSpeech();
    return undefined;
  }, [stopSpeech, voiceEnabled]);

  useEffect(() => {
    return () => stopSpeech();
  }, [stopSpeech]);

  return {
    currentStep,
    currentStepIndex: safeStepIndex,
    highlightRect,
    isGuideOpen,
    steps,
    voiceEnabled,
    closeGuide,
    nextStep,
    previousStep,
    repeatVoice,
    startGuide,
    toggleVoice,
  };
};
