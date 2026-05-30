import React from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import { mockUsers } from '../data/mockUsers';
import { useNavigate } from 'react-router-dom';

const ProviderSuccessPage: React.FC = () => {
  const user = mockUsers[0];
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div style={{marginTop:24}}>
        <div style={{background:'white',padding:20,borderRadius:8}}>
          <h2>Solicitud enviada correctamente</h2>
          <p>Tu acceso fue generado para fines de demostración. Estas credenciales son simuladas.</p>
          <div style={{background:'#f8fafc',padding:12,borderRadius:6,marginTop:12}}>
            <div><strong>Usuario:</strong> {user.username}</div>
            <div><strong>Contraseña:</strong> {user.password}</div>
            <div style={{color:'#6b7280',marginTop:8}}>Estas credenciales son demostrativas y no corresponden a un acceso real.</div>
          </div>
          <div style={{marginTop:12}}>
            <button className="btn btn-white" onClick={()=>navigate('/')}>Volver a Home</button>
            <button className="btn btn-primary" style={{marginLeft:8}} onClick={()=>navigate('/productos')}>Ir al Portal</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProviderSuccessPage;
