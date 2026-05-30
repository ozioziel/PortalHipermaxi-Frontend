import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from '../../features/home/pages/HomePage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
