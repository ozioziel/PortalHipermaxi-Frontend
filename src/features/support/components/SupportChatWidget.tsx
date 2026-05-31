import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../api/supportApi';
import type { ChatMessage } from '../types/support.types';
import './supportChat.css';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hola, soy el asistente del Portal de Proveedores. Puedo ayudarte a registrar un producto, resolver errores al guardar o responder dudas del portal. ¿En qué te ayudo?',
};

const uid = () => Math.random().toString(36).slice(2);

const SUGGESTIONS = [
  '¿Cómo solicito mis credenciales de acceso? Soy nuevo proveedor',
  '¿Qué formato debe tener la imagen del producto?',
  '¿Cómo registro un producto nuevo?',
];

export const SupportChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = async (textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: uid(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage({
        message: text,
        page: window.location.pathname,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          text: res.answer,
          sources: res.sources,
          source: res.answer_source,
          action: res.action,
        },
      ]);
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

  const goToAction = (route: string) => {
    setOpen(false);
    // The `?guide=1` flag tells the target page to auto-open its guide on mount.
    navigate(`${route}?guide=1`);
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
              <strong>Asistente de Proveedores</strong>
              <small>Hipermaxi</small>
            </div>
          </div>

          <div className="support-messages" ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`support-msg ${m.role}`}>
                <div className="support-bubble">{m.text}</div>
                {m.sources && m.sources.length > 0 && (
                  <div className="support-sources">
                    Fuentes: {m.sources.map((s) => s.id).filter(Boolean).join(', ')}
                  </div>
                )}
                {m.action && (
                  <button className="support-action" onClick={() => goToAction(m.action!.route)}>
                    {m.action.label} →
                  </button>
                )}
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
              placeholder="Escribe tu pregunta…"
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
