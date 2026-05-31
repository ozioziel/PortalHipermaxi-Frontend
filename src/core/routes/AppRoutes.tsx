import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../../features/home/pages/HomePage';
import ProductCreatePage from '../../features/products/pages/ProductCreatePage';
import ProductListPage from '../../features/products/pages/ProductListPage';
import AvdPage from '../../pages/avd/AvdPage';
import FacturasPage from '../../pages/facturas/FacturasPage';
import NuevoProveedorPage from '../../pages/nuevo-proveedor/NuevoProveedorPage';
import AdminLayout from '../../pages/admin/AdminLayout';
import AdminDashboardPage from '../../pages/admin/AdminDashboardPage';
import AdminTraceabilityPage from '../../pages/admin/AdminTraceabilityPage';
import AdminFrequentQuestionsPage from '../../pages/admin/AdminFrequentQuestionsPage';
import AdminAiInteractionsPage from '../../pages/admin/AdminAiInteractionsPage';
import AdminUserActivityPage from '../../pages/admin/AdminUserActivityPage';
import { useAuth } from '../auth/AuthContext';

export const AppRoutes: React.FC = () => {
  const ProtectedRoute: React.FC<{ allowedRoles: string[]; children: React.ReactNode }> = ({ allowedRoles, children }) => {
    const { user } = useAuth();
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/productos'} replace />;
    }

    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProtectedRoute allowedRoles={["cliente"]}><ProductListPage /></ProtectedRoute>} />
        <Route path="/productos/nuevo" element={<ProtectedRoute allowedRoles={["cliente"]}><ProductCreatePage /></ProtectedRoute>} />
        <Route path="/facturas" element={<ProtectedRoute allowedRoles={["cliente"]}><FacturasPage /></ProtectedRoute>} />
        <Route path="/avd" element={<ProtectedRoute allowedRoles={["cliente"]}><AvdPage /></ProtectedRoute>} />
        <Route path="/nuevo-proveedor" element={<ProtectedRoute allowedRoles={["cliente"]}><NuevoProveedorPage /></ProtectedRoute>} />
        <Route path="/proveedor/acceso" element={<Navigate to="/nuevo-proveedor" replace />} />
        <Route path="/proveedor/registro" element={<Navigate to="/nuevo-proveedor" replace />} />
        <Route path="/proveedor/exito" element={<Navigate to="/nuevo-proveedor" replace />} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="trazabilidad" element={<AdminTraceabilityPage />} />
          <Route path="preguntas-frecuentes" element={<AdminFrequentQuestionsPage />} />
          <Route path="interacciones-ia" element={<AdminAiInteractionsPage />} />
          <Route path="actividad-usuarios" element={<AdminUserActivityPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
