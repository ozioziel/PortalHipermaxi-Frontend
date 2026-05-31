import React, { useMemo, useState } from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import '../products.css';
import ProductToolbar from '../components/ProductToolbar';
import ProductTable from '../components/ProductTable';
import ProductFormModal from '../components/ProductFormModal';
import type { Product } from '../types/product.types';
import { ProductStorage } from '../services/ProductStorage';
import {
  initialProductFormState,
  productFromForm,
  validationErrorsByField,
} from '../utils/productForm';
import GuideOverlay from '../../support/components/GuideOverlay';
import { buildCorrectionGuide, buildFullProductGuide } from '../../support/data/productGuideFields';
import { HiperFlowApi } from '../../support/services/HiperFlowApi';
import type { GuideResponse, ProductFormState, ValidationResult } from '../../support/types';

const ProductListPage: React.FC = () => {
  const [showNew, setShowNew] = useState(false);
  const [products, setProducts] = useState<Product[]>(() => ProductStorage.list());
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'pending'>('products');
  const [formState, setFormState] = useState<ProductFormState>(initialProductFormState);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [guide, setGuide] = useState<GuideResponse | null>(null);
  const [guideActive, setGuideActive] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      if (!normalized) return true;
      return [product.description, product.supplierBar, product.sanitaryRegistry].some((value) =>
        value.toLowerCase().includes(normalized),
      );
    });
  }, [products, query]);

  const activeProducts = activeTab === 'products' ? filteredProducts : [];

  const updateFormState = (
    field: keyof ProductFormState,
    value: ProductFormState[keyof ProductFormState],
  ) => {
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

  const handleDelete = (productId: number) => {
    if (!window.confirm('¿Deseas eliminar este producto?')) {
      return;
    }

    const nextProducts = products.filter((product) => product.id !== productId);
    setProducts(nextProducts);
    ProductStorage.delete(productId);
  };

  const exportToExcel = () => {
    const rows = activeProducts.map((product) => ([
      product.description,
      product.supplierBar,
      product.sanitaryRegistry,
      product.sanitaryRegistryDate,
    ]));

    const csvRows = [
      ['Producto', 'Barra Proveedor', 'Reg. Sanitario', 'Fecha Reg. San.'],
      ...rows,
    ]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'productos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div style={{ marginTop: 16 }} className="products-container" data-ai-section="Lista de productos">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#334155',
              }}
            >
              Productos
            </div>
            <h2 style={{ margin: '8px 0 0' }}>Lista de Productos</h2>
          </div>

          <button className="btn btn-secondary" onClick={() => void startGuide()}>
            Guía del registro
          </button>
        </div>

        <ProductToolbar
          query={query}
          onChange={setQuery}
          onNew={() => setShowNew(true)}
          onClear={() => setQuery('')}
          onExport={exportToExcel}
          onFilterClick={() => setActiveTab('products')}
        />

        <div style={{ marginTop: 8 }} className="tabs">
          <div
            className={`tab${activeTab === 'products' ? ' active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Productos
          </div>
          <div
            className={`tab${activeTab === 'pending' ? ' active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Por aprobar
          </div>
        </div>

        {activeTab === 'pending' ? (
          <div
            style={{ padding: 20, background: '#f8fafc', borderRadius: 6, marginTop: 16, color: '#334155' }}
          >
            <strong>No hay productos pendientes de aprobación.</strong>
            <p style={{ margin: '8px 0 0' }}>Navega a “Productos” para ver la lista completa.</p>
          </div>
        ) : activeProducts.length === 0 ? (
          <div
            style={{ padding: 20, background: '#f8fafc', borderRadius: 6, marginTop: 16, color: '#334155' }}
          >
            No se encontraron productos para la búsqueda actual.
          </div>
        ) : (
          <ProductTable products={activeProducts} onDelete={handleDelete} />
        )}
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
