import React from 'react';
import type { ProviderAccessFormData, ContactRole, CatalogEntry } from '../types/providerOnboarding.types';

interface Props { access: ProviderAccessFormData; contacts: ContactRole[]; catalog: CatalogEntry[] }

export const FormPreviewPanel: React.FC<Props> = ({access, contacts, catalog}) => {
  return (
    <div className="right-panel">
      <h4>Vista previa (para: yolaaaaso@gmail.com)</h4>
      <div><strong>Asunto:</strong> Solicitud de Activación de Código Proveedor (Catálogo)</div>
      <div style={{marginTop:8}}>
        <strong>Proveedor:</strong>
        <div>{access.providerName} / {access.legalName} / NIT: {access.nit}</div>
      </div>
      <div style={{marginTop:8}}>
        <strong>Responsables:</strong>
        <ul>{contacts.map((c,i)=><li key={i}>{c.role}: {c.name} / {c.email}</li>)}</ul>
      </div>
      <div style={{marginTop:8}}>
        <strong>Catálogo:</strong>
        <div>{catalog.length} filas</div>
      </div>
    </div>
  );
};

export default FormPreviewPanel;
