import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../../features/home/pages/HomePage';
import ProductCreatePage from '../../features/products/pages/ProductCreatePage';
import ProductListPage from '../../features/products/pages/ProductListPage';
import AvdPage from '../../pages/avd/AvdPage';
import FacturasPage from '../../pages/facturas/FacturasPage';
import NuevoProveedorPage from '../../pages/nuevo-proveedor/NuevoProveedorPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductListPage />} />
        <Route path="/productos/nuevo" element={<ProductCreatePage />} />
        <Route path="/facturas" element={<FacturasPage />} />
        <Route path="/avd" element={<AvdPage />} />
        <Route path="/nuevo-proveedor" element={<NuevoProveedorPage />} />
        <Route path="/proveedor/acceso" element={<Navigate to="/nuevo-proveedor" replace />} />
        <Route path="/proveedor/registro" element={<Navigate to="/nuevo-proveedor" replace />} />
        <Route path="/proveedor/exito" element={<Navigate to="/nuevo-proveedor" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
