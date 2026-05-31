import React from 'react';
import type {AvdOrder} from '../../data/avd/mockAvdOrders';
import AvdStatusBadge from './AvdStatusBadge';

interface AvdDispatchDetailProps {
  avd: AvdOrder;
}

const formatMoney = (amount: number): string => {
  return amount.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const detailCardStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  background: '#f8fafc',
  padding: '12px 14px',
  minHeight: 78,
};

const AvdDispatchDetail: React.FC<AvdDispatchDetailProps> = ({avd}) => {
  return (
    <section
      data-guide="avd-header"
      style={{
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h2 style={{margin: 0}}>Aviso de Despacho</h2>
          <p style={{margin: '6px 0 0', color: '#6b7280'}}>
            Revisa la orden, registra cantidades y confirma el despacho cuando corresponda.
          </p>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-start'}}>
          <AvdStatusBadge status={avd.estado} confirmed={avd.confirmed} />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        <div style={detailCardStyle}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Nro. Orden</div>
          <strong>{avd.nroOrden}</strong>
        </div>
        <div style={detailCardStyle}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Fecha</div>
          <strong>{avd.fecha}</strong>
        </div>
        <div style={detailCardStyle}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Und. Negocio</div>
          <strong>{avd.unidadNegocio}</strong>
        </div>
        <div style={detailCardStyle}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Cod. Prov.</div>
          <strong>{avd.codigoProveedor}</strong>
        </div>
        <div style={detailCardStyle}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Imp. Total OC</div>
          <strong>{`${avd.moneda} ${formatMoney(avd.importeTotalOC)}`}</strong>
        </div>
        <div style={detailCardStyle}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Imp. Total AVD</div>
          <strong>{`${avd.moneda} ${formatMoney(avd.importeTotalAVD)}`}</strong>
        </div>
        <div style={detailCardStyle}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Moneda</div>
          <strong>{avd.moneda}</strong>
        </div>
        <div style={detailCardStyle}>
          <div style={{fontSize: 12, color: '#6b7280'}}>Estado</div>
          <div style={{marginTop: 6}}>
            <AvdStatusBadge status={avd.estado} confirmed={avd.confirmed} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvdDispatchDetail;
