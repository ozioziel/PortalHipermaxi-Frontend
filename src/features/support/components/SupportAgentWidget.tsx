import React, { useEffect, useState } from 'react';
import type { ProductFormState, SupportChatResponse } from '../types';
import { HiperFlowApi } from '../services/HiperFlowApi';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formState: ProductFormState;
  guideActive: boolean;
  onStartGuide: () => void;
  onValidationRequested: () => void;
  onDebugUpdate: (response: SupportChatResponse, question: string) => void;
}

const SupportAgentWidget: React.FC<Props> = ({
  isOpen,
  onClose,
  formState,
  guideActive,
  onStartGuide,
  onValidationRequested,
  onDebugUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola. Puedo validar el formulario, explicar campos o iniciar una guía paso a paso.',
    },
  ]);

  useEffect(() => {
    if (guideActive) {
      onClose();
    }
  }, [guideActive, onClose]);

  const send = async () => {
    const question = text.trim();
    if (!question || loading) return;

    setText('');
    setLoading(true);
    setMessages((current) => [...current, { role: 'user', content: question }]);

    try {
      const response = await HiperFlowApi.chat(question, formState);
      setMessages((current) => [...current, { role: 'assistant', content: response.answer }]);
      onDebugUpdate(response, question);

      if (response.next_action === 'START_GUIDE') {
        onStartGuide();
      }
      if (response.next_action === 'VALIDATE_FORM') {
        onValidationRequested();
      }
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'No se pudo contactar al SupportAgent.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="support-widget" style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 90 }}>
      <section className="support-panel">
        <div className="support-header">
          <strong>SupportAgent</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-white" onClick={onStartGuide}>Guía</button>
            <button className="btn btn-white btn-small" onClick={onClose}>Cerrar</button>
          </div>
        </div>
        <div className="support-messages">
          {messages.map((message, index) => (
            <div className={`support-message ${message.role}`} key={`${message.role}-${index}`}>
              {message.content}
            </div>
          ))}
        </div>
        <div className="support-input-row">
          <input
            value={text}
            placeholder="Ej: No puedo guardar mi producto"
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void send();
            }}
          />
          <button className="btn btn-primary" disabled={loading} onClick={() => void send()}>
            Enviar
          </button>
        </div>
      </section>
    </div>
  );
};

export default SupportAgentWidget;
