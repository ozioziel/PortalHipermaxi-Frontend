import React, { useEffect, useState } from 'react';
import { useRealtimeVoiceAssistant } from '../hooks/useRealtimeVoiceAssistant';
import { useSupportPanel } from '../features/support/SupportPanelContext';
import '../styles/assistant.css';

const statusText = {
  idle: 'Listo para iniciar',
  connecting: 'Conectando...',
  listening: 'Escuchando...',
  speaking: 'IA hablando...',
  error: 'Error de conexion',
};

const VoiceAssistantButton: React.FC = () => {
  const { status, start, stop } = useRealtimeVoiceAssistant();
  const { open: supportOpen } = useSupportPanel();
  const [guidedStepsActive, setGuidedStepsActive] = useState(false);
  const active = status !== 'idle' && status !== 'error';

  useEffect(() => {
    const showGuidedMode = () => setGuidedStepsActive(true);
    const hideGuidedMode = () => setGuidedStepsActive(false);

    window.addEventListener('assistant-guided-steps:start', showGuidedMode);
    window.addEventListener('assistant-guided-steps:end', hideGuidedMode);
    return () => {
      window.removeEventListener('assistant-guided-steps:start', showGuidedMode);
      window.removeEventListener('assistant-guided-steps:end', hideGuidedMode);
    };
  }, []);

  if (supportOpen || guidedStepsActive) {
    return null;
  }

  return (
    <div className="voice-assistant-shell">
      {active && (
        <div className="voice-assistant-panel active">
          <strong>{statusText[status]}</strong>
        </div>
      )}

      <button
        className={`voice-assistant-button ${active ? 'active' : ''}`}
        onClick={() => {
          if (active) stop();
          else void start();
        }}
        aria-label={active ? 'Detener IA' : 'Abrir asistente de voz'}
      >
        {active ? 'Detener IA' : 'Hablar con IA'}
      </button>
    </div>
  );
};

export default VoiceAssistantButton;
