import React from 'react';
import {appAssets} from '../../constants/appAssets';

interface AppLogoProps {
  size?: number;
  alt?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({size = 40, alt = 'Hipermaxi'}) => {
  return (
    <img src={appAssets.logo} alt={alt} style={{width: size, height: 'auto', display: 'block'}} />
  );
};

export default AppLogo;
