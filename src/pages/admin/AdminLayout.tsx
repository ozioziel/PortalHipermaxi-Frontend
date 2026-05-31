import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import '../../features/admin/admin.css';

const initialsFromEmail = (email: string | undefined) => {
  if (!email) return 'AD';
  return email.slice(0, 2).toUpperCase();
};

const adminLinks = [
  {
    to: '/admin/dashboard',
    title: 'Dashboard',
    hint: 'Métricas, filtros y comportamiento general',
  },
  {
    to: '/admin/trazabilidad',
    title: 'Trazabilidad',
    hint: 'Eventos, fechas y actividad por módulo',
  },
  {
    to: '/admin/preguntas-frecuentes',
    title: 'Preguntas frecuentes',
    hint: 'Consultas más repetidas del asistente',
  },
  {
    to: '/admin/interacciones-ia',
    title: 'Interacciones IA',
    hint: 'Rendimiento, errores y fallback del chat',
  },
  {
    to: '/admin/actividad-usuarios',
    title: 'Actividad usuarios',
    hint: 'Último movimiento por cuenta y módulo',
  },
];

const AdminLayout: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__eyebrow">Panel Admin</span>
          <h1>Hipermaxi Trace</h1>
          <p>Dashboard de trazabilidad, soporte e interacción operativa del portal.</p>
        </div>

        <div className="admin-user-chip">
          <span className="admin-user-chip__avatar">{initialsFromEmail(auth.user?.email)}</span>
          <div>
            <div className="admin-user-chip__name">{auth.user?.email ?? 'Administrador'}</div>
            <p className="admin-user-chip__meta">Acceso restringido a rol administrador</p>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Navegación del administrador">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `admin-nav__link ${isActive ? 'is-active' : ''}`}
            >
              <span className="admin-nav__title">{link.title}</span>
              <span className="admin-nav__hint">{link.hint}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <p>Este espacio no comparte componentes visuales con el flujo cliente.</p>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar__badge">Monitoreo operativo</span>
          <div className="admin-topbar__meta">
            <div className="admin-topbar__text">
              <strong>Entorno administrativo protegido</strong>
              <span>Solo visible para usuarios con rol `admin`.</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
