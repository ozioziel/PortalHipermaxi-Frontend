import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
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
            <label>Nombre del proveedor <button className="help-btn" onClick={(e)=>{e.preventDefault(); alert(providerHelpTexts.providerName);}}>?</button></label>
            <input value={form.providerName} onChange={e=>handleChange('providerName',e.target.value)} />
            {errors.providerName && <div className="error">{errors.providerName}</div>}
          </div>
          <div>
            <label>Razón social <button className="help-btn" onClick={(e)=>{e.preventDefault(); alert(providerHelpTexts.legalName);}}>?</button></label>
            <input value={form.legalName} onChange={e=>handleChange('legalName',e.target.value)} />
            {errors.legalName && <div className="error">{errors.legalName}</div>}
          </div>

          <div>
            <label>NIT <button className="help-btn" onClick={(e)=>{e.preventDefault(); alert(providerHelpTexts.nit);}}>?</button></label>
            <input value={form.nit} onChange={e=>handleChange('nit',e.target.value)} />
            {errors.nit && <div className="error">{errors.nit}</div>}
          </div>

          <div>
            <label>Correo empresarial <button className="help-btn" onClick={(e)=>{e.preventDefault(); alert(providerHelpTexts.email);}}>?</button></label>
            <input value={form.email} onChange={e=>handleChange('email',e.target.value)} />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div>
            <label>Teléfono <button className="help-btn" onClick={(e)=>{e.preventDefault(); alert(providerHelpTexts.phone);}}>?</button></label>
            <input value={form.phone} onChange={e=>handleChange('phone',e.target.value)} />
            {errors.phone && <div className="error">{errors.phone}</div>}
          </div>

          <div>
            <label>Rubro comercial <button className="help-btn" onClick={(e)=>{e.preventDefault(); alert(providerHelpTexts.commerceActivity);}}>?</button></label>
            <input value={form.commerceActivity} onChange={e=>handleChange('commerceActivity',e.target.value)} />
            {errors.commerceActivity && <div className="error">{errors.commerceActivity}</div>}
          </div>

          <div>
            <label>Ciudad <button className="help-btn" onClick={(e)=>{e.preventDefault(); alert(providerHelpTexts.city);}}>?</button></label>
            <input value={form.city} onChange={e=>handleChange('city',e.target.value)} />
            {errors.city && <div className="error">{errors.city}</div>}
          </div>

          <div>
            <label>¿Ya tiene código proveedor? <button className="help-btn" onClick={(e)=>{e.preventDefault(); alert(providerHelpTexts.providerCode);}}>?</button></label>
            <select value={form.hasProviderCode} onChange={e=>handleChange('hasProviderCode', e.target.value as ProviderAccessFormData['hasProviderCode'])}>
              <option value="si">Sí</option>
              <option value="no">No</option>
              <option value="ns">No estoy seguro</option>
            </select>
            {errors.hasProviderCode && <div className="error">{errors.hasProviderCode}</div>}
          </div>
        </div>

        <div className="submit-row">
          <button className="btn btn-white" onClick={() => navigate('/')}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Continuar al formulario</button>
        </div>
      </div>
    </div>
  );
};

export default ProviderAccessForm;
