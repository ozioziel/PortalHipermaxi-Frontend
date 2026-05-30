import React, {useState} from 'react';
import ProductSearchBar from './ProductSearchBar';

interface Props { onNew: () => void }

const ProductToolbar: React.FC<Props> = ({onNew}) => {
  const [query, setQuery] = useState('');

  return (
    <div className="toolbar">
      <button className="btn-small btn-green">Filtros</button>

      <ProductSearchBar value={query} onChange={setQuery} />

      <div style={{marginLeft:'auto',display:'flex',gap:8}}>
        <button className="btn-small btn-green">Limpiar</button>
        <button className="btn-small btn-green">Excel</button>
        <button className="btn-small btn-orange" onClick={onNew}>Nuevo</button>
      </div>
    </div>
  );
};

export default ProductToolbar;
