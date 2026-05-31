import React, { useId, useRef, useState } from 'react';
import HelpTooltip from '../ui/HelpTooltip';
import type {
  PurchaseOrder,
  UploadedInvoice,
} from '../../data/facturas/mockPurchaseOrders';
import { validateInvoiceFile } from '../../services/facturas/invoiceValidationService';
import InvoiceObservationBox from './InvoiceObservationBox';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import InvoiceUploadActions from './InvoiceUploadActions';
import FormProgressBar from '../../core/components/ui/FormProgressBar';

interface InvoiceUploadDetailProps {
  onClose: () => void;
  onComplete: (orderId: string) => void;
  onDeleteInvoice: (orderId: string, invoiceId: string) => void;
  onUploadInvoices: (orderId: string, files: File[]) => void;
  order: PurchaseOrder;
}

interface FeedbackState {
  text: string;
  tone: 'error' | 'success';
}

const currencyFormatter = new Intl.NumberFormat('es-BO', {
  currency: 'BOB',
  minimumFractionDigits: 2,
  style: 'currency',
});

const openInvoiceUrl = (invoice: UploadedInvoice) => {
  if (!invoice.fileUrl) {
    return;
  }

  window.open(invoice.fileUrl, '_blank', 'noopener,noreferrer');
};

const downloadInvoice = (invoice: UploadedInvoice) => {
  if (!invoice.fileUrl) {
    return;
  }

  const link = document.createElement('a');
  link.href = invoice.fileUrl;
  link.download = invoice.fileName;
  link.click();
};

