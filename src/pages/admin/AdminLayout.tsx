import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';

const AdminLayout: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Admin Traceability</div>
            <div style={{ color: '#475569', fontSize: 13 }}>{auth.user?.email}</div>
          </div>
          <button style={{ background: '#f66014', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }} onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, padding: '24px 0' }}>
        <nav style={{ display: 'grid', gap: 12 }}>
          <Link to="/admin/dashboard" className="card admin-link-card">Dashboard</Link>
          <Link to="/admin/trazabilidad" className="card admin-link-card">Trazabilidad</Link>
          <Link to="/admin/preguntas-frecuentes" className="card admin-link-card">Preguntas frecuentes</Link>
          <Link to="/admin/interacciones-ia" className="card admin-link-card">Interacciones IA</Link>
          <Link to="/admin/actividad-usuarios" className="card admin-link-card">Actividad usuarios</Link>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
