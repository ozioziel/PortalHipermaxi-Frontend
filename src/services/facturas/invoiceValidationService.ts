export interface InvoiceValidationResult {
  isValid: boolean;
  message: string;
}

export const validateInvoiceFile = (
  file?: File | null,
): InvoiceValidationResult => {
  if (!file) {
    return {
      isValid: false,
      message: 'Debe seleccionar una factura antes de cargar.',
    };
  }

  const fileName = file.name.toLowerCase();
  const isPdf =
    file.type === 'application/pdf' || fileName.endsWith('.pdf');

  if (!isPdf) {
    return {
      isValid: false,
      message: 'El portal solo permite cargar facturas en formato PDF.',
    };
  }

  if (file.size <= 0) {
    return {
      isValid: false,
      message: 'El archivo seleccionado está vacío o dañado.',
    };
  }

  return {
    isValid: true,
    message: 'Factura cargada correctamente.',
  };
};

export default validateInvoiceFile;
