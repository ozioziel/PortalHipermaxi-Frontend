import React from 'react';
import MainLayout from '../../../core/components/layout/MainLayout';
import ProviderAccessHero from '../components/ProviderAccessHero';
import ProviderProcessSteps from '../components/ProviderProcessSteps';
import ProviderAccessForm from '../components/ProviderAccessForm';
import '../providerOnboarding.css';
import type { ProviderAccessFormData } from '../types/providerOnboarding.types';

const ProviderAccessPage: React.FC = () => {
  const formData: ProviderAccessFormData | null = null;

  return (
    <MainLayout>
      <div style={{marginTop:16}}>
        <ProviderAccessHero />
        <div style={{height:12}} />
        <div className="onboard-container">
          <ProviderProcessSteps />
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
            <ProviderAccessForm initial={formData ?? undefined} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProviderAccessPage;
