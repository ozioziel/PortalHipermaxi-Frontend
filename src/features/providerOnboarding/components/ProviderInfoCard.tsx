import React from 'react';

interface Props { title: string; children?: React.ReactNode }

export const ProviderInfoCard: React.FC<Props> = ({title, children}) => {
  return (
    <div style={{background:'white',padding:12,borderRadius:6,border:'1px solid #e6e6e6',marginBottom:12}}>
      <h4 style={{margin:'0 0 8px 0'}}>{title}</h4>
      <div>{children}</div>
    </div>
  );
};

export default ProviderInfoCard;
