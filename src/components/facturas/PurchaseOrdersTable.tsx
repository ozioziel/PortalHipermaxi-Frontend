import React from 'react';
import type { PurchaseOrder } from '../../data/facturas/mockPurchaseOrders';
import InvoiceStatusBadge from './InvoiceStatusBadge';

interface PurchaseOrdersTableProps {
  onSelectOrder: (orderId: string) => void;
  orders: PurchaseOrder[];
  selectedOrderId: string | null;
}

const currencyFormatter = new Intl.NumberFormat('es-BO', {
  currency: 'BOB',
  minimumFractionDigits: 2,
  style: 'currency',
});

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({
  onSelectOrder,
  orders,
  selectedOrderId,
}) => {
  const guideOrderId = selectedOrderId ?? orders[0]?.id ?? null;

  return (
    <div className="invoice-table-wrapper">
      <table className="invoice-orders-table">
        <thead>
          <tr>
            <th>Unid. Negocio</th>
            <th>Cod. Prov.</th>
            <th>Nro. Orden</th>
            <th>F. Orden</th>
            <th>Nro. Recep</th>
            <th>F. Recep</th>
            <th>Imp. Total Rec.</th>
            <th>Facturas</th>
            <th>Imp. Total F.</th>
            <th>Est. Recepción</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isSelected = order.id === selectedOrderId;

            return (
              <tr
                className={isSelected ? 'is-selected' : undefined}
                key={order.id}
              >
                <td>{order.unidadNegocio}</td>
                <td>{order.codigoProveedor}</td>
                <td>{order.nroOrden}</td>
                <td>{order.fechaOrden}</td>
                <td>{order.nroRecepcion}</td>
                <td>{order.fechaRecepcion || '--/--/--'}</td>
                <td>{currencyFormatter.format(order.importeTotalRecepcion)}</td>
                <td className="is-center">
                  <button
                    aria-label={`Abrir carga de factura para ${order.nroOrden}`}
                    className="invoice-access-button"
                    data-guide={
                      guideOrderId === order.id ? 'invoice-column' : undefined
                    }
                    onClick={() => onSelectOrder(order.id)}
                    type="button"
                  >
                    Ver
                  </button>
                </td>
                <td>{currencyFormatter.format(order.importeTotalFactura)}</td>
                <td>
                  <InvoiceStatusBadge
                    label={order.estadoRecepcion}
                    status={order.estadoFactura}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrdersTable;
