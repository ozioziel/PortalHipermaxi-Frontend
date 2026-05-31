import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { runAssistantTurn } from '../agent/assistantAgent';
import type { OpenAiMessage } from '../agent/assistantApi';
import type { ChatMessage } from '../types/support.types';
import './supportChat.css';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hola, soy HiperBot 🤖 Puedo responder dudas del portal, llenarte campos del formulario, validarlo o llevarte a la sección que necesites. ¿En qué te ayudo?',
};

const uid = () => Math.random().toString(36).slice(2);

const SUGGESTIONS = [
  '¿Cómo cargo una factura?',
  'Llena la descripción con Aceite vegetal 1 litro',
  'Llévame a la sección de facturas',
];

export const SupportChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  // OpenAI-format conversation kept in parallel to the displayed messages.
  const convoRef = useRef<OpenAiMessage[]>([]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = async (textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { id: uid(), role: 'user', text }]);
    convoRef.current.push({ role: 'user', content: text });
    setInput('');
    setLoading(true);

    try {
      const { history, reply } = await runAssistantTurn(convoRef.current, navigate);
      convoRef.current = history;
      setMessages((prev) => [...prev, { id: uid(), role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          text: 'No pude conectar con el asistente. Verifica que el servicio esté activo o escribe a soportehub@hipermaxi.com.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <>
      <button
        className="support-fab"
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="support-panel" role="dialog" aria-label="Asistente de soporte">
          <div className="support-header">
            <span className="support-dot" />
            <div>
              <strong>HiperBot · Asistente</strong>
              <small>Hipermaxi</small>
            </div>
          </div>

          <div className="support-messages" ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`support-msg ${m.role}`}>
                <div className="support-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="support-msg assistant">
                <div className="support-bubble support-typing">Escribiendo…</div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="support-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="support-chip" onClick={() => void send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="support-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escribe tu mensaje…"
              rows={1}
            />
            <button onClick={() => void send()} disabled={loading || !input.trim()}>
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportChatWidget;
