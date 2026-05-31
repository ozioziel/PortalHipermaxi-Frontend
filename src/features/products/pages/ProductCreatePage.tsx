import React, {useState} from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import ProductFormSections from '../components/ProductFormSections';
import FormProgressBar from '../../../core/components/ui/FormProgressBar';
import { useNavigate } from 'react-router-dom';
import { ProductStorage } from '../services/ProductStorage';
import { initialProductFormState, productFromForm, validationErrorsByField } from '../utils/productForm';
import { HiperFlowApi } from '../../support/services/HiperFlowApi';
import { buildCorrectionGuide, buildFullProductGuide } from '../../support/data/productGuideFields';
import GuideOverlay from '../../support/components/GuideOverlay';
import type { GuideResponse, ProductFormState, ValidationResult } from '../../support/types';

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<ProductFormState>(initialProductFormState);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [guide, setGuide] = useState<GuideResponse | null>(null);
  const [guideActive, setGuideActive] = useState(false);

  const updateFormState = (field: keyof ProductFormState, value: ProductFormState[keyof ProductFormState]) => {
    setFormState((current) => ({ ...current, [field]: value }));
    setValidationResult(null);
  };

  const startGuide = async () => {
    const serverGuide = await HiperFlowApi.getProductGuide().catch(() => null);
    setGuide(buildFullProductGuide(serverGuide));
    setGuideActive(true);
  };

  const handleSave = async () => {
    const result = await HiperFlowApi.validateProduct(formState);
    setValidationResult(result);

    if (!result.valid) {
      setGuide(buildCorrectionGuide(result));
      setGuideActive(true);
      return;
    }

    ProductStorage.add(productFromForm(formState));
    navigate('/productos');
  };

  return (
    <MainLayout>
      <div style={{marginTop:16}}>
        <h2>Registrar nuevo producto</h2>
        <p>Completa la informacion del producto para enviarlo a revision.</p>

        <div style={{marginTop:12}} className="card">
          <FormProgressBar
            totalSteps={4}
            completedSteps={(() => {
              const s = formState;
              const basic = Boolean(s.description.trim() && s.internalCode.trim() && s.label.trim());
              const sanitary = Boolean(s.dimensions.trim() && s.sanitaryRegister.trim());
              const images = Boolean(s.images && s.images.length > 0);
              const pricing = Boolean(s.price && s.unit);
              return [basic, sanitary, images, pricing].filter(Boolean).length;
            })()}
            labels={["Datos principales","Medidas","Imágenes","Precios"]}
          />

          <ProductFormSections
            formState={formState}
            errors={validationErrorsByField(validationResult)}
            onChange={updateFormState}
          />

          {validationResult && (
            <div className={`validation-summary ${validationResult.valid ? 'ok' : 'error'}`}>
              <strong>{validationResult.recommendation}</strong>
            </div>
          )}

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
            <button className="btn btn-white" onClick={() => navigate('/productos')}>Cancelar</button>
            <button className="btn btn-white" onClick={() => void startGuide()}>Guia</button>
            <button className="btn btn-primary" data-guide="save-product" onClick={() => void handleSave()}>Guardar</button>
          </div>
        </div>
      </div>
      <GuideOverlay active={guideActive} guide={guide} onClose={() => setGuideActive(false)} />
    </MainLayout>
  );
};

export default ProductCreatePage;
