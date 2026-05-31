import { useEffect, useState } from 'react';

export interface InvoiceGuideStep {
  target: string;
  title: string;
  message: string;
}

const getGuideSteps = (isObserved: boolean): InvoiceGuideStep[] => {
  const steps: InvoiceGuideStep[] = [
    {
      target: 'invoice-column',
      title: 'Columna Facturas',
      message:
        'Presiona aquí para abrir la carga de factura de esta Orden de Compra.',
    },
    {
      target: 'invoice-status',
      title: 'Estado de recepción',
      message:
        'Aquí puedes verificar si la factura está pendiente u observada.',
    },
    {
      target: 'invoice-browse',
      title: 'Seleccionar PDF',
      message: 'Selecciona tu factura en formato PDF.',
    },
    {
      target: 'invoice-upload-button',
      title: 'Cargar facturas',
      message: 'Presiona aquí para cargar la factura al sistema.',
    },
  ];

  if (isObserved) {
    steps.push({
      target: 'invoice-observations',
      title: 'Observaciones Hipermaxi',
      message:
        'Estas observaciones indican posibles diferencias entre la factura y la Orden de Compra.',
    });
  }

  return steps;
};

const cancelSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const useInvoiceGuide = (isObserved: boolean) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const speechSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const steps = getGuideSteps(isObserved);
  const safeStepIndex = Math.min(currentStepIndex, Math.max(steps.length - 1, 0));
  const currentStep = steps[safeStepIndex] ?? null;

  const speak = (text: string) => {
    if (!speechSupported) {
      return;
    }

    cancelSpeech();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  const startGuide = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
  };

  const exitGuide = () => {
    cancelSpeech();
    setIsActive(false);
  };

  const nextStep = () => {
    if (currentStepIndex >= steps.length - 1) {
      exitGuide();
      return;
    }

    setCurrentStepIndex((previousIndex) => previousIndex + 1);
  };

  const previousStep = () => {
    setCurrentStepIndex((previousIndex) =>
      previousIndex <= 0 ? 0 : previousIndex - 1,
    );
  };

  const repeatInstruction = () => {
    if (!currentStep) {
      return;
    }

    speak(currentStep.message);
  };

  const toggleVoice = () => {
    setVoiceEnabled((previousValue) => {
      const nextValue = !previousValue;
      if (!nextValue) {
        cancelSpeech();
      }
      return nextValue;
    });
  };

  useEffect(() => {
    if (!isActive || !currentStep || !voiceEnabled || !speechSupported) {
      return;
    }

    cancelSpeech();
    const utterance = new SpeechSynthesisUtterance(currentStep.message);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  }, [currentStep, isActive, speechSupported, voiceEnabled]);

  useEffect(
    () => () => {
      cancelSpeech();
    },
    [],
  );

  return {
    currentStep,
    currentStepIndex: safeStepIndex,
    exitGuide,
    isActive,
    nextStep,
    previousStep,
    repeatInstruction,
    speechSupported,
    startGuide,
    steps,
    toggleVoice,
    voiceEnabled,
  };
};

export default useInvoiceGuide;
