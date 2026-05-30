import React, {useState} from 'react';
import ProductImagesSection from './ProductImagesSection';
import PriceCatalogSection from './PriceCatalogSection';

const ProductFormSections: React.FC = () => {
  const [openSanitary, setOpenSanitary] = useState(false);
  const [openImages, setOpenImages] = useState(true);
  const [openCatalog, setOpenCatalog] = useState(true);

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="field">
            <label>Descripción</label>
            <input />
          </div>
          <div className="field">
            <label>U.M. de Venta</label>
            <select>
              <option>Unidad</option>
            </select>
          </div>

          <div className="field">
            <label>Código interno proveedor</label>
            <input />
          </div>
          <div className="field">
            <label>Dimensiones - Alto</label>
            <input />
          </div>

          <div className="field">
            <label>Proveedor</label>
            <input />
          </div>
          <div className="field">
            <label>Dimensiones - Largo</label>
            <input />
          </div>

          <div className="field">
            <label>¿Sin Barra?</label>
            <input type="checkbox" />
          </div>
          <div className="field">
            <label>Dimensiones - Ancho</label>
            <input />
          </div>

          <div className="field">
            <label>Código Barra</label>
            <input />
          </div>
          <div className="field">
            <label>Unidad Medida Producto - Peso</label>
            <input />
          </div>

        </div>

        <div className="accordion">
          <div className="head" onClick={() => setOpenSanitary(!openSanitary)}>
            <strong>Registro Sanitario</strong>
            <span>{openSanitary ? '-' : '+'}</span>
          </div>
          {openSanitary && <div className="body">Contenido Registro Sanitario (simulado)</div>}
        </div>

        <div className="accordion">
          <div className="head">
            <strong>Registro Sanitario AGEMED</strong>
            <span>v</span>
          </div>
        </div>

        <div className="accordion">
          <div className="head" onClick={() => setOpenImages(!openImages)}>
            <strong>Imágenes del Producto</strong>
            <span>{openImages ? '-' : '+'}</span>
          </div>
          {openImages && <div className="body"><ProductImagesSection /></div>}
        </div>

        <div className="accordion">
          <div className="head" onClick={() => setOpenCatalog(!openCatalog)}>
            <strong>Catálogo de precios</strong>
            <span>{openCatalog ? '-' : '+'}</span>
          </div>
          {openCatalog && <div className="body"><PriceCatalogSection /></div>}
        </div>
      </div>
    </div>
  );
};

export default ProductFormSections;
