import React, { useRef } from 'react';
import ProductSearchBar from './ProductSearchBar';

interface Props {
  query: string;
  onChange: (value: string) => void;
  onNew: () => void;
  onClear: () => void;
  onExport: () => void;
  onFilterClick: () => void;
}

const ProductToolbar: React.FC<Props> = ({ query, onChange, onNew, onClear, onExport, onFilterClick }) => {
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div className="toolbar">
      <button className="btn-small btn-green" onClick={() => {
        searchRef.current?.focus();
        onFilterClick();
      }}>
        Filtros
      </button>

      <ProductSearchBar ref={searchRef} value={query} onChange={onChange} />

      <div style={{marginLeft:'auto',display:'flex',gap:8}}>
        <button className="btn-small btn-green" onClick={onClear}>Limpiar</button>
        <button className="btn-small btn-green" onClick={onExport}>Excel</button>
        <button className="btn-small btn-orange" data-guide="new-product" data-ai-action="new-product" onClick={onNew}>Nuevo</button>
      </div>
    </div>
  );
};

export default ProductToolbar;
