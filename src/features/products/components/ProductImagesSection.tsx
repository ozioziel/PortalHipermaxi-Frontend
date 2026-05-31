import React from 'react';
import type { ProductImageState } from '../../support/types';

interface Props {
  images: ProductImageState[];
  error?: string;
  onImagesChange: (images: ProductImageState[]) => void;
}

const ProductImagesSection: React.FC<Props> = ({ images, error, onImagesChange }) => {
  const handleFiles = (files: FileList | null) => {
    onImagesChange(Array.from(files ?? []).map((file) => ({
      filename: file.name,
      type: file.type,
      size: file.size,
    })));
  };

  return (
    <div>
      <div style={{marginBottom:8}}><strong>Imagenes del Producto</strong></div>
      <div className="image-placeholder">
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:34,color:'#f3a08a'}}>IMG</div>
          <div className="text-muted">
            {images.length ? images.map((image) => image.filename).join(', ') : 'Sin imagen cargada'}
          </div>
        </div>
      </div>
      <div style={{marginTop:8}}>
        <label className="camera-btn" data-guide="image-upload">
          Seleccionar imagen
          <input
            data-ai-field="images"
            name="images"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
            multiple
            style={{display:'none'}}
            onChange={(event) => handleFiles(event.target.files)}
          />
        </label>
        {error && <div className="field-error" style={{marginTop:8}}>{error}</div>}
      </div>
    </div>
  );
};

export default ProductImagesSection;
