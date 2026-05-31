import React, {useState} from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import '../products.css';
import ProductToolbar from '../components/ProductToolbar';
import ProductTable from '../components/ProductTable';
import ProductFormModal from '../components/ProductFormModal';
import type { Product } from '../types/product.types';
import { ProductStorage } from '../services/ProductStorage';
import { initialProductFormState, productFromForm, validationErrorsByField } from '../utils/productForm';
import GuideOverlay from '../../support/components/GuideOverlay';
import { buildCorrectionGuide, buildFullProductGuide } from '../../support/data/productGuideFields';
import { HiperFlowApi } from '../../support/services/HiperFlowApi';
import type { GuideResponse, ProductFormState, ValidationResult } from '../../support/types';

const ProductListPage: React.FC = () => {
  const [showNew, setShowNew] = useState(false);
  const [products, setProducts] = useState<Product[]>(() => ProductStorage.list());
  const [formState, setFormState] = useState<ProductFormState>(initialProductFormState);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [guide, setGuide] = useState<GuideResponse | null>(null);
  const [guideActive, setGuideActive] = useState(false);

  const updateFormState = (field: keyof ProductFormState, value: ProductFormState[keyof ProductFormState]) => {
    setFormState((current) => ({ ...current, [field]: value }));
    setValidationResult(null);
  };

  const startGuide = async () => {
    setShowNew(true);
    const serverGuide = await HiperFlowApi.getProductGuide().catch(() => null);
    const productGuide = buildFullProductGuide(serverGuide);
    setGuide(productGuide);
    setGuideActive(true);
    void HiperFlowApi.logInteraction({
      process: 'registro_producto',
      type: 'guide_step',
      user_message: 'Inicio de guia',
      assistant_response: productGuide.title,
      intent: 'START_GUIDE',
      confidence: 1,
      action_taken: 'START_GUIDE',
      metadata: { totalSteps: productGuide.steps.length },
    }).catch(() => undefined);
  };

  const validateForm = async () => {
    const result = await HiperFlowApi.validateProduct(formState);
    setValidationResult(result);
    return result;
  };

  const startCorrectionGuide = (result: ValidationResult) => {
    const correctionGuide = buildCorrectionGuide(result);
    setGuide(correctionGuide);
    setGuideActive(true);
    void HiperFlowApi.logInteraction({
      process: 'registro_producto',
      type: 'validation',
      user_message: 'Guardar con errores',
      assistant_response: result.recommendation,
      intent: 'ERROR_DETECTED',
      confidence: result.confidence,
      action_taken: 'START_CORRECTION_GUIDE',
      metadata: {
        errors: result.errors,
        totalSteps: correctionGuide.steps.length,
      },
    }).catch(() => undefined);
  };

  const handleSave = async () => {
    const result = await validateForm();

    if (!result.valid) {
      startCorrectionGuide(result);
      return;
    }

    const nextProducts = ProductStorage.add(productFromForm(formState));
    setProducts(nextProducts);
    setShowNew(false);
    setFormState(initialProductFormState);
    setValidationResult(null);
    setGuideActive(false);

    void HiperFlowApi.logInteraction({
      process: 'registro_producto',
      type: 'validation',
      user_message: 'Producto listo para guardar',
      assistant_response: result.recommendation,
      intent: 'PRODUCT_READY',
      confidence: result.confidence,
      action_taken: 'PRODUCT_READY_TO_SAVE',
      metadata: { formState },
    }).catch(() => undefined);
  };

  return (
    <MainLayout>
      <div className="system-bar">
        <div className="inner container">
          <div className="left"><strong>Portal Hipermaxi</strong></div>
          <div className="right">
            <button className="btn-small btn-white">Salir</button>
            <button className="btn-small btn-white" onClick={() => void startGuide()}>Soporte y Ayuda</button>
          </div>
        </div>
        <div className="indicator" />
      </div>

      <div style={{marginTop:16}} className="products-container" data-ai-section="Lista de productos">
        <h2>Lista de Productos</h2>
        <ProductToolbar onNew={() => setShowNew(true)} />
        <div style={{marginTop:8}} className="tabs">
          <div className="tab">Productos</div>
          <div className="tab">Por aprobar</div>
        </div>

        <ProductTable products={products} />
      </div>

      {showNew && (
        <ProductFormModal
          formState={formState}
          errors={validationErrorsByField(validationResult)}
          validationResult={validationResult}
          onClose={() => setShowNew(false)}
          onChange={updateFormState}
          onSave={() => void handleSave()}
        />
      )}

      <GuideOverlay active={guideActive} guide={guide} onClose={() => setGuideActive(false)} />
    </MainLayout>
  );
};

export default ProductListPage;
