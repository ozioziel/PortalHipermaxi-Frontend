import React, {useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import MainLayout from '../../core/components/layout/MainLayout';
import AvdActions from '../../components/avd/AvdActions';
import AvdDispatchDetail from '../../components/avd/AvdDispatchDetail';
import AvdGuideOverlay from '../../components/avd/AvdGuideOverlay';
import AvdOrderTable from '../../components/avd/AvdOrderTable';
import AvdRestrictionAlert from '../../components/avd/AvdRestrictionAlert';
import {mockAvdOrders, type AvdOrder, type AvdOrderItem} from '../../data/avd/mockAvdOrders';
import {useAvdGuide} from '../../hooks/avd/useAvdGuide';
import {calculateAvdTotal, canEditAvd, confirmAvd} from '../../services/avd/avdValidationService';

type FeedbackKind = 'info' | 'success' | 'error' | 'restriction';

interface FeedbackState {
  kind: FeedbackKind;
  message: string;
}

const restrictionMessage =
  'Este Aviso de Despacho ya fue confirmado. Segun el procedimiento, no se pueden modificar cantidades, corregir datos ni revertir el proceso desde el Portal Web. Debe comunicarse con su comprador asignado.';

const getAlertStyles = (kind: FeedbackKind): React.CSSProperties => {
  if (kind === 'success') {
    return {background: '#ecfdf5', border: '1px solid #86efac', color: '#166534'};
  }

  if (kind === 'info') {
    return {background: '#eff6ff', border: '1px solid #93c5fd', color: '#1d4ed8'};
  }

  return {background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c'};
};

const buildUpdatedOrder = (order: AvdOrder, items: AvdOrderItem[]): AvdOrder => {
  return {
    ...order,
    items,
    importeTotalAVD: calculateAvdTotal(items),
  };
};

const AvdPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<AvdOrder[]>(mockAvdOrders);
  const [selectedOrderId, setSelectedOrderId] = useState(mockAvdOrders[0]?.id ?? '');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const currentOrder = useMemo(() => {
    return orders.find((order) => order.id === selectedOrderId) ?? orders[0];
  }, [orders, selectedOrderId]);

  const isConfirmed = currentOrder?.confirmed ?? false;
  const isEditable = currentOrder ? canEditAvd(currentOrder) : false;

  const {
    closeGuide,
    currentStep,
    currentStepIndex,
    highlightRect,
    isGuideOpen,
    nextStep,
    previousStep,
    repeatVoice,
    startGuide,
    steps,
    toggleVoice,
    voiceEnabled,
  } = useAvdGuide(isConfirmed);

  const updateCurrentOrder = (updater: (order: AvdOrder) => AvdOrder) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== selectedOrderId) {
          return order;
        }

        return updater(order);
      }),
    );
  };

  const showRestriction = () => {
    setFeedback({kind: 'restriction', message: restrictionMessage});
  };

  const handleOrderSelection = (orderId: string) => {
    setSelectedOrderId(orderId);
    setFeedback(null);
    closeGuide();
  };

  const handleQuantityChange = (itemIndex: number, value: string) => {
    if (!currentOrder || !isEditable) {
      showRestriction();
      return;
    }

    const normalizedValue: AvdOrderItem['cantidadDespachada'] =
      value === '' ? '' : Number(value);
    if (value !== '' && Number.isNaN(normalizedValue)) {
      return;
    }

    const currentItem = currentOrder.items[itemIndex];
    if (!currentItem) {
      return;
    }

    if (normalizedValue !== '' && normalizedValue < 0) {
      setFeedback({
        kind: 'error',
        message: 'La cantidad despachada debe ser mayor o igual a 0.',
      });
      return;
    }

    if (normalizedValue !== '' && normalizedValue > currentItem.cantidadOC) {
      setFeedback({
        kind: 'error',
        message: 'La cantidad despachada no puede ser mayor a la cantidad de la Orden de Compra.',
      });
      return;
    }

    updateCurrentOrder((order) => {
      const nextItems = order.items.map((item, index) => {
        if (index !== itemIndex) {
          return item;
        }

        return {
          ...item,
          cantidadDespachada: normalizedValue,
        };
      });

      return buildUpdatedOrder(order, nextItems);
    });

    setFeedback(null);
  };

  const handleCopyOcQuantity = () => {
    if (!currentOrder || !isEditable) {
      showRestriction();
      return;
    }

    updateCurrentOrder((order) => {
      const nextItems = order.items.map((item) => ({
        ...item,
        cantidadDespachada: item.cantidadOC,
      }));

      return buildUpdatedOrder(order, nextItems);
    });

    setFeedback({
      kind: 'info',
      message: 'Se copiaron las cantidades de la Orden de Compra al Aviso de Despacho.',
    });
  };

  const handleSave = () => {
    if (!currentOrder || !isEditable) {
      showRestriction();
      return;
    }

    updateCurrentOrder((order) => buildUpdatedOrder(order, order.items));
    setFeedback({
      kind: 'success',
      message: 'Aviso de Despacho guardado correctamente en modo demo.',
    });
  };

  const handleConfirm = () => {
    if (!currentOrder) {
      return;
    }

    const confirmationResult = confirmAvd(currentOrder);

    if (!confirmationResult.valid || !confirmationResult.avd) {
      setFeedback({
        kind: confirmationResult.message === restrictionMessage ? 'restriction' : 'error',
        message:
          confirmationResult.message ??
          'No fue posible confirmar el Aviso de Despacho. Revisa la informacion ingresada.',
      });
      return;
    }

    updateCurrentOrder(() => confirmationResult.avd as AvdOrder);
    setFeedback({
      kind: 'success',
      message: 'El Aviso de Despacho fue confirmado y quedo bloqueado para futuras modificaciones.',
    });
  };

  const handleExcel = () => {
    setFeedback({
      kind: 'info',
      message: 'La exportacion a Excel esta simulada para la demo visual.',
    });
  };

  if (!currentOrder) {
    return null;
  }

  return (
    <MainLayout>
      <section style={{display: 'grid', gap: 16}}>
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: 12,
            padding: 18,
            boxShadow: '0 8px 22px rgba(15, 23, 42, 0.05)',
          }}
        >
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12}}>
            <div>
              <h1 style={{margin: 0, fontSize: 28}}>Modulo AVD</h1>
              <p style={{margin: '6px 0 0', color: '#6b7280'}}>
                Aviso de Despacho para demo del portal de proveedores.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                alignSelf: 'flex-start',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 700,
                padding: '9px 14px',
              }}
            >
              Volver al portal
            </button>
          </div>

          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16}}>
            {orders.map((order) => {
              const selected = order.id === currentOrder.id;
              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => handleOrderSelection(order.id)}
                  style={{
                    minWidth: 190,
                    borderRadius: 10,
                    border: selected ? '1px solid #f97316' : '1px solid #e5e7eb',
                    background: selected ? '#fff7ed' : '#f8fafc',
                    color: '#1f2937',
                    cursor: 'pointer',
                    padding: '12px 14px',
                    textAlign: 'left',
                  }}
                >
                  <strong style={{display: 'block'}}>{order.nroOrden}</strong>
                  <span style={{display: 'block', color: '#64748b', fontSize: 12, marginTop: 4}}>
                    {order.estado}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AvdDispatchDetail avd={currentOrder} />

        <div
          style={{
            borderRadius: 10,
            border: '1px solid #fbcfe8',
            background: '#fff1f2',
            color: '#9f1239',
            padding: '14px 16px',
          }}
        >
          Al momento de confirmar usted esta aceptando los precios unitarios de la Orden de Compra.
        </div>

        <AvdRestrictionAlert
          visible={currentOrder.confirmed || feedback?.kind === 'restriction'}
          message={feedback?.kind === 'restriction' ? feedback.message : undefined}
        />

        {feedback && feedback.kind !== 'restriction' && (
          <div style={{...getAlertStyles(feedback.kind), borderRadius: 10, padding: '14px 16px'}}>
            {feedback.message}
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={handleExcel}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#2563eb',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            Excel
          </button>
        </div>

        <AvdOrderTable
          items={currentOrder.items}
          locked={!isEditable}
          onLockedEditAttempt={showRestriction}
          onQuantityChange={handleQuantityChange}
        />

        <AvdActions
          isConfirmed={currentOrder.confirmed}
          onConfirm={handleConfirm}
          onCopyOcQuantity={handleCopyOcQuantity}
          onExit={() => navigate('/')}
          onSave={handleSave}
          onStartGuide={startGuide}
        />
      </section>

      <AvdGuideOverlay
        currentStep={currentStep}
        currentStepIndex={currentStepIndex}
        highlightRect={highlightRect}
        isOpen={isGuideOpen}
        onClose={closeGuide}
        onNext={nextStep}
        onPrevious={previousStep}
        onRepeatVoice={repeatVoice}
        onToggleVoice={toggleVoice}
        totalSteps={steps.length}
        voiceEnabled={voiceEnabled}
      />
    </MainLayout>
  );
};

export default AvdPage;
