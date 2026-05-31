import React, { useEffect, useState } from 'react';
import { HiperFlowApi } from '../../support/services/HiperFlowApi';

interface FrequentQuestionsTableProps {
  items?: any[];
  fallbackItems?: any[];
}

const FrequentQuestionsTable: React.FC<FrequentQuestionsTableProps> = ({ items, fallbackItems = [] }) => {
  const [questions, setQuestions] = useState<any[]>(items ?? []);

  useEffect(() => {
    if (items) {
      setQuestions(items);
      return;
    }

    const load = async () => {
      try {
        const data = await HiperFlowApi.getFrequentQuestions();
        setQuestions(data || fallbackItems);
      } catch {
        setQuestions(fallbackItems);
      }
    };
    void load();
  }, [items, fallbackItems]);

  return (
    <div style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Pregunta</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Veces</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Última</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Módulo</th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 12, color: 'var(--text-muted)' }}>
                No hay datos disponibles.
              </td>
            </tr>
          ) : (
            questions.map((it: any, idx: number) => (
              <tr key={`${it.question}-${idx}`}>
                <td style={{ padding: 8 }}>{it.question}</td>
                <td style={{ padding: 8 }}>{it.count}</td>
                <td style={{ padding: 8 }}>{it.lastAsked}</td>
                <td style={{ padding: 8 }}>{it.module}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FrequentQuestionsTable;
