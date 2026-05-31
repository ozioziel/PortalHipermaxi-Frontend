import React from 'react';
import type { AdminStatus } from '../types';

interface AdminStatusBadgeProps {
  status: AdminStatus | string;
}

const normalizeStatus = (status: string): AdminStatus => {
  if (status === 'success' || status === 'respondido') return 'success';
  if (status === 'warning' || status === 'fallback soporte') return 'warning';
  if (status === 'error') return 'error';
  return 'info';
};

const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status }) => {
  return (
    <span className={`admin-status admin-status--${normalizeStatus(status)}`}>
      {status}
    </span>
  );
};

export default AdminStatusBadge;