const InvoiceUploadDetail: React.FC<InvoiceUploadDetailProps> = ({
  onClose,
  onComplete,
  onDeleteInvoice,
  onUploadInvoices,
  order,
}) => {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [providerObservation, setProviderObservation] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(Array.from(event.target.files ?? []));
    setFeedback(null);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      const result = validateInvoiceFile(null);
      setFeedback({ text: result.message, tone: 'error' });
      return;
    }

    for (const file of selectedFiles) {
      const result = validateInvoiceFile(file);
      if (!result.isValid) {
        setFeedback({ text: result.message, tone: 'error' });
        return;
      }
    }

    onUploadInvoices(order.id, selectedFiles);
    setFeedback({
      text: 'Factura cargada correctamente.',
      tone: 'success',
    });
    setSelectedFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileNames = selectedFiles.map((file) => file.name).join(', ');

  return (
    <div className="invoice-detail">
      <div className="invoice-detail__titlebar">
        <div>
          <h2>Factura de Recepción</h2>
          <p className="invoice-detail__subtitle">
            Portal Web de Proveedores Hipermaxi - SOP-05
          </p>
        </div>
        <InvoiceStatusBadge
          guideTarget
          label={order.estadoRecepcion}
          status={order.estadoFactura}
        />
      </div>

      <FormProgressBar
        totalSteps={3}
        completedSteps={(() => {
          const datos = 1; // Datos recepcion always present (read-only)
          const observacion = providerObservation.trim() ? 1 : 0;
          const factura = order.uploadedInvoices.length > 0 ? 1 : 0;
          return datos + observacion + factura;
        })()}
        labels={["Datos recepción","Observación","Factura digital"]}
      />

      <section className="invoice-section">
        <div className="invoice-section__title">DATOS RECEPCIÓN</div>
        <div className="invoice-section__body">
          <div className="invoice-detail-grid">
            <div className="invoice-data-field">
              <label>Nro. Recepción</label>
              <strong>{order.nroRecepcion}</strong>
            </div>
            <div className="invoice-data-field">
              <label>Nro. Orden</label>
              <strong>{order.nroOrden}</strong>
            </div>
            <div className="invoice-data-field">
              <label>Und. Negocio</label>
              <span>{order.unidadNegocio}</span>
            </div>
            <div className="invoice-data-field">
              <label>Imp. Total Recep.</label>
              <strong>{currencyFormatter.format(order.importeTotalRecepcion)}</strong>
            </div>
            <div className="invoice-data-field">
              <label>Imp. Total Fact.</label>
              <strong>{currencyFormatter.format(order.importeTotalFactura)}</strong>
            </div>
            <div className="invoice-data-field">
              <label>Fecha de Factura Validado</label>
              <span>{order.fechaFacturaValidado}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="invoice-section">
        <div className="invoice-section__title">NOTA RECEPCIÓN</div>
        <div className="invoice-section__body">
          <div className="invoice-note-row">
            <span className="invoice-note-description">
              Documento referencial de la recepción.
            </span>
            <button className="invoice-note-button" type="button">
              PDF
            </button>
          </div>
        </div>
      </section>

      <div className="invoice-warning-strip">
        Adjunte su factura pese a existir diferencias de saldo, si no es el
        caso ignore este mensaje.
      </div>

      {order.observed ? (
        <InvoiceObservationBox observations={order.observations} />
      ) : null}

      <section className="invoice-section">
        <div className="invoice-section__title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Observación
          <HelpTooltip
            text="Agregue información adicional solo si es necesario."
            ariaLabel="Ayuda Observación"
          />
        </div>
        <div className="invoice-section__body">
          <textarea
            className="invoice-textarea"
            onChange={(event) => setProviderObservation(event.target.value)}
            placeholder="Agregar una observación complementaria para la factura."
            value={providerObservation}
          />
        </div>
      </section>

      <section className="invoice-section">
        <div className="invoice-section__title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          Factura Digital
          <HelpTooltip
            text="Seleccione el archivo de la factura correspondiente a esta recepción."
            ariaLabel="Ayuda Factura Digital"
          />
        </div>
        <div className="invoice-section__body">
          <p className="invoice-helper-text">
            Puede cargar más de una factura al mismo tiempo.
          </p>

          <input
            accept="application/pdf,.pdf"
            hidden
            id={fileInputId}
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />

          <div className="invoice-upload-row">
            <label className="invoice-file-display" htmlFor={fileInputId}>
              {fileNames || 'Ninguna factura seleccionada.'}
            </label>
            <button
              className="invoice-btn invoice-btn--secondary"
              data-guide="invoice-browse"
              onClick={handleBrowse}
              type="button"
            >
              Browse
            </button>
            <button
              className="invoice-btn invoice-btn--primary"
              data-guide="invoice-upload-button"
              onClick={handleUpload}
              type="button"
            >
              Cargar Factura(s)
            </button>
          </div>

          {feedback ? (
            <div className={`invoice-feedback invoice-feedback--${feedback.tone}`}>
              {feedback.text}
            </div>
          ) : null}
        </div>
      </section>

      <section className="invoice-section">
        <div className="invoice-section__title">Facturas Cargadas</div>
        <div className="invoice-section__body">
          <div className="invoice-table-wrapper">
            <table className="invoice-files-table">
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Estado</th>
                  <th>Imp. Fact</th>
                  <th>Fecha Fact.</th>
                  <th>Fecha</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {order.uploadedInvoices.length === 0 ? (
                  <tr>
                    <td className="invoice-empty-row" colSpan={6}>
                      Todavía no hay facturas cargadas para esta recepción.
                    </td>
                  </tr>
                ) : (
                  order.uploadedInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.fileName}</td>
                      <td>{invoice.status}</td>
                      <td>{currencyFormatter.format(invoice.amount)}</td>
                      <td>{invoice.invoiceDate}</td>
                      <td>{invoice.uploadedAt}</td>
                      <td>
                        <div className="invoice-table-actions">
                          <button
                            className="invoice-btn invoice-btn--danger"
                            onClick={() => onDeleteInvoice(order.id, invoice.id)}
                            type="button"
                          >
                            Eliminar
                          </button>
                          <button
                            className="invoice-btn invoice-btn--secondary"
                            disabled={!invoice.fileUrl}
                            onClick={() => downloadInvoice(invoice)}
                            type="button"
                          >
                            Descargar
                          </button>
                          <button
                            className="invoice-btn invoice-btn--secondary"
                            disabled={!invoice.fileUrl}
                            onClick={() => openInvoiceUrl(invoice)}
                            type="button"
                          >
                            Ver
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <InvoiceUploadActions
        completeDisabled={order.uploadedInvoices.length === 0}
        onComplete={() => onComplete(order.id)}
        onExit={onClose}
      />
    </div>
  );
};

export default InvoiceUploadDetail;
