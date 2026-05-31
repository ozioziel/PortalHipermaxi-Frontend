import { useEffect, useState } from 'react';

export interface SupplierFormGuideStep {
  id: string;
  selector: string;
  title: string;
  message: string;
}

export interface GuideHighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const supplierGuideSteps: SupplierFormGuideStep[] = [
  {
    id: 'general-data',
    selector: '[data-guide="supplier-general-data"]',
    title: 'Datos del proveedor',
    message: 'Primero complete los datos principales de la empresa proveedora.',
  },
  {
    id: 'nit',
    selector: '[data-guide="supplier-nit"]',
    title: 'NIT',
    message: 'El NIT permite identificar legalmente a la empresa proveedora.',
  },
  {
    id: 'hub-contact',
    selector: '[data-guide="supplier-hub"]',
    title: 'Encargado HUB',
    message: 'El Encargado HUB es el contacto autorizado para recibir las credenciales del portal.',
  },
  {
    id: 'provider-code',
    selector: '[data-guide="supplier-code"]',
    title: 'Codigo proveedor',
    message: 'Ingrese el código proveedor relacionado con su empresa.',
  },
  {
    id: 'region',
    selector: '[data-guide="supplier-region"]',
    title: 'Region',
    message: 'Seleccione la región correspondiente a la operación del proveedor.',
  },
  {
    id: 'submit',
    selector: '[data-guide="supplier-submit"]',
    title: 'Enviar solicitud',
    message: 'Cuando todos los datos estén completos, presione Enviar solicitud.',
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

export const useSupplierFormGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<GuideHighlightRect | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => hasSpeechSupport());

  const currentStep = supplierGuideSteps[currentStepIndex] ?? null;

  useEffect(() => {
    if (!isOpen || !currentStep) {
      return;
    }

    const updateHighlight = () => {
      setHighlightRect(buildHighlightRect(currentStep.selector));
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight, true);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight, true);
    };
  }, [currentStep, isOpen]);

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
  };

  const closeGuide = () => {
    setIsOpen(false);
    setHighlightRect(null);

    if (hasSpeechSupport()) {
      window.speechSynthesis.cancel();
    }
  };

  const goToPreviousStep = () => {
    setCurrentStepIndex((previousStep) => Math.max(previousStep - 1, 0));
  };

  const goToNextStep = () => {
    setCurrentStepIndex((previousStep) =>
      Math.min(previousStep + 1, supplierGuideSteps.length - 1),
    );
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
    repeatVoice,
    toggleVoice,
  };
};

export default useSupplierFormGuide;
