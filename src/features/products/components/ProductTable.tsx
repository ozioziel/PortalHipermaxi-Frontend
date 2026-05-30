import React from 'react';
import type { Product } from '../types/product.types';

interface Props { products: Product[] }

const ProductTable: React.FC<Props> = ({products}) => {
  return (
    <div style={{overflowX:'auto',marginTop:12}}>
      <table className="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Barra Proveedor</th>
            <th>Inv. Reg. Sanitario</th>
            <th>Fecha Reg. San.</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.description}</td>
              <td>{p.supplierBar}</td>
              <td>{p.sanitaryRegistry}</td>
              <td>{p.sanitaryRegistryDate}</td>
              <td className="options"><button>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
