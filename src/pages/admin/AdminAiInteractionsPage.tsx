import React, { useEffect, useState } from 'react';
import { HiperFlowApi } from '../../features/support/services/HiperFlowApi';
import { mockAiInteractions } from '../../features/admin/data/mockAdminDashboard';

const AdminAiInteractionsPage: React.FC = () => {
  const [records, setRecords] = useState<any[]>(mockAiInteractions);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await HiperFlowApi.getAiInteractions();
        setRecords(data?.length ? data : mockAiInteractions);
      } catch {
        setRecords(mockAiInteractions);
      }
    };
    void load();
  }, []);

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>Interacciones IA</h1>
      <p style={{ color: 'var(--text-muted)' }}>Revisa preguntas hechas al asistente y su estado de respuesta.</p>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Usuario</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Pregunta</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Resumen</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Módulo</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Estado</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 12, color: 'var(--text-muted)' }}>
                  No hay interacciones IA recientes.
                </td>
              </tr>
            ) : (
              records.map((item: any, idx: number) => (
                <tr key={`${item.userEmail}-${idx}`}>
                  <td style={{ padding: 8 }}>{item.userEmail}</td>
                  <td style={{ padding: 8 }}>{item.question}</td>
                  <td style={{ padding: 8 }}>{item.responseSummary}</td>
                  <td style={{ padding: 8 }}>{item.module}</td>
                  <td style={{ padding: 8 }}>{item.status}</td>
                  <td style={{ padding: 8 }}>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAiInteractionsPage;
