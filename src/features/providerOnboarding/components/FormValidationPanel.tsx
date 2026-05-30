import React from 'react';

interface Props { missing: string[]; errors: string[]; completion: number }

export const FormValidationPanel: React.FC<Props> = ({missing, errors, completion}) => {
  return (
    <div className="right-panel">
      <h4>Validación</h4>
      <div>Completitud: {completion}%</div>
      <div style={{marginTop:8}}>
        <strong>Faltantes:</strong>
        <ul>{missing.map((m,i)=><li key={i}>{m}</li>)}</ul>
      </div>
      <div>
        <strong>Errores:</strong>
        <ul style={{color:'#dc2626'}}>{errors.map((e,i)=><li key={i}>{e}</li>)}</ul>
      </div>
    </div>
  );
};

export default FormValidationPanel;
