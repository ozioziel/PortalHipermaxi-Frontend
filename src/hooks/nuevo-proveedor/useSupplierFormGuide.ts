import { useCallback, useEffect, useMemo, useState } from 'react';

export interface SupplierFormGuideStep {
  id: string;
  selector: string;
  sectionIndex: number;
  title: string;
  message: string;
}

export interface GuideHighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SupplierFormGuideOptions {
  activeSectionIndex?: number;
  onSectionChange?: (sectionIndex: number) => void;
}

const supplierGuideSteps: SupplierFormGuideStep[] = [
  {
    id: 'general-data',
    selector: '[data-guide="supplier-general-data"]',
    sectionIndex: 0,
    title: 'Datos del proveedor',
    message: 'Primero complete los datos principales de la empresa proveedora.',
  },
  {
    id: 'nit',
    selector: '[data-guide="supplier-nit-input"], [data-tour="supplier-nit-input"]',
    sectionIndex: 0,
    title: 'NIT',
    message: 'El NIT permite identificar legalmente a la empresa proveedora.',
  },
  {
    id: 'systems-contact',
    selector: '[data-guide="supplier-systems"]',
    sectionIndex: 1,
    title: 'Encargado de Sistemas',
    message: 'Registre el contacto tecnico que coordinara el acceso inicial.',
  },
  {
    id: 'hub-contact',
    selector: '[data-guide="supplier-hub"]',
    sectionIndex: 1,
    title: 'Encargado HUB',
    message: 'El Encargado HUB es el contacto autorizado para recibir las credenciales del portal.',
  },
  {
    id: 'sales-contact',
    selector: '[data-guide="supplier-sales"]',
    sectionIndex: 1,
    title: 'Encargado Comercial',
    message: 'Agregue el contacto comercial o de ventas para el seguimiento con Hipermaxi.',
  },
  {
    id: 'provider-code',
    selector: '[data-guide="supplier-code"]',
    sectionIndex: 2,
    title: 'Codigo de proveedor',
    message: 'Ingrese el codigo proveedor relacionado con su empresa.',
  },
  {
    id: 'region',
    selector: '[data-guide="supplier-region"]',
    sectionIndex: 2,
    title: 'Region',
    message: 'Seleccione la region correspondiente a la operacion del proveedor.',
  },
  {
    id: 'summary',
    selector: '[data-guide="supplier-summary"], [data-tour="supplier-summary-section"]',
    sectionIndex: 3,
    title: 'Resumen',
    message: 'Revise los datos principales antes de enviar la solicitud.',
  },
  {
    id: 'submit',
    selector: '[data-guide="supplier-submit"], [data-tour="supplier-submit"]',
    sectionIndex: 3,
    title: 'Enviar solicitud',
    message: 'Cuando todos los datos esten completos, presione Enviar solicitud.',
  },
];

const hasSpeechSupport = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

const buildHighlightRect = (selector: string): GuideHighlightRect | null => {
  const targetElement = document.querySelector<HTMLElement>(selector);

  if (!targetElement) {
    return null;
  }

  const rect = targetElement.getBoundingClientRect();

  if (
    rect.width === 0 ||
    rect.height === 0 ||
    rect.bottom < 0 ||
    rect.top > window.innerHeight
  ) {
    return null;
  }

  return {
    top: Math.max(rect.top - 8, 8),
    left: Math.max(rect.left - 8, 8),
    width: Math.min(rect.width + 16, window.innerWidth - 16),
    height: Math.min(rect.height + 16, window.innerHeight - 16),
  };
};

const speakMessage = (message: string) => {
  if (!hasSpeechSupport()) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'es-ES';
  window.speechSynthesis.speak(utterance);
};

const waitForElement = async (selector: string, timeout = 1600): Promise<HTMLElement | null> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  const deadline = performance.now() + timeout;

  while (performance.now() < deadline) {
    const targetElement = document.querySelector<HTMLElement>(selector);
    if (targetElement && targetElement.offsetParent !== null) {
      return targetElement;
    }

    await new Promise((resolve) => window.requestAnimationFrame(resolve));
  }

  return null;
};

