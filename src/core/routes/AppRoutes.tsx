import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from '../../features/home/pages/HomePage';
import ProductListPage from '../../features/products/pages/ProductListPage';
import ProductCreatePage from '../../features/products/pages/ProductCreatePage';
import ProviderAccessPage from '../../features/providerOnboarding/pages/ProviderAccessPage';
import ProviderRegistrationFormPage from '../../features/providerOnboarding/pages/ProviderRegistrationFormPage';
import ProviderSuccessPage from '../../features/providerOnboarding/pages/ProviderSuccessPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductListPage />} />
        <Route path="/productos/nuevo" element={<ProductCreatePage />} />
        <Route path="/proveedor/acceso" element={<ProviderAccessPage />} />
        <Route path="/proveedor/registro" element={<ProviderRegistrationFormPage />} />
        <Route path="/proveedor/exito" element={<ProviderSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
