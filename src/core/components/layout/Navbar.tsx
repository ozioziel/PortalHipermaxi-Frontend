import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import AppLogo from '../ui/AppLogo';
import {AppButton} from '../ui/AppButton';
import LoginModal from '../../../features/auth/components/LoginModal';
import StartPanelModal from '../../../features/products/components/StartPanelModal';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isStartPanelOpen, setIsStartPanelOpen] = useState(false);

  return (
    <header className="app-navbar">
      <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Link to="/" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none',color:'inherit'}}>
            <AppLogo size={36} />
            <div style={{fontWeight:800,letterSpacing:'-0.01em'}}>Portal Hipermaxi</div>
          </Link>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <AppButton variant="secondary">Soporte y Ayudas</AppButton>
          <AppButton
            variant="secondary"
            onClick={() => navigate('/nuevo-proveedor')}
            style={{background: '#ffffff', border: '1px solid #f66014', color: '#f66014'}}
          >
            Soy nuevo
          </AppButton>
          <AppButton variant="primary" onClick={() => setIsLoginOpen(true)}>Iniciar</AppButton>
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSuccess={() => setIsStartPanelOpen(true)}
          />
          {isStartPanelOpen ? (
            <StartPanelModal onClose={() => setIsStartPanelOpen(false)} />
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
