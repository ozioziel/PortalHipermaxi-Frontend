import React from 'react';

interface AvdRestrictionAlertProps {
  visible: boolean;
  message?: string;
}

const defaultRestrictionMessage =
  'Una vez confirmado el Aviso de Despacho, el sistema bloquea automaticamente cualquier modificacion posterior. No se pueden modificar cantidades, corregir datos ni revertir el proceso desde el Portal Web.';

const AvdRestrictionAlert: React.FC<AvdRestrictionAlertProps> = ({visible, message}) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      data-guide="avd-restriction"
      style={{
        marginTop: 16,
        borderRadius: 10,
        border: '1px solid #fecaca',
        background: '#fff1f2',
        color: '#9f1239',
        padding: '14px 16px',
      }}
    >
      <strong style={{display: 'block', marginBottom: 6}}>Restriccion SOP-06</strong>
      <span>{message ?? defaultRestrictionMessage}</span>
    </div>
  );
};

export default AvdRestrictionAlert;
