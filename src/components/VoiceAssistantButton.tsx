import React from 'react';
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
  const { status, lastMessage, error, start, stop } = useRealtimeVoiceAssistant();
  const { open: supportOpen } = useSupportPanel();
  const active = status !== 'idle' && status !== 'error';

  if (supportOpen) {
    return null;
  }

  return (
    <div className="voice-assistant-shell">
      {active && (
        <div className="voice-assistant-panel active">
          <strong>{statusText[status]}</strong>
          {lastMessage && <span>{lastMessage}</span>}
          {error && <span className="voice-assistant-error">{error}</span>}
        </div>
      )}
      <button
        className={`voice-assistant-button ${active ? 'active' : ''}`}
        onClick={() => {
          if (active) stop();
          else void start();
        }}
      >
        {active ? 'Detener IA' : 'Hablar con IA'}
      </button>
    </div>
  );
};

export default VoiceAssistantButton;
