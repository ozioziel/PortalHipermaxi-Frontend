import React, { useEffect, useState } from 'react';
import type { InteractionLog, SupportChatResponse, ValidationResult } from '../types';
import { HiperFlowApi } from '../services/HiperFlowApi';

interface Props {
  lastQuestion: string;
  lastResponse: SupportChatResponse | null;
  validationResult: ValidationResult | null;
}

const HiperFlowDebugPanel: React.FC<Props> = ({ lastQuestion, lastResponse, validationResult }) => {
  const [open, setOpen] = useState(false);
  const [interactions, setInteractions] = useState<InteractionLog[]>([]);

  useEffect(() => {
    if (!open) return undefined;

    const load = () => {
      void HiperFlowApi.getInteractions().then(setInteractions).catch(() => setInteractions([]));
    };

    load();
    const timer = window.setInterval(load, 2500);
    return () => window.clearInterval(timer);
  }, [open]);

  return (
    <div className="debug-shell">
      <button className="debug-toggle" onClick={() => setOpen((value) => !value)}>
        {open ? 'Ocultar debug' : 'Debug'}
      </button>
      {open && (
        <aside className="debug-panel">
          <h3>HiperFlow Debug</h3>
          <dl>
            <dt>Ultima pregunta</dt>
            <dd>{lastQuestion || '-'}</dd>
            <dt>Intencion</dt>
            <dd>{lastResponse?.intent ?? '-'}</dd>
            <dt>Respuesta</dt>
            <dd>{lastResponse?.answer ?? '-'}</dd>
            <dt>Accion</dt>
            <dd>{lastResponse?.next_action ?? '-'}</dd>
            <dt>Validacion</dt>
            <dd>{validationResult ? validationResult.recommendation : '-'}</dd>
          </dl>

          <h4>Chunks RAG</h4>
          <ul>
            {(lastResponse?.sources ?? []).map((source) => (
              <li key={source.id}>{source.id} - {source.title}</li>
            ))}
          </ul>

          <h4>Historial</h4>
          <div className="debug-history">
            {interactions.map((interaction) => (
              <div className="debug-event" key={interaction.id}>
                <strong>{interaction.type}</strong>
                <span>{interaction.intent}</span>
                <p>{interaction.user_message || interaction.assistant_response}</p>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};

export default HiperFlowDebugPanel;
