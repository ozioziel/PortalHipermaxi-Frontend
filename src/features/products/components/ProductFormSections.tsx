import React, {useState} from 'react';
import ProductImagesSection from './ProductImagesSection';
import PriceCatalogSection from './PriceCatalogSection';
import type { ProductFormState } from '../../support/types';

interface Props {
  formState: ProductFormState;
  errors: Partial<Record<keyof ProductFormState | 'images', string>>;
  onChange: (field: keyof ProductFormState, value: ProductFormState[keyof ProductFormState]) => void;
}

const ProductFormSections: React.FC<Props> = ({ formState, errors, onChange }) => {
  const [openSanitary, setOpenSanitary] = useState(true);
  const [openImages, setOpenImages] = useState(true);
  const [openCatalog, setOpenCatalog] = useState(true);

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
        <div className="form-grid">
          <div className="field">
            <label>Descripcion</label>
            <input
              data-guide="description"
              data-ai-field="description"
              name="description"
              value={formState.description}
              onChange={(event) => onChange('description', event.target.value)}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>

          <div className="field">
            <label>U.M. de Venta</label>
            <select
              data-guide="unit"
              data-ai-field="unit"
              name="unit"
              value={formState.unit}
              onChange={(event) => onChange('unit', event.target.value)}
            >
              <option value="">Seleccione</option>
              <option>Unidad</option>
              <option>Caja</option>
              <option>Paquete</option>
              <option>Kilogramo</option>
            </select>
            {errors.unit && <span className="field-error">{errors.unit}</span>}
          </div>

          <div className="field">
            <label>Codigo interno proveedor</label>
            <input
              data-guide="internal-code"
              data-ai-field="internalCode"
              name="internalCode"
              value={formState.internalCode}
              onChange={(event) => onChange('internalCode', event.target.value)}
            />
            {errors.internalCode && <span className="field-error">{errors.internalCode}</span>}
          </div>

          <div className="field">
            <label>Etiqueta</label>
            <input
              data-guide="label"
              data-ai-field="label"
              name="label"
              value={formState.label}
              onChange={(event) => onChange('label', event.target.value)}
            />
            {errors.label && <span className="field-error">{errors.label}</span>}
          </div>

          <div className="field">
            <label>Codigo Barra</label>
            <input
              data-guide="barcode"
              data-ai-field="barcode"
              name="barcode"
              value={formState.barcode}
              onChange={(event) => onChange('barcode', event.target.value)}
            />
            {errors.barcode && <span className="field-error">{errors.barcode}</span>}
          </div>

          <div className="field">
            <label>Dimensiones</label>
            <input
              data-guide="dimensions"
              data-ai-field="dimensions"
              name="dimensions"
              placeholder="10 x 10 x 25 cm"
              value={formState.dimensions}
              onChange={(event) => onChange('dimensions', event.target.value)}
            />
            {errors.dimensions && <span className="field-error">{errors.dimensions}</span>}
          </div>

          <div className="field">
            <label>Proveedor</label>
            <input data-ai-field="supplierName" name="supplierName" value="Proveedor demo" readOnly />
          </div>

          <div className="field">
            <label>Sin Barra</label>
            <input type="checkbox" />
          </div>
        </div>

        <div className="accordion">
          <div className="head" onClick={() => setOpenSanitary(!openSanitary)}>
            <strong>Registro Sanitario</strong>
            <span>{openSanitary ? '-' : '+'}</span>
          </div>
          {openSanitary && (
            <div className="body">
              <div className="field">
                <label>Registro sanitario</label>
                <input
                  data-guide="sanitary-register"
                  data-ai-field="sanitaryRegister"
                  name="sanitaryRegister"
                  value={formState.sanitaryRegister}
                  onChange={(event) => onChange('sanitaryRegister', event.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="accordion">
          <div className="head">
            <strong>Registro Sanitario AGEMED</strong>
            <span>v</span>
          </div>
        </div>

        <div className="accordion">
          <div className="head" onClick={() => setOpenImages(!openImages)}>
            <strong>Imagenes del Producto</strong>
            <span>{openImages ? '-' : '+'}</span>
          </div>
          {openImages && (
            <div className="body">
              <ProductImagesSection
                images={formState.images}
                error={errors.images}
                onImagesChange={(images) => onChange('images', images)}
              />
            </div>
          )}
        </div>

        <div className="accordion">
          <div className="head" onClick={() => setOpenCatalog(!openCatalog)}>
            <strong>Catalogo de precios</strong>
            <span>{openCatalog ? '-' : '+'}</span>
          </div>
          {openCatalog && (
            <div className="body">
              <PriceCatalogSection
                price={formState.price}
                error={errors.price}
                onPriceChange={(price) => onChange('price', price)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFormSections;
