import React from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import ProviderAccessHero from '../components/ProviderAccessHero';
import ProviderProcessSteps from '../components/ProviderProcessSteps';
import ProviderAccessForm from '../components/ProviderAccessForm';
import '../providerOnboarding.css';

const ProviderAccessPage: React.FC = () => {
  return (
    <MainLayout>
      <div style={{marginTop:16}}>
        <ProviderAccessHero />
        <div style={{height:12}} />
        <div className="onboard-container" data-ai-section="Registro de proveedor">
          <ProviderProcessSteps />
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
            <ProviderAccessForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProviderAccessPage;
