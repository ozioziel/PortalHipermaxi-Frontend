import React from 'react';
import type {AvdOrderItem} from '../../data/avd/mockAvdOrders';

interface AvdOrderTableProps {
  items: AvdOrderItem[];
  locked: boolean;
  onLockedEditAttempt: () => void;
  onQuantityChange: (itemIndex: number, value: string) => void;
}

const formatMoney = (amount: number): string => {
  return amount.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const cellStyle: React.CSSProperties = {
  padding: '12px 10px',
  borderTop: '1px solid #fed7aa',
};

const AvdOrderTable: React.FC<AvdOrderTableProps> = ({
  items,
  locked,
  onLockedEditAttempt,
  onQuantityChange,
}) => {
  return (
    <div
      data-guide="avd-items-table"
      style={{
        marginTop: 18,
        overflowX: 'auto',
        border: '1px solid #d1d5db',
        borderRadius: 12,
        background: '#ffffff',
      }}
    >
      <table style={{width: '100%', borderCollapse: 'collapse', minWidth: 1080}}>
        <thead>
          <tr>
            {[
              'Item',
              'Barra',
              'Proveedor',
              'Barra Hipermaxi',
              'Producto',
              'Moneda',
              'Cant. OC',
              'P. Unitario',
              'SubTotal',
              'Cant. Despach',
            ].map((column) => (
              <th
                key={column}
                style={{
                  background: '#e5e7eb',
                  color: '#374151',
                  borderBottom: '1px solid #d1d5db',
                  padding: '11px 10px',
                  fontSize: 12,
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, itemIndex) => (
            <tr key={`${item.item}-${item.barra}`} style={{background: itemIndex % 2 === 0 ? '#ffe4d6' : '#ffd5c2'}}>
              <td style={cellStyle}>{item.item}</td>
              <td style={cellStyle}>{item.barra}</td>
              <td style={cellStyle}>{item.proveedor}</td>
              <td style={cellStyle}>{item.barraHipermaxi}</td>
              <td style={cellStyle}>{item.producto}</td>
              <td style={cellStyle}>{item.moneda}</td>
              <td style={cellStyle}>{item.cantidadOC}</td>
              <td style={cellStyle}>{formatMoney(item.precioUnitario)}</td>
              <td style={cellStyle}>{formatMoney(item.subTotal)}</td>
              <td style={cellStyle}>
                <input
                  data-guide={itemIndex === 0 ? 'dispatch-quantity' : undefined}
                  type="number"
                  min="0"
                  step="1"
                  value={item.cantidadDespachada}
                  readOnly={locked}
                  onClick={locked ? onLockedEditAttempt : undefined}
                  onFocus={locked ? onLockedEditAttempt : undefined}
                  onChange={(event) => onQuantityChange(itemIndex, event.target.value)}
                  style={{
                    width: 108,
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: `1px solid ${locked ? '#fca5a5' : '#cbd5e1'}`,
                    background: locked ? '#fff5f5' : '#ffffff',
                    color: '#1f2937',
                    cursor: locked ? 'not-allowed' : 'text',
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvdOrderTable;
