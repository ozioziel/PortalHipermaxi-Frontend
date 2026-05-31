import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import HelpTooltip from '../../../components/ui/HelpTooltip';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1200,
  },
  modal: {
    width: 480,
    maxWidth: '92%',
    background: '#ffffff',
    borderRadius: 8,
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    padding: 20,
    border: '1px solid #d1d5db'
  },
  title: { margin: 0, marginBottom: 8, color: '#1f2937' },
  subtitle: { margin: 0, marginBottom: 16, color: '#6b7280', fontSize: 14 },
  fieldRow: { display: 'grid', gap: 8, marginBottom: 8 },
  input: { padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14, outline: 'none' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 },
  primaryBtn: { background: '#f66014', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer' },
  cancelBtn: { background: '#003f91', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer' },
  linkBtn: { background: 'transparent', border: 'none', color: '#003f91', cursor: 'pointer', padding: 0, fontSize: 13 }
};

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [account, setAccount] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const ADMIN_EMAIL = 'admin@hipermaxi.com';
  const ADMIN_PASSWORD = 'Admin123*';
  const CLIENT_EMAIL = 'cliente@hipermaxi.com';
  const CLIENT_PASSWORD = 'Cliente123*';

  const resetForm = () => {
    setAccount('');
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const fillAdminCredentials = () => {
    setAccount(ADMIN_EMAIL);
    setUsername('admin');
    setPassword(ADMIN_PASSWORD);
    setError('');
  };

  const fillClientCredentials = () => {
    setAccount(CLIENT_EMAIL);
    setUsername('cliente');
    setPassword(CLIENT_PASSWORD);
    setError('');
  };

  const handleEnter = async () => {
    setError('');
    const success = await auth.login(account.trim(), password);
    if (success) {
      onClose();
      if (auth.user && auth.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        onSuccess();
      }
    } else {
      setError('Inicio de sesión fallido. Verifique sus credenciales.');
    }
  };

  return (
    <div style={styles.overlay} onMouseDown={handleClose}>
      <div style={styles.modal} onMouseDown={e => e.stopPropagation()}>
        <h3 style={styles.title}>Iniciar sesión (prueba)</h3>
        <p style={styles.subtitle}>Usa credenciales de prueba para acceder al flujo demo.</p>

        <div style={{...styles.fieldRow}}>
          <label style={{display:'flex',alignItems:'center',gap:6,color:'#6b7280',fontSize:13}}>
            Cuenta
            <HelpTooltip text="Ingrese su cuenta de acceso, por ejemplo cuenta@empresa.com." ariaLabel="Ayuda Cuenta" />
          </label>
          <input style={styles.input} placeholder="Cuenta" value={account} onChange={e=>setAccount(e.target.value)} />
        </div>

        <div style={{...styles.fieldRow}}>
          <label style={{display:'flex',alignItems:'center',gap:6,color:'#6b7280',fontSize:13}}>
            Usuario
            <HelpTooltip text="Ingrese su nombre de usuario de prueba." ariaLabel="Ayuda Usuario" />
          </label>
          <input style={styles.input} placeholder="Usuario" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>

        <div style={{...styles.fieldRow}}>
          <label style={{display:'flex',alignItems:'center',gap:6,color:'#6b7280',fontSize:13}}>
            Contraseña
            <HelpTooltip text="Ingrese la contraseña de prueba proporcionada para acceso." ariaLabel="Ayuda Contraseña" />
          </label>
          <input type="password" style={styles.input} placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:6}}>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" style={styles.linkBtn} onClick={fillClientCredentials}>Usar cuenta cliente</button>
            <button type="button" style={styles.linkBtn} onClick={fillAdminCredentials}>Usar cuenta admin</button>
          </div>
          <div style={{color:'#dc2626',fontSize:13}}>{error}</div>
        </div>

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={handleClose}>Cancelar</button>
          <button style={styles.primaryBtn} onClick={handleEnter}>Entrar</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
