import type { GuideResponse, GuideStep, ProductFormState, ValidationIssue, ValidationResult } from '../types';

interface ProductGuideField {
  field: keyof ProductFormState | 'images' | 'save';
  selector: string;
  title: string;
  defaultMessage: string;
  defaultVoice: string;
  example: string | null;
}

export const productGuideFields: ProductGuideField[] = [
  {
    field: 'description',
    selector: "[data-guide='description']",
    title: 'Descripcion del producto',
    defaultMessage: 'Ingresa una descripcion clara y especifica del producto.',
    defaultVoice: 'Completa la descripcion del producto. Debe ser clara y especifica.',
    example: 'Ejemplo: Aceite vegetal 1 litro',
  },
  {
    field: 'internalCode',
    selector: "[data-guide='internal-code']",
    title: 'Codigo interno proveedor',
    defaultMessage: 'Ingresa el codigo interno que tu empresa usa para identificar el producto.',
    defaultVoice: 'Completa el codigo interno proveedor.',
    example: 'Ejemplo: ACE-001',
  },
  {
    field: 'label',
    selector: "[data-guide='label']",
    title: 'Etiqueta del producto',
    defaultMessage: 'Completa la etiqueta o nombre comercial visible del producto.',
    defaultVoice: 'Completa la etiqueta del producto.',
    example: 'Ejemplo: Aceite vegetal premium',
  },
  {
    field: 'barcode',
    selector: "[data-guide='barcode']",
    title: 'Codigo de barra',
    defaultMessage: 'Completa el codigo de barra que aparece en el empaque.',
    defaultVoice: 'Completa el codigo de barra del producto.',
    example: 'Ejemplo: 7771234567890',
  },
  {
    field: 'dimensions',
    selector: "[data-guide='dimensions']",
    title: 'Dimensiones',
    defaultMessage: 'Ingresa las dimensiones del producto en un formato claro.',
    defaultVoice: 'Ingresa las dimensiones del producto.',
    example: 'Ejemplo: 10 x 10 x 25 cm',
  },
  {
    field: 'images',
    selector: "[data-guide='image-upload']",
    title: 'Imagen del producto',
    defaultMessage: 'Carga una imagen del producto en formato JPG o PNG.',
    defaultVoice: 'Carga una imagen del producto en formato JPG o PNG.',
    example: 'Formatos permitidos: .jpg, .jpeg o .png',
  },
  {
    field: 'price',
    selector: "[data-guide='price']",
    title: 'Precio',
    defaultMessage: 'Ingresa un precio numerico mayor que 0.',
    defaultVoice: 'Ingresa el precio del producto.',
    example: 'Ejemplo: 12.50',
  },
  {
    field: 'unit',
    selector: "[data-guide='unit']",
    title: 'Unidad de medida',
    defaultMessage: 'Selecciona la unidad de medida correspondiente.',
    defaultVoice: 'Selecciona la unidad de medida correspondiente.',
    example: 'Ejemplo: Unidad, caja, paquete, kilogramo',
  },
  {
    field: 'sanitaryRegister',
    selector: "[data-guide='sanitary-register']",
    title: 'Registro sanitario',
    defaultMessage: 'Completa el registro sanitario si aplica para este producto.',
    defaultVoice: 'Si el producto requiere registro sanitario, completa este campo.',
    example: 'Completar solo cuando aplique',
  },
  {
    field: 'save',
    selector: "[data-guide='save-product']",
    title: 'Guardar producto',
    defaultMessage: 'Cuando los datos esten completos, presiona Guardar.',
    defaultVoice: 'Presiona Guardar para registrar el producto.',
    example: null,
  },
];

const guideStepFromField = (field: ProductGuideField, index: number): GuideStep => ({
  step: index + 1,
  selector: field.selector,
  title: field.title,
  message: field.defaultMessage,
  voice_text: field.defaultVoice,
  example: field.example,
});

export const buildFullProductGuide = (serverGuide?: GuideResponse | null): GuideResponse => {
  const serverSteps = serverGuide?.steps.filter((step) => step.selector !== "[data-guide='new-product']") ?? [];

  return {
    process: 'registro_producto',
    title: serverGuide?.title ?? 'Guia para registrar producto',
    steps: serverSteps.length ? serverSteps.map((step, index) => ({ ...step, step: index + 1 })) : productGuideFields.map(guideStepFromField),
  };
};

export const buildCorrectionGuide = (validation: ValidationResult): GuideResponse => {
  const groupedErrors = validation.errors.reduce<Record<string, ValidationIssue[]>>((accumulator, issue) => {
    accumulator[issue.field] = [...(accumulator[issue.field] ?? []), issue];
    return accumulator;
  }, {});

  const correctionSteps = Object.entries(groupedErrors).map(([fieldName, issues], index) => {
    const metadata = productGuideFields.find((field) => field.field === fieldName);
    const messages = issues.map((issue) => issue.message).join(' ');
    const reasons = issues.map((issue) => issue.reason).filter(Boolean).join(' ');
    const solutions = issues.map((issue) => issue.solution).filter(Boolean).join(' ');

    return {
      step: index + 1,
      selector: metadata?.selector ?? "[data-guide='save-product']",
      title: metadata ? `Corregir ${metadata.title.toLowerCase()}` : 'Corregir campo',
      message: `Problema: ${messages} Por que ocurre: ${reasons || 'El dato no cumple con el SOP-04.'} Como solucionarlo: ${solutions || 'Corrige el valor indicado y continua.'}`,
      voice_text: `${messages} ${solutions || 'Corrige este campo y continua.'}`,
      example: solutions || metadata?.example || null,
    };
  });

  return {
    process: 'registro_producto',
    title: 'Guia para corregir errores',
    steps: [
      ...correctionSteps,
      {
        step: correctionSteps.length + 1,
        selector: "[data-guide='save-product']",
        title: 'Volver a guardar',
        message: 'Cuando termines de corregir los errores, presiona Guardar otra vez para validar el producto.',
        voice_text: 'Cuando termines de corregir los errores, presiona Guardar otra vez.',
        example: null,
      },
    ],
  };
};

export const getMissingProductSteps = (validation: ValidationResult) => {
  const fieldsWithErrors = new Set(validation.errors.map((error) => error.field));

  return productGuideFields
    .filter((field) => field.field !== 'save' && fieldsWithErrors.has(field.field))
    .map((field, index) => ({
      step: index + 1,
      field: field.field,
      title: field.title,
      message: field.defaultMessage,
      selector: field.selector,
    }));
};
