import React from 'react';

interface AvdActionsProps {
  isConfirmed: boolean;
  onConfirm: () => void;
  onCopyOcQuantity: () => void;
  onExit: () => void;
  onSave: () => void;
  onStartGuide: () => void;
}

const baseButtonStyle: React.CSSProperties = {
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 700,
  padding: '9px 14px',
};

const AvdActions: React.FC<AvdActionsProps> = ({
  isConfirmed,
  onConfirm,
  onCopyOcQuantity,
  onExit,
  onSave,
  onStartGuide,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 18,
      }}
    >
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
        <button
          type="button"
          onClick={onExit}
          style={{
            ...baseButtonStyle,
            border: '1px solid #2563eb',
            background: '#2563eb',
            color: '#ffffff',
          }}
        >
          Salir
        </button>
        <button
          type="button"
          onClick={onStartGuide}
          style={{
            ...baseButtonStyle,
            border: '1px solid #94a3b8',
            background: '#ffffff',
            color: '#334155',
          }}
        >
          Guia paso a paso
        </button>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
        <button
          type="button"
          data-guide="copy-oc-quantity"
          onClick={onCopyOcQuantity}
          style={{
            ...baseButtonStyle,
            border: '1px solid #16a34a',
            background: '#f0fdf4',
            color: '#166534',
          }}
        >
          Copiar Cant. OC
        </button>
        <button
          type="button"
          data-guide="save-avd"
          onClick={onSave}
          style={{
            ...baseButtonStyle,
            border: '1px solid #f97316',
            background: '#fff7ed',
            color: '#c2410c',
          }}
        >
          Guardar
        </button>
        <button
          type="button"
          data-guide="confirm-avd"
          onClick={onConfirm}
          style={{
            ...baseButtonStyle,
            border: '1px solid #dc2626',
            background: isConfirmed ? '#fee2e2' : '#fef2f2',
            color: '#b91c1c',
          }}
        >
          Confirmar Despacho
        </button>
      </div>
    </div>
  );
};

export default AvdActions;
