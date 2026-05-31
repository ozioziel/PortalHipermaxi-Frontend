import React from 'react';
import {appConfig} from '../../constants/appConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
        <span style={{fontWeight:700,color:'var(--text-dark)'}}>Portal Hipermaxi</span>
        <span>{appConfig.footerText}</span>
      </div>
    </footer>
  );
};

export default Footer;
