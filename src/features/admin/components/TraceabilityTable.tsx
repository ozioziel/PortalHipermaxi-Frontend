import React from 'react';
import AdminDataTable from './AdminDataTable';
import AdminStatusBadge from './AdminStatusBadge';
import type { TraceabilityEvent } from '../types';

interface TraceabilityTableProps {
  rows: TraceabilityEvent[];
}

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const TraceabilityTable: React.FC<TraceabilityTableProps> = ({ rows }) => {
  return (
    <AdminDataTable
      rows={rows}
      rowKey={(row) => row.id}
      emptyMessage="No se encontraron eventos para los filtros seleccionados."
      defaultSort={{ columnId: 'createdAt', direction: 'desc' }}
      columns={[
        {
          id: 'createdAt',
          label: 'Fecha y hora',
          sortable: true,
          sortValue: (row) => new Date(row.createdAt).getTime(),
          render: (row) => formatDateTime(row.createdAt),
        },
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
          id: 'role',
          label: 'Rol',
          sortable: true,
          sortValue: (row) => row.role,
          render: (row) => row.role,
        },
        {
          id: 'module',
          label: 'Módulo',
          sortable: true,
          sortValue: (row) => row.module,
          render: (row) => row.module,
        },
        {
          id: 'action',
          label: 'Acción',
          sortable: true,
          sortValue: (row) => row.action,
          render: (row) => row.action,
        },
        {
          id: 'description',
          label: 'Descripción',
          render: (row) => row.description,
        },
        {
          id: 'status',
          label: 'Estado',
          sortable: true,
          sortValue: (row) => row.status,
          render: (row) => <AdminStatusBadge status={row.status} />,
        },
      ]}
    />
  );
};

export default TraceabilityTable;
