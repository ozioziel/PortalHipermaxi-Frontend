import React from 'react';
import SupplierRequestForm from '../../components/nuevo-proveedor/SupplierRequestForm';
import MainLayout from '../../core/components/layout/MainLayout';

const heroCardStyle: React.CSSProperties = {
  display: 'grid',
  gap: 18,
  padding: 28,
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',
  padding: '7px 12px',
  borderRadius: 999,
  background: '#eff6ff',
  color: '#1d4ed8',
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const alertStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 14,
  border: '1px solid #fed7aa',
  background: '#fff7ed',
  color: '#9a3412',
  lineHeight: 1.6,
};

export const NuevoProveedorPage: React.FC = () => {
  return (
    <MainLayout>
      <div style={{ display: 'grid', gap: 18 }}>
        <section className="card" style={heroCardStyle}>
          <span style={badgeStyle}>SOP-SR-01</span>

          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: 34 }}>
              Solicitud de Credenciales de Acceso
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: 760, lineHeight: 1.6 }}>
              Complete la información requerida para solicitar acceso al Portal Web de
              Proveedores de Hipermaxi.
            </p>
          </div>

          <div style={alertStyle}>
            Esta solicitud será revisada por el Área de Compras. Si la información es
            aprobada, Soporte generará las credenciales y las enviará al correo del
            Encargado HUB.
          </div>
        </section>

        <SupplierRequestForm />
      </div>
    </MainLayout>
  );
};

export default NuevoProveedorPage;
