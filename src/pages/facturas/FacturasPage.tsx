import React, { startTransition, useEffect, useRef, useState } from 'react';
import MainLayout from '../../core/components/layout/MainLayout';
import InvoiceGuideOverlay from '../../components/facturas/InvoiceGuideOverlay';
import InvoiceUploadDetail from '../../components/facturas/InvoiceUploadDetail';
import PurchaseOrdersTable from '../../components/facturas/PurchaseOrdersTable';
import useInvoiceGuide from '../../hooks/facturas/useInvoiceGuide';
import mockPurchaseOrders, {
  type PurchaseOrder,
} from '../../data/facturas/mockPurchaseOrders';
import './facturas.css';

const shortDateFormatter = new Intl.DateTimeFormat('es-BO');
const dateTimeFormatter = new Intl.DateTimeFormat('es-BO', {
  dateStyle: 'short',
  timeStyle: 'short',
});

const FacturasPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [pageNotice, setPageNotice] = useState<string | null>(null);
  const createdUrlsRef = useRef<string[]>([]);

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? null;
  const guide = useInvoiceGuide(selectedOrder?.observed ?? false);

  useEffect(
    () => () => {
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      createdUrlsRef.current = [];
    },
    [],
  );

  const handleSelectOrder = (orderId: string) => {
    setPageNotice(null);
    setSelectedOrderId(orderId);
  };

  const handleUploadInvoices = (orderId: string, files: File[]) => {
    startTransition(() => {
      setOrders((previousOrders) =>
        previousOrders.map((order) => {
          if (order.id !== orderId) {
            return order;
          }

          const amountPerFile =
            files.length > 0
              ? Number((order.importeTotalRecepcion / files.length).toFixed(2))
              : 0;
          const invoiceDate = shortDateFormatter.format(new Date());
          const uploadedAt = dateTimeFormatter.format(new Date());
          const newInvoices = files.map((file, index) => {
            const fileUrl = URL.createObjectURL(file);
            createdUrlsRef.current.push(fileUrl);

            return {
              amount: amountPerFile,
              fileName: file.name,
              fileUrl,
              id: `${order.id}-${Date.now()}-${index}`,
              invoiceDate,
              status: 'Pendiente de validación',
              uploadedAt,
            };
          });
          const uploadedAmount = newInvoices.reduce(
            (total, invoice) => total + invoice.amount,
            0,
          );

          return {
            ...order,
            fechaFacturaValidado:
              order.fechaFacturaValidado === 'Pendiente'
                ? 'En revisión'
                : order.fechaFacturaValidado,
            importeTotalFactura: Number(
              (order.importeTotalFactura + uploadedAmount).toFixed(2),
            ),
            uploadedInvoices: [...newInvoices, ...order.uploadedInvoices],
          };
        }),
      );
    });
  };

  const handleDeleteInvoice = (orderId: string, invoiceId: string) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        const invoiceToDelete = order.uploadedInvoices.find(
          (invoice) => invoice.id === invoiceId,
        );

        if (invoiceToDelete?.fileUrl) {
          URL.revokeObjectURL(invoiceToDelete.fileUrl);
          createdUrlsRef.current = createdUrlsRef.current.filter(
            (url) => url !== invoiceToDelete.fileUrl,
          );
        }

        return {
          ...order,
          importeTotalFactura: Number(
            (
              order.importeTotalFactura -
              (invoiceToDelete?.amount ?? 0)
            ).toFixed(2),
          ),
          uploadedInvoices: order.uploadedInvoices.filter(
            (invoice) => invoice.id !== invoiceId,
          ),
        };
      }),
    );
  };

  const handleCompleteProcess = (orderId: string) => {
    const order = orders.find((currentOrder) => currentOrder.id === orderId);

    if (!order || order.uploadedInvoices.length === 0) {
      return;
    }

    setPageNotice(
      `La carga de facturas para la orden ${order.nroOrden} quedó registrada para revisión interna.`,
    );
    guide.exitGuide();
    setSelectedOrderId(null);
  };

  const handleStartGuide = () => {
    if (!selectedOrder && orders.length > 0) {
      setSelectedOrderId(orders[0].id);
    }

    guide.startGuide();
  };

  return (
    <MainLayout>
      <div className="invoice-system-bar">
        <div className="invoice-system-bar__top">
          <div>
            <strong>Portal Hipermaxi</strong>
            <span>Módulo Compras - Facturación en Órdenes de Compra</span>
          </div>
          <div className="invoice-system-bar__actions">
            <button className="invoice-btn invoice-btn--secondary" type="button">
              Salir
            </button>
            <button className="invoice-btn invoice-btn--secondary" type="button">
              Soporte y Ayuda
            </button>
          </div>
        </div>
        <div className="invoice-system-bar__indicator" />
      </div>

      <section className="invoice-page">
        <div className="invoice-page__header">
          <div>
            <h1>Facturas</h1>
            <p>
              Simulación del proceso SOP-05 para carga de facturas en órdenes de
              compra del Portal Web de Proveedores Hipermaxi.
            </p>
          </div>

          <div className="invoice-page__actions">
            <button
              className="invoice-btn invoice-btn--primary"
              onClick={handleStartGuide}
              type="button"
            >
              Iniciar guía visual
            </button>
            <button
              className="invoice-btn invoice-btn--secondary"
              disabled={!guide.speechSupported}
              onClick={guide.toggleVoice}
              type="button"
            >
              {guide.speechSupported
                ? guide.voiceEnabled
                  ? 'Desactivar voz'
                  : 'Activar voz'
                : 'Voz no disponible'}
            </button>
            <button
              className="invoice-btn invoice-btn--secondary"
              disabled={!guide.isActive || !guide.speechSupported}
              onClick={guide.repeatInstruction}
              type="button"
            >
              Repetir instrucción
            </button>
          </div>
        </div>

        {pageNotice ? (
          <div className="invoice-page__notice">{pageNotice}</div>
        ) : null}

        <div className="invoice-layout">
          <section className="invoice-panel">
            <div className="invoice-panel__header">
              <div>
                <h3>Órdenes de Compra</h3>
                <p>Seleccione la columna Facturas para gestionar la carga.</p>
              </div>
            </div>
            <div className="invoice-panel__body">
              <PurchaseOrdersTable
                onSelectOrder={handleSelectOrder}
                orders={orders}
                selectedOrderId={selectedOrderId}
              />
            </div>
          </section>

          <section className="invoice-panel">
            <div className="invoice-panel__header">
              <div>
                <h3>Detalle de Carga</h3>
                <p>
                  Visualice datos de recepción, observaciones y documentos
                  cargados.
                </p>
              </div>
            </div>
            <div className="invoice-panel__body">
              {selectedOrder ? (
                <InvoiceUploadDetail
                  key={selectedOrder.id}
                  onClose={() => setSelectedOrderId(null)}
                  onComplete={handleCompleteProcess}
                  onDeleteInvoice={handleDeleteInvoice}
                  onUploadInvoices={handleUploadInvoices}
                  order={selectedOrder}
                />
              ) : (
                <div className="invoice-empty-state">
                  <h3>Seleccione una orden de compra</h3>
                  <p>
                    Use el botón de la columna Facturas para abrir el detalle de
                    carga del documento PDF.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      <InvoiceGuideOverlay
        currentStep={guide.currentStep}
        currentStepIndex={guide.currentStepIndex}
        isActive={guide.isActive}
        onExit={guide.exitGuide}
        onNext={guide.nextStep}
        onPrevious={guide.previousStep}
        totalSteps={guide.steps.length}
      />
    </MainLayout>
  );
};

export default FacturasPage;
