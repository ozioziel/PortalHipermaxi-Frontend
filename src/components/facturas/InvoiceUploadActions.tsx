import React from 'react';

interface InvoiceUploadActionsProps {
  completeDisabled?: boolean;
  onComplete: () => void;
  onExit: () => void;
}

const InvoiceUploadActions: React.FC<InvoiceUploadActionsProps> = ({
  completeDisabled = false,
  onComplete,
  onExit,
}) => {
  return (
    <div className="invoice-detail__footer">
      <button
        className="invoice-btn invoice-btn--secondary"
        onClick={onExit}
        type="button"
      >
        Salir
      </button>
      <button
        className="invoice-btn invoice-btn--primary"
        disabled={completeDisabled}
        onClick={onComplete}
        type="button"
      >
        Carga Factura Completada
      </button>
    </div>
  );
};

export default InvoiceUploadActions;
