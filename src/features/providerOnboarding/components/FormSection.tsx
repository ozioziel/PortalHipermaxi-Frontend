import React from 'react';

interface Props { title: string; children?: React.ReactNode; help?: string }

export const FormSection: React.FC<Props> = ({title, children}) => {
  return (
    <section style={{marginBottom:12}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h4 style={{margin:0}}>{title}</h4>
      </div>
      <div style={{marginTop:8}}>{children}</div>
    </section>
  );
};

export default FormSection;
