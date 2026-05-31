import React from 'react';
import type {AvdStatus} from '../../data/avd/mockAvdOrders';

interface AvdStatusBadgeProps {
  status: AvdStatus;
  confirmed: boolean;
}

const AvdStatusBadge: React.FC<AvdStatusBadgeProps> = ({status, confirmed}) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.2,
        color: confirmed ? '#991b1b' : '#374151',
        background: confirmed ? '#fee2e2' : '#e5e7eb',
        border: `1px solid ${confirmed ? '#fca5a5' : '#d1d5db'}`,
      }}
    >
      {status}
    </span>
  );
};

export default AvdStatusBadge;
