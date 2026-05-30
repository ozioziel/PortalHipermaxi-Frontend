export interface ProviderAccessFormData {
  providerName: string;
  legalName: string;
  nit: string;
  email: string;
  phone: string;
  commerceActivity: string;
  city: string;
  hasProviderCode: 'si' | 'no' | 'ns';
}

export interface ContactRole {
  role: string;
  name: string;
  email: string;
  phone: string;
}

export interface CatalogEntry {
  providerCode?: string;
  region?: string;
  sellerName?: string;
  sellerPhone?: string;
  managerName?: string;
  observation?: string;
}

export interface MockUser {
  username: string;
  password: string;
  role: string;
}
