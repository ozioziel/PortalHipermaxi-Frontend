import React from 'react';
import HelpTooltip from '../ui/HelpTooltip';
import type {
  SupplierRequestErrors,
  SupplierRequestField,
  SupplierRequestFormData,
} from '../../services/nuevo-proveedor/supplierRequestValidationService';

interface SupplierRolesSectionProps {
  formData: SupplierRequestFormData;
  errors: SupplierRequestErrors;
  onFieldChange: (field: SupplierRequestField, value: string) => void;
}

interface ContactGroupConfig {
  title: string;
  description: string;
  guideAttribute?: string;
  fields: Array<{
    field: SupplierRequestField;
    label: string;
    placeholder: string;
    type?: string;
    tourAttribute?: string;
  }>;
}

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
};

const sectionDescriptionStyle: React.CSSProperties = {
  margin: '6px 0 18px 0',
  color: 'var(--text-muted)',
};

const groupsWrapperStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
};

const groupCardStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: 18,
  background: '#fbfbfb',
};

const groupFieldsStyle: React.CSSProperties = {
  display: 'grid',
  gap: 14,
  marginTop: 16,
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

const helperTextStyle: React.CSSProperties = {
  margin: '8px 0 0 0',
  fontSize: 13,
  color: 'var(--text-muted)',
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

const helpTexts: Record<string, string> = {
  systemsManagerName: 'Ingrese el nombre de la persona encargada de sistemas.',
  systemsManagerEmail: 'Ingrese un correo válido del encargado de sistemas.',
  systemsManagerPhone: 'Ingrese el teléfono de contacto del encargado de sistemas.',
  hubManagerName: 'Ingrese el nombre de la persona responsable del HUB.',
  hubManagerEmail: 'Ingrese el correo de la persona responsable del HUB.',
  hubManagerPhone: 'Ingrese el teléfono del contacto HUB.',
  salesManagerName: 'Ingrese el nombre del responsable comercial o de ventas.',
  salesManagerEmail: 'Ingrese el correo del encargado comercial.',
  salesManagerPhone: 'Ingrese el teléfono del encargado comercial.',
};

const contactGroups: ContactGroupConfig[] = [
  {
    title: 'Sección 2: Encargado de Sistemas',
    description: 'Persona responsable de la coordinación técnica inicial.',
    fields: [
      {
        field: 'systemsManagerName',
        label: 'Nombre del encargado de Sistemas',
        placeholder: 'Ingrese el nombre del encargado de Sistemas',
      },
      {
        field: 'systemsManagerEmail',
        label: 'Email del encargado de Sistemas',
        placeholder: 'correo@empresa.com',
        type: 'email',
      },
      {
        field: 'systemsManagerPhone',
        label: 'Teléfono del encargado de Sistemas',
        placeholder: '+591 70000000',
        type: 'tel',
      },
    ],
  },
  {
    title: 'Sección 3: Encargado HUB',
    description:
      'El Encargado HUB es el contacto autorizado para recibir las credenciales del Portal Web de Proveedores.',
    guideAttribute: 'supplier-hub-section',
    fields: [
      {
        field: 'hubManagerName',
        label: 'Nombre del Encargado HUB',
        placeholder: 'Ingrese el nombre del Encargado HUB',
        tourAttribute: 'supplier-hub-name-input',
      },
      {
        field: 'hubManagerEmail',
        label: 'Email del Encargado HUB',
        placeholder: 'correo@empresa.com',
        type: 'email',
        tourAttribute: 'supplier-hub-email-input',
      },
      {
        field: 'hubManagerPhone',
        label: 'Teléfono del Encargado HUB',
        placeholder: '+591 70000000',
        type: 'tel',
        tourAttribute: 'supplier-hub-phone-input',
      },
    ],
  },
  {
    title: 'Sección 4: Encargado Comercial / Ventas',
    description: 'Contacto comercial para seguimiento de la relación con Hipermaxi.',
    fields: [
      {
        field: 'salesManagerName',
        label: 'Nombre del encargado Comercial / Ventas',
        placeholder: 'Ingrese el nombre del responsable comercial',
      },
      {
        field: 'salesManagerEmail',
        label: 'Email del encargado Comercial / Ventas',
        placeholder: 'correo@empresa.com',
        type: 'email',
      },
      {
        field: 'salesManagerPhone',
        label: 'Teléfono del encargado Comercial / Ventas',
        placeholder: '+591 70000000',
        type: 'tel',
      },
    ],
  },
];

export const SupplierRolesSection: React.FC<SupplierRolesSectionProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  return (
    <section className="card">
      <h2 style={sectionTitleStyle}>Secciones 2, 3 y 4: Roles y contactos</h2>
      <p style={sectionDescriptionStyle}>
        Registre a los responsables involucrados en la solicitud de acceso.
      </p>

      <div style={groupsWrapperStyle}>
        {contactGroups.map((group) => (
          <article
            key={group.title}
            style={groupCardStyle}
            data-tour={group.guideAttribute}
            data-guide={group.guideAttribute}
          >
            <h3 style={{ margin: 0, fontSize: 18 }}>{group.title}</h3>
            <p style={helperTextStyle}>{group.description}</p>

            <div style={groupFieldsStyle}>
              {group.fields.map((fieldConfig) => (
                <div
                  key={fieldConfig.field}
                  style={fieldWrapperStyle}
                  data-tour={fieldConfig.tourAttribute}
                >
                  <label htmlFor={fieldConfig.field} style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {fieldConfig.label}
                    <HelpTooltip
                      text={helpTexts[fieldConfig.field] ?? 'Ingrese el valor correspondiente.'}
                      ariaLabel={`Ayuda ${fieldConfig.label}`}
                    />
                  </label>
                  <input
                    id={fieldConfig.field}
                    type={fieldConfig.type ?? 'text'}
                    value={formData[fieldConfig.field]}
                    placeholder={fieldConfig.placeholder}
                    onChange={(event) =>
                      onFieldChange(fieldConfig.field, event.target.value)
                    }
                    style={buildInputStyle(Boolean(errors[fieldConfig.field]))}
                  />
                  {errors[fieldConfig.field] ? (
                    <span style={errorStyle}>{errors[fieldConfig.field]}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SupplierRolesSection;
