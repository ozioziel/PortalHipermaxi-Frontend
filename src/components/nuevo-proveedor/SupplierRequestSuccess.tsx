import React from 'react';

interface SupplierRequestSuccessProps {
  caseNumber: string;
  hubEmail: string;
  onReset: () => void;
  onGoHome: () => void;
}

const actionButtonStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #d1d5db',
  color: 'var(--text-dark)',
};

export const SupplierRequestSuccess: React.FC<SupplierRequestSuccessProps> = ({
  caseNumber,
  hubEmail,
  onReset,
  onGoHome,
}) => {
  return (
    <section className="card" style={{ padding: 28 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderRadius: 999,
          background: '#ecfdf3',
          color: '#166534',
          fontWeight: 700,
          marginBottom: 18,
        }}
      >
        Solicitud registrada
      </div>

      <h2 style={{ margin: '0 0 12px 0', fontSize: 30 }}>
        Solicitud registrada correctamente
      </h2>
      <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: 760, lineHeight: 1.6 }}>
        El Área de Compras revisará la información enviada. Si la solicitud es aprobada,
        Soporte generará las credenciales y las enviará al correo del Encargado HUB.
      </p>

      <div
        style={{
          marginTop: 22,
          padding: 18,
          borderRadius: 14,
          border: '1px solid #fed7aa',
          background: '#fff7ed',
          display: 'grid',
          gap: 10,
        }}
      >
        <strong style={{ fontSize: 18 }}>Caso generado: {caseNumber}</strong>
        <span style={{ color: 'var(--text-dark)' }}>
          Destino de credenciales: {hubEmail.trim() || 'Correo del Encargado HUB'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
        <button className="btn btn-secondary" style={actionButtonStyle} onClick={onReset}>
          Registrar otra solicitud
        </button>
        <button className="btn btn-primary" onClick={onGoHome}>
          Volver al inicio
        </button>
      </div>
    </section>
  );
};

export default SupplierRequestSuccess;
