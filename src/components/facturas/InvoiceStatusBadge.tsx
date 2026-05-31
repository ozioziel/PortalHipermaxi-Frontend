import React from 'react';
import type { PurchaseOrder } from '../../data/facturas/mockPurchaseOrders';

interface InvoiceStatusBadgeProps {
  label: string;
  status: PurchaseOrder['estadoFactura'];
  guideTarget?: boolean;
}

const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({
  label,
  status,
  guideTarget = false,
}) => {
  return (
    <span
      className={`invoice-status-badge invoice-status-badge--${status}`}
      data-guide={guideTarget ? 'invoice-status' : undefined}
    >
      {label}
    </span>
  );
};

export default InvoiceStatusBadge;
