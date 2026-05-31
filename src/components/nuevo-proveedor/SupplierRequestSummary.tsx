import React from 'react';
import type { SupplierRequestFormData } from '../../services/nuevo-proveedor/supplierRequestValidationService';

interface SupplierRequestSummaryProps {
  formData: SupplierRequestFormData;
}

const summaryGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
};

const summaryItemStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 12,
  background: '#f8fafc',
  border: '1px solid #e5e7eb',
};

const summaryLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: 6,
};

const summaryValueStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 600,
  color: 'var(--text-dark)',
};

const resolveValue = (value: string) => value.trim() || 'Pendiente de registro';

export const SupplierRequestSummary: React.FC<SupplierRequestSummaryProps> = ({ formData }) => {
  const summaryItems = [
    { label: 'Razón social', value: resolveValue(formData.legalName) },
    { label: 'NIT', value: resolveValue(formData.nit) },
    { label: 'Código proveedor', value: resolveValue(formData.providerCode) },
    { label: 'Encargado HUB', value: resolveValue(formData.hubManagerName) },
    { label: 'Email Encargado HUB', value: resolveValue(formData.hubManagerEmail) },
    { label: 'Región', value: resolveValue(formData.region) },
  ];

  return (
    <section className="card" data-tour="supplier-summary-section">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Sección 6: Resumen de solicitud</h2>
        <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)' }}>
          Revise los datos principales antes de enviar la solicitud.
        </p>
      </div>

      <div style={summaryGridStyle}>
        {summaryItems.map((item) => (
          <div key={item.label} style={summaryItemStyle}>
            <span style={summaryLabelStyle}>{item.label}</span>
            <p style={summaryValueStyle}>{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SupplierRequestSummary;
