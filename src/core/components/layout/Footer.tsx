import React from 'react';
import {appConfig} from '../../constants/appConfig';

export const Footer: React.FC = () => {
  return (
    <footer style={{padding:'20px 0',marginTop:32,background:'transparent'}}>
      <div className="container" style={{textAlign:'center',color:'var(--text-muted)'}}>
        {appConfig.footerText}
      </div>
    </footer>
  );
};

export default Footer;
