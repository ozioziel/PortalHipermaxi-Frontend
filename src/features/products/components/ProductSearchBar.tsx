import React from 'react';

interface Props { value: string; onChange: (v: string) => void }

const ProductSearchBar = React.forwardRef<HTMLInputElement, Props>(({value, onChange}, ref) => (
  <input
    ref={ref}
    className="search-input"
    placeholder="Descripción Producto, Reg. Sanitario"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label="Buscar productos"
  />
));

ProductSearchBar.displayName = 'ProductSearchBar';

export default ProductSearchBar;
