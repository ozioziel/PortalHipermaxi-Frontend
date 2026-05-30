import type { ProviderAccessFormData, ContactRole, CatalogEntry } from '../types/providerOnboarding.types';

export function buildProviderEmailBody(data: { access: ProviderAccessFormData; contacts?: ContactRole[]; catalog?: CatalogEntry[] }){
  const lines: string[] = [];
  lines.push(`Proveedor: ${data.access.providerName}`);
  lines.push(`Razón social: ${data.access.legalName}`);
  lines.push(`NIT: ${data.access.nit}`);
  lines.push(`Correo: ${data.access.email}`);
  lines.push(`Teléfono: ${data.access.phone}`);
  lines.push('');
  if (data.contacts && data.contacts.length){
    lines.push('Responsables:');
    data.contacts.forEach(c => lines.push(`- ${c.role}: ${c.name} / ${c.email} / ${c.phone}`));
  }
  if (data.catalog && data.catalog.length){
    lines.push('');
    lines.push('Catálogo:');
    data.catalog.forEach((cat,i) => lines.push(`- ${i+1}: ${cat.providerCode || '-'} | ${cat.region || '-'} | ${cat.sellerName || '-'} | ${cat.sellerPhone || '-'} | ${cat.managerName || '-'} | ${cat.observation || '-'}`));
  }

  return encodeURIComponent(lines.join('\n'));
}

export default buildProviderEmailBody;
