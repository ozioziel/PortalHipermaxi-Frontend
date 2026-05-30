import type { ProviderAccessFormData, ContactRole, CatalogEntry } from '../types/providerOnboarding.types';

export const providerFormInitialData: ProviderAccessFormData = {
  providerName: '',
  legalName: '',
  nit: '',
  email: '',
  phone: '',
  commerceActivity: '',
  city: '',
  hasProviderCode: 'no',
};

export const initialContactRoles: ContactRole[] = [
  { role: 'Encargado área Sistemas', name: '', email: '', phone: '' },
  { role: 'Encargado HUB', name: '', email: '', phone: '' },
  { role: 'Encargado área Comercial/Ventas', name: '', email: '', phone: '' },
];

export const initialCatalog: CatalogEntry[] = [
  { providerCode: '', region: '', sellerName: '', sellerPhone: '', managerName: '', observation: '' }
];

export default providerFormInitialData;
