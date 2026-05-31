import React from 'react';
import AdminDataTable from './AdminDataTable';
import type { UserActivityRecord } from '../types';

interface UserActivityTableProps {
  rows: UserActivityRecord[];
}

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const UserActivityTable: React.FC<UserActivityTableProps> = ({ rows }) => {
  return (
    <AdminDataTable
      rows={rows}
      rowKey={(row) => row.id}
      emptyMessage="No hay actividad de usuarios para los filtros actuales."
      defaultSort={{ columnId: 'createdAt', direction: 'desc' }}
      columns={[
        {
          id: 'userName',
          label: 'Usuario',
          sortable: true,
          sortValue: (row) => row.userName,
          render: (row) => row.userName,
        },
        {
          id: 'userEmail',
          label: 'Correo',
          sortable: true,
          sortValue: (row) => row.userEmail,
          render: (row) => row.userEmail,
        },
        {
          id: 'lastActivity',
          label: 'Última actividad',
          render: (row) => row.lastActivity,
        },
        {
          id: 'moduleVisited',
          label: 'Módulo visitado',
          sortable: true,
          sortValue: (row) => row.moduleVisited,
          render: (row) => row.moduleVisited,
        },
        {
          id: 'actionTaken',
          label: 'Acción realizada',
          sortable: true,
          sortValue: (row) => row.actionTaken,
          render: (row) => row.actionTaken,
        },
        {
          id: 'createdAt',
          label: 'Fecha y hora',
          sortable: true,
          sortValue: (row) => new Date(row.createdAt).getTime(),
          render: (row) => formatDateTime(row.createdAt),
        },
      ]}
    />
  );
};

export default UserActivityTable;
