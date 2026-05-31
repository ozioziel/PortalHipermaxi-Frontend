import React, { useEffect, useState } from 'react';
import type { ProductFormState, SupportChatResponse } from '../types';
import { HiperFlowApi } from '../services/HiperFlowApi';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface Props {
  formState: ProductFormState;
  guideActive: boolean;
  onStartGuide: () => void;
  onValidationRequested: () => void;
  onDebugUpdate: (response: SupportChatResponse, question: string) => void;
}

const SupportAgentWidget: React.FC<Props> = ({
  formState,
  guideActive,
  onStartGuide,
  onValidationRequested,
  onDebugUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola. Puedo validar el formulario, explicar campos o iniciar una guia paso a paso.',
    },
  ]);

  useEffect(() => {
    if (guideActive) setOpen(false);
  }, [guideActive]);

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

  return (
    <div className="support-widget">
      <button
        className="support-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Cerrar ayuda' : 'Abrir ayuda con IA'}
      >
        {open ? 'Cerrar' : 'Ayuda con IA'}
      </button>

      {open && (
        <section className="support-panel">
          <div className="support-header">
            <strong>SupportAgent</strong>
            <button className="btn btn-white" onClick={onStartGuide}>
              Guia
            </button>
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
      )}
    </div>
  );
};

export default SupportAgentWidget;
