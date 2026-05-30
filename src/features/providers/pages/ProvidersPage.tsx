import React from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';

const ProvidersPage: React.FC = () => {
	const navigate = useNavigate();
	return (
		<MainLayout>
			<div style={{marginTop:24}}>
				<h2>Proveedores</h2>
				<p>Página de proveedores (placeholder)</p>
				<div style={{display:'flex',gap:8}}>
					<button className="btn btn-white" onClick={()=>navigate('/proveedor/acceso')}>Crear acceso proveedor</button>
					<button className="btn btn-primary" onClick={()=>navigate('/productos')}>Ir a productos</button>
				</div>
			</div>
		</MainLayout>
	);
};

export default ProvidersPage;
