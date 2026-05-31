import React from 'react';
import HelpTooltip from '../../../components/ui/HelpTooltip';

interface Props {
  label: string;
  name?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  help?: string;
  type?: string;
}

export const FormField: React.FC<Props> = ({label, name, value, onChange, placeholder, help, type='text'}) => {
  return (
    <div className="field">
      <label>{label}{help && <HelpTooltip text={help} />}</label>
      <input data-ai-field={name} name={name} type={type} value={value ?? ''} placeholder={placeholder} onChange={(e)=>onChange && onChange(e.target.value)} />
    </div>
  );
};

export default FormField;
