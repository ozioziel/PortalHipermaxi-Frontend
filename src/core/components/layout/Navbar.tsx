import React from 'react';
import AppLogo from '../ui/AppLogo';
import {AppButton} from '../ui/AppButton';

export const Navbar: React.FC = () => {
  return (
    <header style={{background:'white',padding:'12px 0',boxShadow:'0 1px 0 rgba(0,0,0,0.04)'}}>
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <AppLogo size={36} />
          <div style={{fontWeight:700}}>Portal Hipermaxi</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <AppButton variant="secondary">Soporte y Ayudas</AppButton>
          <AppButton variant="primary">Iniciar</AppButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
