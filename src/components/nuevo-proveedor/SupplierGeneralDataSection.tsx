import React from 'react';
import { useAuth } from '../../core/auth/AuthContext';
import HelpTooltip from '../ui/HelpTooltip';
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
  const helpTexts: Record<SupplierRequestField, string> = {
    providerName: 'Ingrese el nombre legal de la empresa como aparece en sus documentos.',
    legalName: 'Ingrese el nombre legal de la empresa como aparece en sus documentos.',
    nit: 'Ingrese solo números, sin guiones ni espacios.',
  };

  const renderInput = (
    label: string,
    field: SupplierRequestField,
    placeholder: string,
    type = 'text',
    guideAttribute?: string,
  ) => (
    <div style={fieldWrapperStyle} data-guide={guideAttribute} data-tour={guideAttribute}>
      <label htmlFor={field} style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
        <HelpTooltip text={helpTexts[field]} ariaLabel={`Ayuda ${label}`} />
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

  React.useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent;
      const detail = custom.detail as Partial<SupplierRequestFormData> | undefined;
      if (!detail) return;
      if (detail.providerName) onFieldChange('providerName', detail.providerName as string);
      if (detail.legalName) onFieldChange('legalName', detail.legalName as string);
      if (detail.nit) onFieldChange('nit', detail.nit as string);
    };

    window.addEventListener('supplier:fill-from-admin', handler as EventListener);
    return () => window.removeEventListener('supplier:fill-from-admin', handler as EventListener);
  }, [onFieldChange]);

  return (
    <section className="card" data-tour="supplier-general-section" data-guide="supplier-general-data">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
        <div style={sectionHeaderStyle}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Sección 1: Datos del proveedor</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Registre la información principal de la empresa proveedora.
        </p>
        </div>
        <AdminFill />
      </div>

      <div style={fieldsGridStyle}>
        {renderInput(
          'Nombre de proveedor',
          'providerName',
          'Ingrese el nombre del proveedor',
          'text',
          'supplier-name-input',
        )}
        {renderInput(
          'Razón social',
          'legalName',
          'Ingrese la razón social',
          'text',
          'supplier-legal-name-input',
        )}
        {renderInput('NIT', 'nit', 'Ingrese el NIT', 'text', 'supplier-nit-input')}
      </div>
    </section>
  );
};

const AdminFill: React.FC = () => {
  const auth = useAuth();

  const handleFill = () => {
    if (!auth.user) return;
    const adminName = auth.user.email || `admin-${auth.user.id}`;

    // Emit a custom event so parent section can pick it up and fill fields
    const ev = new CustomEvent('supplier:fill-from-admin', {
      detail: {
        providerName: adminName,
        legalName: adminName,
        nit: auth.user.id,
      },
    });
    window.dispatchEvent(ev);
  };

  if (!auth.user || auth.user.role !== 'admin') return null;

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button type="button" className="secondary" onClick={handleFill} aria-label="Rellenar con datos del administrador">
        Usar datos del administrador
      </button>
    </div>
  );
};

export default SupplierGeneralDataSection;
