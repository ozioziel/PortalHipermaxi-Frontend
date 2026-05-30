import React from 'react';
import '../products.css';
import {useNavigate} from 'react-router-dom';

interface Props { onClose: () => void }

const StartPanelModal: React.FC<Props> = ({onClose}) => {
  const navigate = useNavigate();

  const goToProducts = () => {
    onClose();
    navigate('/productos');
  };

  return (
    <div className="overlay">
      <div className="modal" style={{maxWidth:480}}>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <h3 style={{margin:0}}>Acceder al Portal</h3>
          <p className="text-muted" style={{margin:0}}>Selecciona el módulo al que deseas ingresar.</p>

          <div style={{marginTop:12}}>
            <div className="card" style={{cursor:'pointer'}} onClick={goToProducts}>
              <h4 style={{margin:'6px 0'}}>Listar productos</h4>
              <p className="text-muted" style={{margin:0}}>Administrar productos, imágenes y catálogos de precios.</p>
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
            <button className="btn btn-white btn-small" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPanelModal;
