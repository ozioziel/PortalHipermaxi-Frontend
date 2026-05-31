import React from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../../features/admin/components/MetricCard';

const AdminDashboardPage: React.FC = () => {
  const metrics = [
    { title: 'Total de usuarios', value: 462 },
    { title: 'Usuarios activos', value: 198 },
    { title: 'Interacciones IA', value: 1520 },
    { title: 'Preguntas frecuentes', value: 86 },
    { title: 'Formularios iniciados', value: 174 },
    { title: 'Formularios completados', value: 141 },
    { title: 'Errores del chat', value: 27 },
    { title: 'Clicks soporte', value: 64 },
  ];

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>Dashboard Administrativo</h1>
      <p style={{ color: 'var(--text-muted)' }}>Resumen general del portal y accesos rápidos a trazabilidad.</p>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginTop: 18 }}>
        {metrics.map((metric) => (
          <MetricCard key={metric.title} title={metric.title} value={metric.value} />
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: 24 }}>
        <Link to="/admin/trazabilidad" className="card admin-link-card">Ver trazabilidad</Link>
        <Link to="/admin/preguntas-frecuentes" className="card admin-link-card">Ver preguntas frecuentes</Link>
        <Link to="/admin/interacciones-ia" className="card admin-link-card">Ver interacciones IA</Link>
        <Link to="/admin/actividad-usuarios" className="card admin-link-card">Ver actividad de usuarios</Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
