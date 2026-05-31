import React from 'react';

const RecentActivityTable: React.FC<{ items: any[] }> = ({ items }) => {
  return (
    <div style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Usuario</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Módulo</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Acción</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 12, color: 'var(--text-muted)' }}>
                No hay actividad reciente.
              </td>
            </tr>
          ) : (
            items.map((it: any, idx: number) => (
              <tr key={idx}>
                <td style={{ padding: 8 }}>{it.userEmail || it.userId}</td>
                <td style={{ padding: 8 }}>{it.module}</td>
                <td style={{ padding: 8 }}>{it.action}</td>
                <td style={{ padding: 8 }}>{new Date(it.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
