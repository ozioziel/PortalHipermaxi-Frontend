import React from 'react';

interface Props {
  price: string;
  error?: string;
  onPriceChange: (value: string) => void;
}

const PriceCatalogSection: React.FC<Props> = ({ price, error, onPriceChange }) => {
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <strong>Catalogo de precios</strong>
        <button className="btn btn-orange">Agregar</button>
      </div>

      <div className="field" style={{maxWidth:260, marginTop:10}}>
        <label>Precio</label>
        <input
          data-guide="price"
          data-ai-field="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => onPriceChange(event.target.value)}
        />
        {error && <span className="field-error">{error}</span>}
      </div>

      <div style={{marginTop:8,overflowX:'auto'}}>
        <table className="price-table">
          <thead>
            <tr>
              <th>Precio Costo</th>
              <th>Cantidad Pa...</th>
              <th>Moneda</th>
              <th>Catalogo</th>
              <th>Estado</th>
              <th>Accion</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{price || '-'}</td>
              <td>-</td>
              <td>BOB</td>
              <td>Proveedor</td>
              <td>Edicion</td>
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
