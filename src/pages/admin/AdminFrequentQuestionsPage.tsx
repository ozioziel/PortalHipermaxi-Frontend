import React, { useEffect, useState } from 'react';
import { HiperFlowApi } from '../../features/support/services/HiperFlowApi';
import { mockFrequentQuestions } from '../../features/admin/data/mockAdminDashboard';

const AdminFrequentQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>(mockFrequentQuestions);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await HiperFlowApi.getFrequentQuestions();
        setQuestions(data?.length ? data : mockFrequentQuestions);
      } catch {
        setQuestions(mockFrequentQuestions);
      }
    };
    void load();
  }, []);

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>Preguntas frecuentes</h1>
      <p style={{ color: 'var(--text-muted)' }}>Consulta las preguntas más frecuentes realizadas al asistente IA.</p>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Pregunta</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Cantidad</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Módulo</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Última consulta</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 12, color: 'var(--text-muted)' }}>
                  No hay preguntas frecuentes.
                </td>
              </tr>
            ) : (
              questions.map((item: any, idx: number) => (
                <tr key={`${item.question}-${idx}`}>
                  <td style={{ padding: 8 }}>{item.question}</td>
                  <td style={{ padding: 8 }}>{item.count}</td>
                  <td style={{ padding: 8 }}>{item.module}</td>
                  <td style={{ padding: 8 }}>{item.lastAsked}</td>
                  <td style={{ padding: 8 }}>{item.category || item.state || 'General'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFrequentQuestionsPage;
