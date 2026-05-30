import React from 'react';

const PriceCatalogSection: React.FC = () => {
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <strong>Catálogo de precios</strong>
        <button className="btn btn-orange">Agregar</button>
      </div>

      <div style={{marginTop:8,overflowX:'auto'}}>
        <table className="price-table">
          <thead>
            <tr>
              <th>Precio Costo</th>
              <th>Cantidad Pa...</th>
              <th>Moneda</th>
              <th>Catálogo</th>
              <th>Estado</th>
              <th>Acción</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceCatalogSection;
