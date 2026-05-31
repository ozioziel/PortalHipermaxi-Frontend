import React, { useEffect, useState } from 'react';
import { HiperFlowApi } from '../../features/support/services/HiperFlowApi';
import { mockUsersActivity } from '../../features/admin/data/mockAdminDashboard';

const AdminUserActivityPage: React.FC = () => {
  const [items, setItems] = useState<any[]>(mockUsersActivity);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await HiperFlowApi.getUsersActivity();
        setItems(data?.length ? data : mockUsersActivity);
      } catch {
        setItems(mockUsersActivity);
      }
    };
    void load();
  }, []);

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>Actividad de usuarios</h1>
      <p style={{ color: 'var(--text-muted)' }}>Registros de acciones recientes de los usuarios.</p>

      <div className="card" style={{ padding: 16, marginTop: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Usuario</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Correo</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Rol</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Última actividad</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Módulo</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Acción</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 12, color: 'var(--text-muted)' }}>
                  No hay actividad de usuarios registrada.
                </td>
              </tr>
            ) : (
              items.map((item: any, idx: number) => (
                <tr key={`${item.userEmail}-${idx}`}>
                  <td style={{ padding: 8 }}>{item.userEmail}</td>
                  <td style={{ padding: 8 }}>{item.userEmail}</td>
                  <td style={{ padding: 8 }}>{item.role}</td>
                  <td style={{ padding: 8 }}>{item.lastActivity || item.action || '—'}</td>
                  <td style={{ padding: 8 }}>{item.module}</td>
                  <td style={{ padding: 8 }}>{item.action}</td>
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

export default AdminUserActivityPage;
