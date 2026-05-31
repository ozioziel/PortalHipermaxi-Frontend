import { useCallback, useEffect, useState } from 'react';

export interface SupplierFormGuideStep {
  id: string;
  selector: string;
  title: string;
  message: string;
  sectionIndex: number;
}

export interface GuideHighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface SupplierFormGuideOptions {
  activeSectionIndex: number;
  onSectionChange?: (sectionIndex: number) => void;
}

const supplierGuideSteps: SupplierFormGuideStep[] = [
  {
    id: 'general-name',
    selector: '[data-tour="supplier-name-input"]',
    title: 'Datos generales',
    message: 'Comience ingresando el nombre del proveedor.',
    sectionIndex: 0,
  },
  {
    id: 'general-nit',
    selector: '[data-tour="supplier-nit-input"]',
    title: 'NIT',
    message: 'El NIT permite identificar legalmente a la empresa proveedora.',
    sectionIndex: 0,
  },
  {
    id: 'general-next',
    selector: '[data-tour="next-button"]',
    title: 'Avanzar sección',
    message: 'Presione Siguiente para continuar a la sección de datos de contacto.',
    sectionIndex: 0,
  },
  {
    id: 'contact-section',
    selector: '[data-tour="supplier-contact-section"]',
    title: 'Datos de contacto',
    message: 'Aquí encontrará los contactos principales del proveedor.',
    sectionIndex: 1,
  },
  {
    id: 'hub-contact',
    selector: '[data-tour="supplier-hub-name-input"]',
    title: 'Encargado HUB',
    message: 'Ingrese el nombre del Encargado HUB, quien recibirá las credenciales.',
    sectionIndex: 1,
  },
  {
    id: 'documents-section',
    selector: '[data-tour="supplier-documents-section"]',
    title: 'Datos de catálogo',
    message: 'Revise la información de catálogo antes de enviar la solicitud.',
    sectionIndex: 2,
  },
  {
    id: 'documents-code',
    selector: '[data-tour="supplier-code-input"]',
    title: 'Código proveedor',
    message: 'Ingrese el código proveedor que vincula al proveedor con Hipermaxi.',
    sectionIndex: 2,
  },
  {
    id: 'submit',
    selector: '[data-tour="supplier-submit"]',
    title: 'Enviar solicitud',
    message: 'Cuando todos los datos estén completos, presione Enviar solicitud.',
    sectionIndex: 3,
  },
];

const hasSpeechSupport = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

const buildHighlightRect = (selector: string): GuideHighlightRect | null => {
  const targetElement = document.querySelector<HTMLElement>(selector);

  if (!targetElement) {
    return null;
  }

  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

  const rect = targetElement.getBoundingClientRect();

  return {
    top: Math.max(rect.top - 8, 8),
    left: Math.max(rect.left - 8, 8),
    width: rect.width + 16,
    height: rect.height + 16,
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

const waitForElement = async (selector: string, timeout = 1400): Promise<HTMLElement | null> => {
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
  activeSectionIndex,
  onSectionChange,
}: SupplierFormGuideOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<GuideHighlightRect | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => hasSpeechSupport());

  const currentStep = supplierGuideSteps[currentStepIndex] ?? null;

  const highlightElement = useCallback((selector: string) => {
    const rect = buildHighlightRect(selector);
    setHighlightRect(rect);
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
        highlightElement(currentStep.selector);
      } else {
        setHighlightRect(null);
      }
    };

    void syncStep();

    const updateHighlight = () => {
      if (!currentStep) {
        return;
      }
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
    if (!isOpen || !currentStep || !isVoiceEnabled || !hasSpeechSupport()) {
      return;
    }

    speakMessage(currentStep.message);

    return () => {
      if (hasSpeechSupport()) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep, isOpen, isVoiceEnabled]);

  useEffect(() => {
    return () => {
      if (hasSpeechSupport()) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const openGuide = () => {
    setCurrentStepIndex(0);
    setIsOpen(true);
    if (typeof onSectionChange === 'function') {
      onSectionChange(0);
    }
  };

  const closeGuide = () => {
    setIsOpen(false);
    setHighlightRect(null);

    if (hasSpeechSupport()) {
      window.speechSynthesis.cancel();
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStepIndex((previousStep) => {
      const nextIndex = Math.min(Math.max(stepIndex, 0), supplierGuideSteps.length - 1);
      return nextIndex;
    });
  };

  const goToPreviousStep = () => {
    goToStep(currentStepIndex - 1);
  };

  const goToNextStep = () => {
    goToStep(currentStepIndex + 1);
  };

  const repeatVoice = () => {
    if (!currentStep || !hasSpeechSupport()) {
      return;
    }

    speakMessage(currentStep.message);
  };

  const toggleVoice = () => {
    setIsVoiceEnabled((previousValue) => {
      if (previousValue && hasSpeechSupport()) {
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
    hasSpeechSupport: hasSpeechSupport(),
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
