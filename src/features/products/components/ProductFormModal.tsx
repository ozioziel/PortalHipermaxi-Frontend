import React from 'react';
import ProductFormSections from './ProductFormSections';
import '../products.css';
import type { ProductFormState, ValidationResult } from '../../support/types';
import { getMissingProductSteps } from '../../support/data/productGuideFields';

interface Props {
  formState: ProductFormState;
  errors: Partial<Record<keyof ProductFormState | 'images', string>>;
  validationResult: ValidationResult | null;
  onClose: () => void;
  onChange: (field: keyof ProductFormState, value: ProductFormState[keyof ProductFormState]) => void;
  onSave: () => void;
}

const ProductFormModal: React.FC<Props> = ({formState, errors, validationResult, onClose, onChange, onSave}) => {
  const missingSteps = validationResult && !validationResult.valid ? getMissingProductSteps(validationResult) : [];

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Nuevo Producto</h3>
          <div>
            <button className="btn btn-white" data-ai-action="cancel-product" onClick={onClose}>Cancelar</button>
            <button
              className="btn btn-primary"
              data-guide="save-product"
              data-ai-action="save-product"
              style={{marginLeft:8}}
              onClick={onSave}
            >
              Guardar
            </button>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <ProductFormSections formState={formState} errors={errors} onChange={onChange} />
        </div>

        {validationResult && (
          <div className={`validation-summary ${validationResult.valid ? 'ok' : 'error'}`}>
            <strong>{validationResult.recommendation}</strong>
            {!validationResult.valid && (
              <>
                <div className="missing-steps-panel">
                  <strong>Te faltan estos pasos por completar:</strong>
                  <ol>
                    {missingSteps.map((step) => (
                      <li key={step.field}>
                        <span>{step.title}</span>
                        <small>{step.message}</small>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="validation-detail-list">
                  {validationResult.errors.map((error, index) => (
                    <div className="validation-detail-item" key={`${error.field}-${index}`}>
                      <div>{error.message}</div>
                      {error.reason && <small>Por que: {error.reason}</small>}
                      {error.solution && <small>Como solucionarlo: {error.solution}</small>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormModal;
