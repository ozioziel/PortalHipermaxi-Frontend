import React from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import HomeHero from '../components/HomeHero';
import FeatureCard from '../components/FeatureCard';
import PortalDescription from '../components/PortalDescription';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <HomeHero />

      <section className="features">
        <h2>Portal Hipermaxi</h2>
        <div className="features-grid" style={{marginTop:12}}>
          <FeatureCard title="Proveedores" description="Administracion de Proveedores." />
          <FeatureCard title="Productos & Catálogos de Precios" description="Está plataforma permite a nuestros proveedores mantenernos actualizados." />
          <FeatureCard title="Órdenes de Compra" description="Consulta información relacionada con tus órdenes de compra." />
          <FeatureCard title="Comunicación Comercial" description="Mantén una comunicación ágil y segura con el área Comercial / Compras." />
        </div>
      </section>

      <PortalDescription />
    </MainLayout>
  );
};

export default HomePage;
