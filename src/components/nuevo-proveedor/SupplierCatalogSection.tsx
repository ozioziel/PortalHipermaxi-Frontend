import React from 'react';
import { supplierRegions } from '../../data/nuevo-proveedor/supplierRegions';
import type {
  SupplierRequestErrors,
  SupplierRequestField,
  SupplierRequestFormData,
} from '../../services/nuevo-proveedor/supplierRequestValidationService';

interface SupplierCatalogSectionProps {
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

export const SupplierCatalogSection: React.FC<SupplierCatalogSectionProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  return (
    <section className="card">
      <div style={sectionHeaderStyle}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Sección 5: Datos de catálogo</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Complete la información comercial y de cobertura del proveedor.
        </p>
      </div>

      <div style={fieldsGridStyle}>
        <div style={fieldWrapperStyle} data-guide="supplier-code">
          <label htmlFor="providerCode" style={labelStyle}>
            Código proveedor
          </label>
          <input
            id="providerCode"
            value={formData.providerCode}
            placeholder="Ingrese el código proveedor"
            onChange={(event) => onFieldChange('providerCode', event.target.value)}
            style={buildInputStyle(Boolean(errors.providerCode))}
          />
          {errors.providerCode ? <span style={errorStyle}>{errors.providerCode}</span> : null}
        </div>

        <div style={fieldWrapperStyle} data-guide="supplier-region">
          <label htmlFor="region" style={labelStyle}>
            Región
          </label>
          <select
            id="region"
            value={formData.region}
            onChange={(event) => onFieldChange('region', event.target.value)}
            style={buildInputStyle(Boolean(errors.region))}
          >
            <option value="">Seleccione una región</option>
            {supplierRegions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region ? <span style={errorStyle}>{errors.region}</span> : null}
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="sellerName" style={labelStyle}>
            Nombre del vendedor
          </label>
          <input
            id="sellerName"
            value={formData.sellerName}
            placeholder="Ingrese el nombre del vendedor"
            onChange={(event) => onFieldChange('sellerName', event.target.value)}
            style={buildInputStyle(Boolean(errors.sellerName))}
          />
          {errors.sellerName ? <span style={errorStyle}>{errors.sellerName}</span> : null}
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="sellerPhone" style={labelStyle}>
            Teléfono del vendedor
          </label>
          <input
            id="sellerPhone"
            type="tel"
            value={formData.sellerPhone}
            placeholder="+591 70000000"
            onChange={(event) => onFieldChange('sellerPhone', event.target.value)}
            style={buildInputStyle(Boolean(errors.sellerPhone))}
          />
          {errors.sellerPhone ? <span style={errorStyle}>{errors.sellerPhone}</span> : null}
        </div>

        <div style={fieldWrapperStyle}>
          <label htmlFor="hipermaxiCommercialManager" style={labelStyle}>
            Nombre del Gerente Comercial Hipermaxi
          </label>
          <input
            id="hipermaxiCommercialManager"
            value={formData.hipermaxiCommercialManager}
            placeholder="Ingrese el nombre del Gerente Comercial Hipermaxi"
            onChange={(event) =>
              onFieldChange('hipermaxiCommercialManager', event.target.value)
            }
            style={buildInputStyle(Boolean(errors.hipermaxiCommercialManager))}
          />
          {errors.hipermaxiCommercialManager ? (
            <span style={errorStyle}>{errors.hipermaxiCommercialManager}</span>
          ) : null}
        </div>

        <div style={{ ...fieldWrapperStyle, gridColumn: '1 / -1' }}>
          <label htmlFor="observations" style={labelStyle}>
            Observaciones
          </label>
          <textarea
            id="observations"
            value={formData.observations}
            placeholder="Registre observaciones relevantes para la revisión"
            onChange={(event) => onFieldChange('observations', event.target.value)}
            style={{
              ...buildInputStyle(Boolean(errors.observations)),
              minHeight: 108,
              resize: 'vertical',
            }}
          />
          {errors.observations ? <span style={errorStyle}>{errors.observations}</span> : null}
        </div>
      </div>
    </section>
  );
};

export default SupplierCatalogSection;
