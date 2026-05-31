import React, {useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import MainLayout from '../../../core/components/layout/MainLayout';
import '../providerOnboarding.css';
import type { ProviderAccessFormData, ContactRole, CatalogEntry } from '../types/providerOnboarding.types';
import { initialContactRoles, initialCatalog } from '../data/providerFormInitialData';
import ContactRolesTable from '../components/ContactRolesTable';
import CatalogProviderTable from '../components/CatalogProviderTable';
import DocumentUploadMock from '../components/DocumentUploadMock';
import FormValidationPanel from '../components/FormValidationPanel';
import FormPreviewPanel from '../components/FormPreviewPanel';
import { validateRegistrationForm } from '../utils/providerValidators';
import buildProviderEmailBody from '../utils/buildProviderEmailBody';

const ProviderRegistrationFormPage: React.FC = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const incoming = (loc.state || {}) as ProviderAccessFormData | undefined;

  const [access] = useState<ProviderAccessFormData>(incoming ?? {
    providerName:'', legalName:'', nit:'', email:'', phone:'', commerceActivity:'', city:'', hasProviderCode:'no'
  });

  const [contacts, setContacts] = useState<ContactRole[]>(initialContactRoles);
  const [catalog, setCatalog] = useState<CatalogEntry[]>(initialCatalog);
  const [confirmations, setConfirmations] = useState<Record<string,boolean>>({c1:false,c2:false,c3:false});
  const [sending, setSending] = useState(false);
  const errors = useMemo(
    () => validateRegistrationForm({contacts, catalog, confirmations}),
    [catalog, confirmations, contacts],
  );

  const onChangeContact = (c:ContactRole,i:number)=>{
    const copy = [...contacts]; copy[i]=c; setContacts(copy);
  };
  const onChangeCatalog = (c:CatalogEntry,i:number)=>{ const copy=[...catalog]; copy[i]=c; setCatalog(copy); };

  const handleSend = (openMail=false)=>{
    if (errors.length>0) return alert('Corrige los errores antes de enviar');
    if (openMail){
      const body = buildProviderEmailBody({access,contacts,catalog});
      window.location.href = `mailto:yolaaaaso@gmail.com?subject=${encodeURIComponent('Solicitud de Activación de Código Proveedor (Catálogo)')}&body=${body}`;
    } else {
      setSending(true);
      setTimeout(()=>{ setSending(false); navigate('/proveedor/exito'); },1000);
    }
  };

  const completion = Math.max(0, 100 - errors.length*10);

  return (
    <MainLayout>
      <div style={{marginTop:16}} className="onboard-container">
        <h2>Formulario de Activación de Código Proveedor</h2>
        <p>Completa la información requerida para solicitar tu acceso al Portal Hipermaxi.</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
            <section>
              <h3>Información General del Proveedor</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <div><label>Proveedor</label><input value={access.providerName} readOnly /></div>
                <div><label>Razón Social</label><input value={access.legalName} readOnly /></div>
                <div><label>NIT</label><input value={access.nit} readOnly /></div>
              </div>
            </section>

            <section>
              <h3>Responsables de Contacto</h3>
              <ContactRolesTable contacts={contacts} onChange={onChangeContact} />
            </section>

            <section>
              <h3>Catálogo / Código Proveedor</h3>
              <CatalogProviderTable catalog={catalog} onChange={onChangeCatalog} />
            </section>

            <section>
              <h3>Documentos para revisión</h3>
              <div style={{display:'grid',gap:8}}>
                <DocumentUploadMock label="Subir NIT" />
                <DocumentUploadMock label="Subir respaldo tributario" />
                <DocumentUploadMock label="Subir catálogo de productos" />
                <DocumentUploadMock label="Subir documento comercial" />
              </div>
            </section>

            <section>
              <h3>Confirmación</h3>
              <div>
                <label><input type="checkbox" checked={!!confirmations.c1} onChange={e=>setConfirmations({...confirmations,c1:e.target.checked})} /> Confirmo que la información registrada es correcta.</label>
              </div>
              <div>
                <label><input type="checkbox" checked={!!confirmations.c2} onChange={e=>setConfirmations({...confirmations,c2:e.target.checked})} /> Acepto que Hipermaxi revise la información enviada.</label>
              </div>
              <div>
                <label><input type="checkbox" checked={!!confirmations.c3} onChange={e=>setConfirmations({...confirmations,c3:e.target.checked})} /> Acepto recibir notificaciones al correo registrado.</label>
              </div>
            </section>

            <div className="submit-row">
              <button className="btn btn-white" onClick={()=>navigate('/')}>Cancelar</button>
              <button className="btn btn-white" onClick={()=>handleSend(true)}>Abrir correo</button>
              <button className="btn btn-primary" onClick={()=>handleSend(false)}>{sending ? 'Enviando...' : 'Enviar solicitud'}</button>
            </div>
          </div>

          <div>
            <FormValidationPanel missing={[]} errors={errors} completion={completion} />
            <div style={{height:12}} />
            <FormPreviewPanel access={access} contacts={contacts} catalog={catalog} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProviderRegistrationFormPage;
