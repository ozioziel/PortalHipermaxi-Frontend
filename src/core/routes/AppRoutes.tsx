import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from '../../features/home/pages/HomePage';
import ProductListPage from '../../features/products/pages/ProductListPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductListPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
