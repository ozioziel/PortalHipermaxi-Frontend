import type {AvdOrder, AvdOrderItem} from '../../data/avd/mockAvdOrders';

export interface AvdValidationResult {
  valid: boolean;
  message?: string;
}

export interface ConfirmAvdResult extends AvdValidationResult {
  avd?: AvdOrder;
}

const normalizeDispatchQuantity = (value: AvdOrderItem['cantidadDespachada']): number | null => {
  if (value === '') {
    return null;
  }

  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : Number.NaN;
};

export const calculateAvdTotal = (items: AvdOrderItem[]): number => {
  return items.reduce((total, item) => {
    const quantity = normalizeDispatchQuantity(item.cantidadDespachada);
    if (quantity === null || Number.isNaN(quantity)) {
      return total;
    }

    return total + quantity * item.precioUnitario;
  }, 0);
};

export const validateDispatchQuantities = (items: AvdOrderItem[]): AvdValidationResult => {
  for (const item of items) {
    const quantity = normalizeDispatchQuantity(item.cantidadDespachada);

    if (quantity === null || Number.isNaN(quantity)) {
      return {
        valid: false,
        message: 'Debe ingresar la cantidad despachada antes de confirmar el Aviso de Despacho.',
      };
    }

    if (quantity < 0) {
      return {
        valid: false,
        message: 'La cantidad despachada debe ser mayor o igual a 0.',
      };
    }

    if (quantity > item.cantidadOC) {
      return {
        valid: false,
        message: 'La cantidad despachada no puede ser mayor a la cantidad de la Orden de Compra.',
      };
    }
  }

  return {valid: true};
};

export const canEditAvd = (avd: AvdOrder): boolean => {
  return !avd.confirmed;
};

export const confirmAvd = (avd: AvdOrder): ConfirmAvdResult => {
  if (!canEditAvd(avd)) {
    return {
      valid: false,
      message:
        'Este Aviso de Despacho ya fue confirmado. Segun el procedimiento, no se pueden modificar cantidades, corregir datos ni revertir el proceso desde el Portal Web. Debe comunicarse con su comprador asignado.',
    };
  }

  const validation = validateDispatchQuantities(avd.items);
  if (!validation.valid) {
    return validation;
  }

  const importeTotalAVD = calculateAvdTotal(avd.items);

  return {
    valid: true,
    avd: {
      ...avd,
      estado: 'Confirmado',
      confirmed: true,
      importeTotalAVD,
    },
  };
};
