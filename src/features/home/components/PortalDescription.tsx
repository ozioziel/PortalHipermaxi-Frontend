import React from 'react';
import AppCard from '../../../core/components/ui/AppCard';

const PortalDescription: React.FC = () => {
  return (
    <div className="portal-description">
      <AppCard>
        <p style={{margin:0}}>
          Portal Hipermaxi es una plataforma web dirigida a los proveedores de Hipermaxi S.A y sus filiales. Permite
          acceder a información y servicios especializados de una manera ágil, oportuna y segura que garantiza la
          comunicación constante con nosotros a través del grupo de negocios (Comercial / Compras).
        </p>
      </AppCard>
    </div>
  );
};

export default PortalDescription;
