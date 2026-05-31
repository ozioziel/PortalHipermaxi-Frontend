import React from 'react';

interface RecentActivityItem {
  userEmail?: string;
  userId?: string;
  module: string;
  action: string;
  createdAt: string;
}

interface RecentActivityTableProps {
  items: RecentActivityItem[];
}

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ items }) => {
  return (
    <div className="admin-table-shell__scroller">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Módulo</th>
            <th>Acción</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="admin-table__empty">
                No hay actividad reciente.
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={`${item.createdAt}-${index}`}>
                <td>{item.userEmail || item.userId}</td>
                <td>{item.module}</td>
                <td>{item.action}</td>
                <td>{new Date(item.createdAt).toLocaleString('es-BO')}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
