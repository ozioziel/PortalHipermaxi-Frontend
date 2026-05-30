import React from 'react';

export const ProviderProcessSteps: React.FC = () => {
  const steps = ['Proveedor nuevo','Validar datos','Completar formulario','Generar solicitud','Recibir credenciales'];
  return (
    <div className="steps">
      {steps.map((s,i)=> <div key={i} className="step">{s}</div>)}
    </div>
  );
};

export default ProviderProcessSteps;
