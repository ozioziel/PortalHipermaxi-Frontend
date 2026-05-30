import React from 'react';

interface Props { value: string; onChange: (v: string) => void }

const ProductSearchBar: React.FC<Props> = ({value, onChange}) => {
  return (
    <input
      className="search-input"
      placeholder="Descripción Producto, Reg. Sanitario"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default ProductSearchBar;
