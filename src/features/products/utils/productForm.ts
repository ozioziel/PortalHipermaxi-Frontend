import type { Product } from '../types/product.types';
import type { ProductFormState, ValidationResult } from '../../support/types';

export const initialProductFormState: ProductFormState = {
  description: '',
  internalCode: '',
  barcode: '',
  label: '',
  dimensions: '',
  images: [],
  price: '',
  unit: '',
  sanitaryRegister: '',
};

export const validationErrorsByField = (validation: ValidationResult | null) => {
  if (!validation) return {};

  return validation.errors.reduce<Partial<Record<keyof ProductFormState | 'images', string>>>((accumulator, error) => {
    accumulator[error.field] = error.message;
    return accumulator;
  }, {});
};

export const productFromForm = (formState: ProductFormState): Omit<Product, 'id'> => ({
  description: formState.description,
  supplierBar: formState.barcode,
  sanitaryRegistry: formState.sanitaryRegister || 'No aplica',
  sanitaryRegistryDate: new Date().toISOString().slice(0, 10),
});
