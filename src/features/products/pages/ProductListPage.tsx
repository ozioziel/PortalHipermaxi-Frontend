import React, {useState} from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import '../products.css';
import {mockProducts} from '../data/mockProducts';
import ProductToolbar from '../components/ProductToolbar';
import ProductTable from '../components/ProductTable';
import ProductFormModal from '../components/ProductFormModal';

const ProductListPage: React.FC = () => {
  const [showNew, setShowNew] = useState(false);
  const [products] = useState(mockProducts);

  return (
    <MainLayout>
      <div className="system-bar">
        <div className="inner container">
          <div className="left"><strong>Portal Hipermaxi</strong></div>
          <div className="right"><button className="btn-small btn-white">Salir</button><button className="btn-small btn-white">Soporte y Ayuda</button></div>
        </div>
        <div className="indicator" />
      </div>

      <div style={{marginTop:16}} className="products-container">
        <h2>Lista de Productos</h2>
        <ProductToolbar onNew={() => setShowNew(true)} />
        <div style={{marginTop:8}} className="tabs">
          <div className="tab">Productos</div>
          <div className="tab">Por aprobar</div>
        </div>

        <ProductTable products={products} />
      </div>

      {showNew && <ProductFormModal onClose={() => setShowNew(false)} />}
    </MainLayout>
  );
};

export default ProductListPage;
