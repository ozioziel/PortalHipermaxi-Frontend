import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { runAssistantTurn } from '../agent/assistantAgent';
import type { OpenAiMessage } from '../agent/assistantApi';
import { useSupportPanel } from '../SupportPanelContext';
import type { ChatMessage } from '../types/support.types';
import './supportChat.css';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Hola, soy Maxi. Puedo guiarte en el portal, señalar dónde hacer clic, ayudarte con formularios o llevarte a la sección que necesites. ¿En qué te ayudo?',
};

const uid = () => Math.random().toString(36).slice(2);

const SUGGESTIONS = [
  '¿Cómo cargo una factura?',
  'Guíame para registrar un nuevo producto',
  'Llévame a la sección de facturas',
  '¿Qué documentos necesito para registrarme?',
];

export const SupportChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const { open, setOpen } = useSupportPanel();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dockSide, setDockSide] = useState<'left' | 'right'>('right');
  const listRef = useRef<HTMLDivElement>(null);
  const dockResetRef = useRef<number | null>(null);
  // OpenAI-format conversation kept in parallel to the displayed messages.
  const convoRef = useRef<OpenAiMessage[]>([]);

  useEffect(() => {
    const onAssistantTarget = (event: Event) => {
      const detail = (event as CustomEvent<{ centerX?: number }>).detail;
      const targetCenter = detail?.centerX ?? window.innerWidth;
      setDockSide(targetCenter > window.innerWidth / 2 ? 'left' : 'right');

      if (dockResetRef.current) {
        window.clearTimeout(dockResetRef.current);
      }

      dockResetRef.current = window.setTimeout(() => {
        setDockSide('right');
      }, 7600);
    };

    const closeSupportChat = () => {
      setOpen(false);
    };

    window.addEventListener('assistant-ui-target', onAssistantTarget);
    window.addEventListener('support-chat:close', closeSupportChat);
    return () => {
      window.removeEventListener('assistant-ui-target', onAssistantTarget);
      window.removeEventListener('support-chat:close', closeSupportChat);
      if (dockResetRef.current) {
        window.clearTimeout(dockResetRef.current);
      }
    };
  }, [setOpen]);

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

  const clearChat = () => {
    setMessages([WELCOME]);
    convoRef.current = [];
    setInput('');
  };

  return (
    <>
      <button
        className={`support-fab support-fab--${dockSide}`}
        aria-label={open ? 'Cerrar asistente Maxi' : 'Abrir asistente Maxi'}
        onClick={() => setOpen((currentOpen) => {
          const nextOpen = !currentOpen;
          if (nextOpen) {
            window.dispatchEvent(new CustomEvent('support-chat:open'));
          }
          return nextOpen;
        })}
        title={open ? 'Cerrar asistente' : 'Hablar con Maxi'}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {open && (
        <div className={`support-panel support-panel--${dockSide}`} role="dialog" aria-label="Asistente Maxi">
          <div className="support-header">
            <span className="support-dot" />
            <div className="support-header-info">
              <strong>Maxi · Asistente</strong>
              <small>Hipermaxi Portal</small>
            </div>
            <button
              className="support-clear-btn"
              onClick={clearChat}
              title="Nueva conversación"
              aria-label="Limpiar conversación"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.31"/></svg>
            </button>
          </div>

          <div className="support-messages" ref={listRef}>
            {messages.map((m) => (
              <div key={m.id} className={`support-msg ${m.role}`}>
                <div className="support-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="support-msg assistant">
                <div className="support-bubble support-typing">
                  <span className="support-typing-dot" />
                  <span className="support-typing-dot" />
                  <span className="support-typing-dot" />
                </div>
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
              placeholder="Escribe tu consulta..."
              rows={1}
            />
            <button
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              aria-label="Enviar mensaje"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportChatWidget;
