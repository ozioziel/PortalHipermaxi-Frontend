import React from 'react';
import type { Product } from '../types/product.types';

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<Props> = ({ products, onDelete }) => {
  return (
    <div style={{ overflowX: 'auto', marginTop: 12 }}>
      <table className="products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Barra Proveedor</th>
            <th>Precio</th>
            <th>Inv. Reg. Sanitario</th>
            <th>Fecha Reg. San.</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.description}</td>
              <td>{product.supplierBar}</td>
              <td>{product.price ? `${product.price} BOB` : '-'}</td>
              <td>{product.sanitaryRegistry}</td>
              <td>{product.sanitaryRegistryDate}</td>
              <td className="options">
                <button className="btn-small btn-white" onClick={() => onDelete(product.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
