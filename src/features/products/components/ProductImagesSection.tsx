import React from 'react';

const ProductImagesSection: React.FC = () => {
  const handleClick = () => {
    console.log('Imagen -- simular carga');
  };

  return (
    <div>
      <div style={{marginBottom:8}}><strong>Imágenes del Producto</strong></div>
      <div className="image-placeholder">
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:40,color:'#f3a08a'}}>📷</div>
          <div className="text-muted">Placeholder imagen</div>
        </div>
      </div>
      <div style={{marginTop:8}}>
        <button className="camera-btn" onClick={handleClick}>📸</button>
      </div>
    </div>
  );
};

export default ProductImagesSection;
