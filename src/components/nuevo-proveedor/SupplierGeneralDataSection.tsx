import React from 'react';
import type {
  SupplierRequestErrors,
  SupplierRequestField,
  SupplierRequestFormData,
} from '../../services/nuevo-proveedor/supplierRequestValidationService';

interface SupplierGeneralDataSectionProps {
  formData: SupplierRequestFormData;
  errors: SupplierRequestErrors;
  onFieldChange: (field: SupplierRequestField, value: string) => void;
}

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  marginBottom: 20,
};

const fieldsGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
};

const fieldWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--text-dark)',
};

const buildInputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '11px 12px',
  borderRadius: 10,
  border: `1px solid ${hasError ? '#dc2626' : '#d1d5db'}`,
  background: '#ffffff',
  color: 'var(--text-dark)',
  outline: 'none',
});

const errorStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#dc2626',
};

export const SupplierGeneralDataSection: React.FC<SupplierGeneralDataSectionProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  const renderInput = (
    label: string,
    field: SupplierRequestField,
    placeholder: string,
    type = 'text',
    guideAttribute?: string,
  ) => (
    <div style={fieldWrapperStyle} data-guide={guideAttribute}>
      <label htmlFor={field} style={labelStyle}>
        {label}
      </label>
      <input
        id={field}
        type={type}
        value={formData[field]}
        placeholder={placeholder}
        onChange={(event) => onFieldChange(field, event.target.value)}
        style={buildInputStyle(Boolean(errors[field]))}
      />
      {errors[field] ? <span style={errorStyle}>{errors[field]}</span> : null}
    </div>
  );

  return (
    <section className="card" data-guide="supplier-general-data">
      <div style={sectionHeaderStyle}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Sección 1: Datos del proveedor</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Registre la información principal de la empresa proveedora.
        </p>
      </div>

      <div style={fieldsGridStyle}>
        {renderInput('Nombre de proveedor', 'providerName', 'Ingrese el nombre del proveedor')}
        {renderInput('Razón social', 'legalName', 'Ingrese la razón social')}
        {renderInput('NIT', 'nit', 'Ingrese el NIT', 'text', 'supplier-nit')}
      </div>
    </section>
  );
};

export default SupplierGeneralDataSection;
