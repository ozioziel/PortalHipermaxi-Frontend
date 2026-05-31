import React, { useEffect, useState } from 'react';
import { HiperFlowApi } from '../../features/support/services/HiperFlowApi';
import { mockRecentActivity } from '../../features/admin/data/mockAdminDashboard';

const AdminTraceabilityPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>(mockRecentActivity);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await HiperFlowApi.getRecentActivity();
        setEvents(data?.length ? data : mockRecentActivity);
      } catch {
        setEvents(mockRecentActivity);
      }
    };
    void load();
  }, []);

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>Trazabilidad del sistema</h1>
      <p style={{ color: 'var(--text-muted)' }}>Eventos recientes del sistema y acciones de los usuarios.</p>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Fecha</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Usuario</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Rol</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Módulo</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Acción</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 12, color: 'var(--text-muted)' }}>
                  No hay eventos de trazabilidad.
                </td>
              </tr>
            ) : (
              events.map((item: any, idx: number) => (
                <tr key={`${item.userEmail}-${idx}`}>
                  <td style={{ padding: 8 }}>{new Date(item.createdAt).toLocaleString()}</td>
                  <td style={{ padding: 8 }}>{item.userEmail || item.userId}</td>
                  <td style={{ padding: 8 }}>{item.role || 'cliente'}</td>
                  <td style={{ padding: 8 }}>{item.module}</td>
                  <td style={{ padding: 8 }}>{item.action}</td>
                  <td style={{ padding: 8 }}>{item.description || item.action}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTraceabilityPage;
