import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../products.css';

interface Props {
  onClose: () => void;
}

const StartPanelModal: React.FC<Props> = ({onClose}) => {
  const navigate = useNavigate();

  const goToProducts = () => {
    onClose();
    navigate('/productos');
  };

  const goToInvoices = () => {
    onClose();
    navigate('/facturas');
  };

  const goToAvd = () => {
    onClose();
    navigate('/avd');
  };

  return (
    <div className="overlay">
      <div className="modal" style={{maxWidth: 520}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <h3 style={{margin: 0}}>Acceder al Portal</h3>
          <p className="text-muted" style={{margin: 0}}>
            Selecciona el módulo al que deseas ingresar.
          </p>

          <div style={{display: 'grid', gap: 12, marginTop: 12}}>
            <div className="card" style={{cursor: 'pointer'}} onClick={goToProducts}>
              <h4 style={{margin: '6px 0'}}>Productos</h4>
              <p className="text-muted" style={{margin: 0}}>
                Administrar productos, imágenes y catálogos de precios.
              </p>
            </div>

            <div className="card" style={{cursor: 'pointer'}} onClick={goToInvoices}>
              <h4 style={{margin: '6px 0'}}>Facturas</h4>
              <p className="text-muted" style={{margin: 0}}>
                Consultar órdenes de compra y cargar facturas PDF para recepción.
              </p>
            </div>
            <div className="card" style={{cursor: 'pointer'}} onClick={goToAvd}>
              <h4 style={{margin: '6px 0'}}>AVD</h4>
              <p className="text-muted" style={{margin: 0}}>
                Revisar ordenes, registrar cantidades y confirmar Avisos de Despacho.
              </p>
            </div>
          </div>

          <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12}}>
            <button className="btn btn-white btn-small" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPanelModal;
