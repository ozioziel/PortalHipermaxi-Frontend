export interface SupplierRequestFormData {
  providerName: string;
  legalName: string;
  nit: string;
  systemsManagerName: string;
  systemsManagerEmail: string;
  systemsManagerPhone: string;
  hubManagerName: string;
  hubManagerEmail: string;
  hubManagerPhone: string;
  salesManagerName: string;
  salesManagerEmail: string;
  salesManagerPhone: string;
  providerCode: string;
  region: string;
  sellerName: string;
  sellerPhone: string;
  hipermaxiCommercialManager: string;
  observations: string;
}

export type SupplierRequestField = keyof SupplierRequestFormData;
export type SupplierRequestErrors = Partial<Record<SupplierRequestField, string>>;

export const initialSupplierRequestFormData: SupplierRequestFormData = {
  providerName: '',
  legalName: '',
  nit: '',
  systemsManagerName: '',
  systemsManagerEmail: '',
  systemsManagerPhone: '',
  hubManagerName: '',
  hubManagerEmail: '',
  hubManagerPhone: '',
  salesManagerName: '',
  salesManagerEmail: '',
  salesManagerPhone: '',
  providerCode: '',
  region: '',
  sellerName: '',
  sellerPhone: '',
  hipermaxiCommercialManager: '',
  observations: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s]+$/;

const isValidEmail = (value: string) => emailPattern.test(value.trim());

const isValidPhone = (value: string) => {
  const trimmed = value.trim();
  const digitCount = trimmed.replace(/\D/g, '').length;

  return phonePattern.test(trimmed) && digitCount >= 7;
};

export const validateSupplierRequest = (
  formData: SupplierRequestFormData,
): SupplierRequestErrors => {
  const errors: SupplierRequestErrors = {};

  if (!formData.providerName.trim()) {
    errors.providerName = 'Debe ingresar el nombre del proveedor.';
  }

  if (!formData.legalName.trim()) {
    errors.legalName = 'Debe ingresar la razón social.';
  }

  if (!formData.nit.trim()) {
    errors.nit = 'El NIT es obligatorio.';
  } else if (!/^\d+$/.test(formData.nit.trim())) {
    errors.nit = 'El NIT debe contener solo números.';
  } else if (formData.nit.trim().length < 5) {
    errors.nit = 'El NIT debe tener al menos 5 dígitos.';
  }

  if (!formData.hubManagerName.trim()) {
    errors.hubManagerName = 'Debe ingresar el nombre del Encargado HUB.';
  }

  if (!formData.hubManagerEmail.trim()) {
    errors.hubManagerEmail = 'Debe ingresar el correo del Encargado HUB.';
  } else if (!isValidEmail(formData.hubManagerEmail)) {
    errors.hubManagerEmail = 'Ingrese un correo válido.';
  }

  if (!formData.hubManagerPhone.trim()) {
    errors.hubManagerPhone = 'Debe ingresar el teléfono del Encargado HUB.';
  } else if (!isValidPhone(formData.hubManagerPhone)) {
    errors.hubManagerPhone = 'Ingrese un teléfono válido.';
  }

  if (!formData.providerCode.trim()) {
    errors.providerCode = 'Debe ingresar el código proveedor.';
  }

  if (!formData.region.trim()) {
    errors.region = 'Debe seleccionar una región.';
  }

  if (formData.systemsManagerEmail.trim() && !isValidEmail(formData.systemsManagerEmail)) {
    errors.systemsManagerEmail = 'Ingrese un correo válido.';
  }

  if (formData.salesManagerEmail.trim() && !isValidEmail(formData.salesManagerEmail)) {
    errors.salesManagerEmail = 'Ingrese un correo válido.';
  }

  if (formData.systemsManagerPhone.trim() && !isValidPhone(formData.systemsManagerPhone)) {
    errors.systemsManagerPhone = 'Ingrese un teléfono válido.';
  }

  if (formData.salesManagerPhone.trim() && !isValidPhone(formData.salesManagerPhone)) {
    errors.salesManagerPhone = 'Ingrese un teléfono válido.';
  }

  if (formData.sellerPhone.trim() && !isValidPhone(formData.sellerPhone)) {
    errors.sellerPhone = 'Ingrese un teléfono válido.';
  }

  return errors;
};