export const useSupplierFormGuide = ({
  activeSectionIndex = 0,
  onSectionChange,
}: SupplierFormGuideOptions = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<GuideHighlightRect | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => hasSpeechSupport());

  const currentStep = supplierGuideSteps[currentStepIndex] ?? null;
  const hasSpeech = useMemo(() => hasSpeechSupport(), []);

  const moveToGuideStep = useCallback(
    (nextStepIndex: number) => {
      const boundedIndex = Math.min(Math.max(nextStepIndex, 0), supplierGuideSteps.length - 1);
      const nextStep = supplierGuideSteps[boundedIndex];

      setHighlightRect(null);
      setCurrentStepIndex(boundedIndex);
      onSectionChange?.(nextStep.sectionIndex);
    },
    [onSectionChange],
  );

  const highlightElement = useCallback((selector: string) => {
    setHighlightRect(buildHighlightRect(selector));
  }, []);

  const beforeStepChange = useCallback(
    (step: SupplierFormGuideStep | null) => {
      if (!step || typeof onSectionChange !== 'function') {
        return;
      }

      if (step.sectionIndex !== activeSectionIndex) {
        onSectionChange(step.sectionIndex);
      }
    },
    [activeSectionIndex, onSectionChange],
  );

  useEffect(() => {
    if (!isOpen || !currentStep) {
      return;
    }

    let isCanceled = false;

    const syncStep = async () => {
      beforeStepChange(currentStep);
      setHighlightRect(null);

      const targetElement = await waitForElement(currentStep.selector);
      if (isCanceled) {
        return;
      }

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        window.setTimeout(() => {
          if (!isCanceled) {
            highlightElement(currentStep.selector);
          }
        }, 260);
      } else {
        setHighlightRect(null);
      }
    };

    void syncStep();

    const updateHighlight = () => {
      highlightElement(currentStep.selector);
    };

    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight, true);

    return () => {
      isCanceled = true;
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight, true);
    };
  }, [activeSectionIndex, beforeStepChange, currentStep, highlightElement, isOpen]);

  useEffect(() => {
    if (!isOpen || !currentStep || !isVoiceEnabled || !hasSpeech) {
      return;
    }

    speakMessage(currentStep.message);

    return () => {
      if (hasSpeech) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep, hasSpeech, isOpen, isVoiceEnabled]);

  useEffect(() => {
    return () => {
      if (hasSpeech) {
        window.speechSynthesis.cancel();
      }
    };
  }, [hasSpeech]);

  const openGuide = () => {
    window.dispatchEvent(new CustomEvent('support-chat:close'));
    moveToGuideStep(0);
    setIsOpen(true);
    onSectionChange?.(0);
  };

  const closeGuide = () => {
    setIsOpen(false);
    setHighlightRect(null);

    if (hasSpeech) {
      window.speechSynthesis.cancel();
    }
  };

  const goToStep = (stepIndex: number) => {
    moveToGuideStep(stepIndex);
  };

  const goToPreviousStep = () => {
    moveToGuideStep(currentStepIndex - 1);
  };

  const goToNextStep = () => {
    moveToGuideStep(currentStepIndex + 1);
  };

  const repeatVoice = () => {
    if (!currentStep || !hasSpeech) {
      return;
    }

    speakMessage(currentStep.message);
  };

  const toggleVoice = () => {
    setIsVoiceEnabled((previousValue) => {
      if (previousValue && hasSpeech) {
        window.speechSynthesis.cancel();
      }

      return !previousValue;
    });
  };

  return {
    isOpen,
    currentStep,
    currentStepIndex,
    totalSteps: supplierGuideSteps.length,
    highlightRect,
    isVoiceEnabled,
    hasSpeechSupport: hasSpeech,
    openGuide,
    closeGuide,
    goToPreviousStep,
    goToNextStep,
    goToStep,
    beforeStepChange,
    waitForElement,
    highlightElement,
    repeatVoice,
    toggleVoice,
  };
};

export default useSupplierFormGuide;
