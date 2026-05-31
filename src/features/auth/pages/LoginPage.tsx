import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/auth/AuthContext';
import HelpTooltip from '../../../components/ui/HelpTooltip';

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#f8fafc' },
  card: { width: 480, maxWidth: '100%', background: '#ffffff', borderRadius: 12, boxShadow: '0 14px 40px rgba(15,23,42,0.12)', padding: 28, border: '1px solid #e2e8f0' },
  title: { margin: 0, marginBottom: 8, color: '#1f2937' },
  subtitle: { margin: 0, marginBottom: 16, color: '#6b7280', fontSize: 14 },
  fieldRow: { display: 'grid', gap: 8, marginBottom: 12 },
  input: { padding: '10px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14, outline: 'none' },
  actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  primaryBtn: { background: '#f66014', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 6, cursor: 'pointer' },
  linkBtn: { background: 'transparent', border: 'none', color: '#0f3f91', cursor: 'pointer', padding: 0, fontSize: 13 },
};

const LoginPage: React.FC = () => {
  const [account, setAccount] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const ADMIN_EMAIL = 'admin@hipermaxi.com';
  const ADMIN_PASSWORD = 'Admin123*';
  const CLIENT_EMAIL = 'cliente@hipermaxi.com';
  const CLIENT_PASSWORD = 'Cliente123*';

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

  const handleLogin = async () => {
    setError('');
    const success = await auth.login(account.trim(), password);
    if (success) {
      if (auth.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/productos');
      }
    } else {
      setError('Inicio de sesión fallido. Verifique sus credenciales.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Iniciar sesión</h1>
        <p style={styles.subtitle}>Usa credenciales de prueba para cliente o admin.</p>

        <div style={styles.fieldRow}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 13 }}>
            Cuenta
            <HelpTooltip text="Ingrese su cuenta de acceso, por ejemplo cliente@hipermaxi.com." ariaLabel="Ayuda Cuenta" />
          </label>
          <input style={styles.input} placeholder="Cuenta" value={account} onChange={(e) => setAccount(e.target.value)} />
        </div>

        <div style={styles.fieldRow}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 13 }}>
            Usuario
            <HelpTooltip text="Ingrese su nombre de usuario de prueba." ariaLabel="Ayuda Usuario" />
          </label>
          <input style={styles.input} placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div style={styles.fieldRow}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 13 }}>
            Contraseña
            <HelpTooltip text="Ingrese la contraseña de prueba proporcionada para acceso." ariaLabel="Ayuda Contraseña" />
          </label>
          <input type="password" style={styles.input} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" style={styles.linkBtn} onClick={fillClientCredentials}>Usar cuenta cliente</button>
            <button type="button" style={styles.linkBtn} onClick={fillAdminCredentials}>Usar cuenta admin</button>
          </div>
          <div style={{ color: '#dc2626', fontSize: 13 }}>{error}</div>
        </div>

        <div style={styles.actions}>
          <button type="button" style={styles.primaryBtn} onClick={handleLogin}>Iniciar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
