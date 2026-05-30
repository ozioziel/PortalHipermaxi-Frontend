import React, {useState} from 'react';
import ProductFormSections from './ProductFormSections';
import '../products.css';

interface Props { onClose: () => void }

const ProductFormModal: React.FC<Props> = ({onClose}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.log('Producto guardado visualmente');
    setSaved(true);
    setTimeout(() => onClose(), 700);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Nuevo Producto</h3>
          <div>
            <button className="btn btn-white" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" style={{marginLeft:8}} onClick={handleSave}>Guardar</button>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <ProductFormSections />
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
