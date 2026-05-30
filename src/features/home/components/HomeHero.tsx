import React from 'react';
import AppLogo from '../../../core/components/ui/AppLogo';
import AppCard from '../../../core/components/ui/AppCard';
import {SectionTitle} from '../../../core/components/ui/SectionTitle';

const HomeHero: React.FC = () => {
  return (
    <section className="hero">
      <AppLogo size={140} />
      <h1>Portal Hipermaxi</h1>
      <p className="text-muted">Plataforma para proveedores de Hipermaxi S.A.</p>
      <div className="hero-card" style={{width:'100%'}}>
        <AppCard className="feature-accent">
          <SectionTitle title="Portal Hipermaxi" subtitle="Plataforma para proveedores de Hipermaxi S.A." />
          <p className="text-muted">Accede a información y servicios especializados de manera ágil y segura.</p>
        </AppCard>
      </div>
    </section>
  );
};

export default HomeHero;
