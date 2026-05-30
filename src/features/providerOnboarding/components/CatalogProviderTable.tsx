import React from 'react';
import type { CatalogEntry } from '../types/providerOnboarding.types';

interface Props { catalog: CatalogEntry[]; onChange: (c:CatalogEntry,i:number)=>void }

export const CatalogProviderTable: React.FC<Props> = ({catalog, onChange}) => {
  return (
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>Código Proveedor</th>
            <th>Región</th>
            <th>Nombre vendedor</th>
            <th>Teléfono vendedores</th>
            <th>Nombre Gerente Comercial Hipermaxi</th>
            <th>Observación</th>
          </tr>
        </thead>
        <tbody>
          {catalog.map((c,i)=> (
            <tr key={i}>
              <td><input value={c.providerCode||''} onChange={e=>onChange({...c,providerCode:e.target.value},i)} /></td>
              <td><input value={c.region||''} onChange={e=>onChange({...c,region:e.target.value},i)} /></td>
              <td><input value={c.sellerName||''} onChange={e=>onChange({...c,sellerName:e.target.value},i)} /></td>
              <td><input value={c.sellerPhone||''} onChange={e=>onChange({...c,sellerPhone:e.target.value},i)} /></td>
              <td><input value={c.managerName||''} onChange={e=>onChange({...c,managerName:e.target.value},i)} /></td>
              <td><input value={c.observation||''} onChange={e=>onChange({...c,observation:e.target.value},i)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CatalogProviderTable;
