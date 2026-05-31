import type {
  CatalogEntry,
  ContactRole,
  ProviderAccessFormData,
} from '../types/providerOnboarding.types';

export const isRequired = (v: unknown) =>
  v !== undefined && v !== null && String(v).trim() !== '';
export const isValidNit = (v: string) => /^[0-9]{5,15}$/.test(v);
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isValidPhone = (v: string) => /^[0-9]{7,12}$/.test(v);

export function validateAccessForm(data: ProviderAccessFormData) {
  const errors: Record<string, string> = {};
  if (!isRequired(data.providerName) || String(data.providerName).trim().length < 3) errors.providerName = 'Nombre del proveedor requerido (mín 3 caracteres)';
  if (!isRequired(data.legalName) || String(data.legalName).trim().length < 3) errors.legalName = 'Razón social requerida (mín 3 caracteres)';
  if (!isRequired(data.nit) || !isValidNit(data.nit)) errors.nit = 'NIT inválido (solo números, 5-15 dígitos)';
  if (!isRequired(data.email) || !isValidEmail(data.email)) errors.email = 'Email inválido';
  if (!isRequired(data.phone) || !isValidPhone(data.phone)) errors.phone = 'Teléfono inválido (7-12 dígitos)';
  if (!isRequired(data.commerceActivity)) errors.commerceActivity = 'Rubro comercial requerido';
  if (!isRequired(data.city)) errors.city = 'Ciudad requerida';
  if (!isRequired(data.hasProviderCode)) errors.hasProviderCode = 'Seleccione una opción';
  return errors;
}

export function validateRegistrationForm(data: {
  contacts: ContactRole[];
  catalog: CatalogEntry[];
  confirmations: Record<string, boolean>;
}) {
  const errors: string[] = [];
  data.contacts.forEach((contact) => {
    if (!isRequired(contact.name)) errors.push(`Falta nombre para ${contact.role}`);
    if (!isRequired(contact.email) || !isValidEmail(contact.email)) errors.push(`Email inválido para ${contact.role}`);
    if (!isRequired(contact.phone) || !isValidPhone(contact.phone)) errors.push(`Teléfono inválido para ${contact.role}`);
  });

  if (!data.confirmations || !Object.values(data.confirmations).every(Boolean)) errors.push('Debe aceptar todas las confirmaciones');

  return errors;
}

export default {
  isRequired,
  isValidNit,
  isValidEmail,
  isValidPhone,
  validateAccessForm,
  validateRegistrationForm,
};
