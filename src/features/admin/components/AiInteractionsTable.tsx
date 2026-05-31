import React from 'react';

const AiInteractionsTable: React.FC<{ items: any[] }> = ({ items }) => {
  return (
    <div style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Pregunta</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Módulo</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Usuario</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Estado</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 12, color: 'var(--text-muted)' }}>
                No hay interacciones de IA disponibles.
              </td>
            </tr>
          ) : (
            items.map((item: any, idx: number) => (
              <tr key={`${item.userEmail}-${idx}`}>
                <td style={{ padding: 8 }}>{item.question}</td>
                <td style={{ padding: 8 }}>{item.module}</td>
                <td style={{ padding: 8 }}>{item.userEmail}</td>
                <td style={{ padding: 8, textTransform: 'capitalize' }}>{item.status}</td>
                <td style={{ padding: 8 }}>{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AiInteractionsTable;
