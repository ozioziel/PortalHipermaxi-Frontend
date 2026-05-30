import React, {useState} from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import ProductFormSections from '../components/ProductFormSections';
import { useNavigate } from 'react-router-dom';

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); navigate('/productos'); }, 800);
  };

  return (
    <MainLayout>
      <div style={{marginTop:16}}>
        <h2>Registrar nuevo producto</h2>
        <p>Completa la información del producto para enviarlo a revisión.</p>

        <div style={{marginTop:12}} className="card">
          <ProductFormSections />

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
            <button className="btn btn-white" onClick={() => navigate('/productos')}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave}>{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductCreatePage;
