import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import HelpTooltip from '../../../components/ui/HelpTooltip';
import type { ProviderAccessFormData } from '../types/providerOnboarding.types';
import { providerHelpTexts } from '../data/providerHelpTexts';
import { validateAccessForm } from '../utils/providerValidators';

interface Props { initial?: ProviderAccessFormData }

export const ProviderAccessForm: React.FC<Props> = ({initial}) => {
  const [form, setForm] = useState<ProviderAccessFormData>(initial || {
    providerName:'', legalName:'', nit:'', email:'', phone:'', commerceActivity:'', city:'', hasProviderCode:'no'
  });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const navigate = useNavigate();

  const handleChange = (
    k: keyof ProviderAccessFormData,
    v: ProviderAccessFormData[keyof ProviderAccessFormData],
  ) => setForm(prev=>({...prev,[k]:v}));

  const handleSubmit = () =>{
    const errs = validateAccessForm(form);
    setErrors(errs);
    if (Object.keys(errs).length===0){
      navigate('/proveedor/registro',{state: form});
    }
  };

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:8}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <div>
            <label style={{display:'flex',alignItems:'center',gap:6,fontWeight:600,color:'#475569'}}>
              Nombre del proveedor
              <HelpTooltip text={providerHelpTexts.providerName} ariaLabel="Ayuda Nombre del proveedor" />
            </label>
            <input data-ai-field="providerName" data-ai-alias="supplierName" name="providerName" value={form.providerName} onChange={e=>handleChange('providerName',e.target.value)} />
            {errors.providerName && <div className="error">{errors.providerName}</div>}
          </div>
          <div>
            <label style={{display:'flex',alignItems:'center',gap:6,fontWeight:600,color:'#475569'}}>
              Razón social
              <HelpTooltip text={providerHelpTexts.legalName} ariaLabel="Ayuda Razón social" />
            </label>
            <input data-ai-field="legalName" name="legalName" value={form.legalName} onChange={e=>handleChange('legalName',e.target.value)} />
            {errors.legalName && <div className="error">{errors.legalName}</div>}
          </div>

          <div>
            <label style={{display:'flex',alignItems:'center',gap:6,fontWeight:600,color:'#475569'}}>
              NIT
              <HelpTooltip text={providerHelpTexts.nit} ariaLabel="Ayuda NIT" />
            </label>
            <input data-ai-field="nit" name="nit" value={form.nit} onChange={e=>handleChange('nit',e.target.value)} />
            {errors.nit && <div className="error">{errors.nit}</div>}
          </div>

          <div>
            <label style={{display:'flex',alignItems:'center',gap:6,fontWeight:600,color:'#475569'}}>
              Correo empresarial
              <HelpTooltip text={providerHelpTexts.email} ariaLabel="Ayuda Correo empresarial" />
            </label>
            <input data-ai-field="email" name="email" value={form.email} onChange={e=>handleChange('email',e.target.value)} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div>
            <label style={{display:'flex',alignItems:'center',gap:6,fontWeight:600,color:'#475569'}}>
              Teléfono
              <HelpTooltip text={providerHelpTexts.phone} ariaLabel="Ayuda Teléfono" />
            </label>
            <input data-ai-field="phone" name="phone" value={form.phone} onChange={e=>handleChange('phone',e.target.value)} />
            {errors.phone && <div className="error">{errors.phone}</div>}
          </div>

          <div>
            <label style={{display:'flex',alignItems:'center',gap:6,fontWeight:600,color:'#475569'}}>
              Rubro comercial
              <HelpTooltip text={providerHelpTexts.commerceActivity} ariaLabel="Ayuda Rubro comercial" />
            </label>
            <input data-ai-field="commerceActivity" data-ai-alias="category" name="commerceActivity" value={form.commerceActivity} onChange={e=>handleChange('commerceActivity',e.target.value)} />
            {errors.commerceActivity && <div className="error">{errors.commerceActivity}</div>}
          </div>

          <div>
            <label style={{display:'flex',alignItems:'center',gap:6,fontWeight:600,color:'#475569'}}>
              Ciudad
              <HelpTooltip text={providerHelpTexts.city} ariaLabel="Ayuda Ciudad" />
            </label>
            <input data-ai-field="city" name="city" value={form.city} onChange={e=>handleChange('city',e.target.value)} />
            {errors.city && <div className="error">{errors.city}</div>}
          </div>

          <div>
            <label style={{display:'flex',alignItems:'center',gap:6,fontWeight:600,color:'#475569'}}>
              ¿Ya tiene código proveedor?
              <HelpTooltip text={providerHelpTexts.providerCode} ariaLabel="Ayuda Código proveedor" />
            </label>
            <select data-ai-field="hasProviderCode" name="hasProviderCode" value={form.hasProviderCode} onChange={e=>handleChange('hasProviderCode', e.target.value as ProviderAccessFormData['hasProviderCode'])}>
              <option value="si">Sí</option>
              <option value="no">No</option>
              <option value="ns">No estoy seguro</option>
            </select>
            {errors.hasProviderCode && <div className="error">{errors.hasProviderCode}</div>}
          </div>
        </div>

        <div className="submit-row">
          <button className="btn btn-white" data-ai-action="cancel-provider-access" onClick={() => navigate('/')}>Cancelar</button>
          <button className="btn btn-primary" data-ai-action="continue-provider-registration" onClick={handleSubmit}>Continuar al formulario</button>
        </div>
      </div>
    </div>
  );
};

export default ProviderAccessForm;
