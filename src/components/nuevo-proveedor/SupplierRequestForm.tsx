import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierCatalogSection from './SupplierCatalogSection';
import SupplierFormGuideOverlay from './SupplierFormGuideOverlay';
import SupplierGeneralDataSection from './SupplierGeneralDataSection';
import SupplierRequestSuccess from './SupplierRequestSuccess';
import SupplierRequestSummary from './SupplierRequestSummary';
import SupplierRolesSection from './SupplierRolesSection';
import useSupplierFormGuide from '../../hooks/nuevo-proveedor/useSupplierFormGuide';
import FormProgressBar from '../../core/components/ui/FormProgressBar';
import {
  initialSupplierRequestFormData,
  validateSupplierRequest,
  type SupplierRequestErrors,
  type SupplierRequestField,
  type SupplierRequestFormData,
} from '../../services/nuevo-proveedor/supplierRequestValidationService';

const supportCardStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
  border: '1px solid #dbeafe',
  background: '#eff6ff',
};

const supportCardTextStyle: React.CSSProperties = {
  margin: 0,
  color: '#1e3a8a',
  maxWidth: 640,
  lineHeight: 1.5,
};

const supportCardButtonStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #bfdbfe',
  color: '#1d4ed8',
};

const actionRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
};

const actionGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
};

const secondaryButtonStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #d1d5db',
  color: 'var(--text-dark)',
};

const createEmptyErrors = (): SupplierRequestErrors => ({});

export const SupplierRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const guide = useSupplierFormGuide();
  const [formData, setFormData] = useState<SupplierRequestFormData>(
    initialSupplierRequestFormData,
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<SupplierRequestErrors>(createEmptyErrors);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState('');

  const handleFieldChange = (field: SupplierRequestField, value: string) => {
    setFormData((currentFormData) => {
      const nextFormData = { ...currentFormData, [field]: value };

      if (hasAttemptedSubmit) {
        setErrors(validateSupplierRequest(nextFormData));
      }

      return nextFormData;
    });
  };

  const sectionFields: Record<number, SupplierRequestField[]> = {
    0: ['providerName', 'legalName', 'nit'], // General
    1: [
      'hubManagerName',
      'hubManagerEmail',
      'hubManagerPhone',
      'systemsManagerName',
      'systemsManagerEmail',
      'systemsManagerPhone',
    ], // Encargados
    2: [
      'salesManagerName',
      'salesManagerEmail',
      'salesManagerPhone',
      'sellerName',
      'sellerPhone',
    ], // Roles
    3: ['providerCode', 'region'], // Catálogo
    4: [], // Resumen/confirmación
  };

  const validateSection = (step: number) => {
    const validation = validateSupplierRequest(formData);
    const relevantFields = sectionFields[step] || [];

    // Extract only errors for relevant fields
    const sectionErrors: SupplierRequestErrors = {};
    relevantFields.forEach((f) => {
      if (validation[f]) sectionErrors[f] = validation[f];
    });

    // Update errors state: replace relevant fields, keep others
    setErrors((current) => {
      const next = { ...current } as SupplierRequestErrors;
      relevantFields.forEach((f) => {
        if (validation[f]) next[f] = validation[f];
        else delete (next as any)[f];
      });
      return next;
    });

    return Object.keys(sectionErrors).length === 0;
  };

  const handleNext = () => {
    // Validate current section before advancing
    const ok = validateSection(currentStep);
    if (!ok) {
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleClearForm = () => {
    setFormData(initialSupplierRequestFormData);
    setErrors(createEmptyErrors());
    setHasAttemptedSubmit(false);
    setIsSubmitting(false);
    setCurrentStep(0);
  };

  const handleSubmit = () => {
    const validationErrors = validateSupplierRequest(formData);
    setHasAttemptedSubmit(true);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    guide.closeGuide();

    window.setTimeout(() => {
      setSubmittedCaseNumber('SR-000123');
      setIsSubmitting(false);
    }, 700);
  };

  const handleResetAfterSuccess = () => {
    setSubmittedCaseNumber('');
    handleClearForm();
  };

  if (submittedCaseNumber) {
    return (
      <SupplierRequestSuccess
        caseNumber={submittedCaseNumber}
        hubEmail={formData.hubManagerEmail}
        onReset={handleResetAfterSuccess}
        onGoHome={() => navigate('/')}
      />
    );
  }

  return (
    <>
      <div style={{ display: 'grid', gap: 16 }}>
        <FormProgressBar
          totalSteps={5}
          currentStep={currentStep}
          completedSteps={(() => {
            const data = formData;
            const general = Boolean(data.providerName.trim() && data.legalName.trim() && data.nit.trim());
            const hub = Boolean(data.hubManagerName.trim() && data.hubManagerEmail.trim() && data.hubManagerPhone.trim());
            const roles = Boolean(data.salesManagerName.trim() || data.systemsManagerName.trim() || data.sellerName.trim());
            const catalog = Boolean(data.providerCode.trim() && data.region.trim());
            const summary = general && hub && roles && catalog;
            return [general, hub, roles, catalog, summary].filter(Boolean).length;
          })()}
          labels={["General","Encargados","Roles","Catálogo","Resumen"]}
        />
        <section className="card" style={supportCardStyle}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Guía visual del formulario</h2>
            <p style={supportCardTextStyle}>
              Inicie una guía paso a paso para ubicar los campos clave y escuchar
              indicaciones si la síntesis de voz está disponible.
            </p>
          </div>

          <button
            className="btn btn-secondary"
            onClick={guide.openGuide}
            style={supportCardButtonStyle}
          >
            Iniciar guía
          </button>
        </section>
        {/* Render sections one at a time based on currentStep */}
        <div>
          {currentStep === 0 && (
            <div>
              <SupplierGeneralDataSection
                formData={formData}
                errors={errors}
                onFieldChange={handleFieldChange}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <SupplierRolesSection
                formData={formData}
                errors={errors}
                onFieldChange={handleFieldChange}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <SupplierCatalogSection
                formData={formData}
                errors={errors}
                onFieldChange={handleFieldChange}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <SupplierRequestSummary formData={formData} />
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <section className="card">
                <div style={actionRowStyle}>
                  <div>
                    <h2 style={{ margin: '0 0 6px 0', fontSize: 22 }}>Enviar solicitud</h2>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                      Verifique la información y envíe la solicitud para revisión del Área de
                      Compras.
                    </p>
                  </div>

                  <div style={actionGroupStyle}>
                    <button
                      className="btn btn-secondary"
                      style={secondaryButtonStyle}
                      onClick={() => navigate('/')}
                    >
                      Volver
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={secondaryButtonStyle}
                      onClick={handleClearForm}
                    >
                      Limpiar formulario
                    </button>
                    <button
                      className="btn btn-primary"
                      data-guide="supplier-submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando solicitud...' : 'Enviar solicitud'}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Navigation buttons visible at the bottom of each section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
            <div>
              {currentStep > 0 && (
                <button className="btn btn-secondary" style={secondaryButtonStyle} onClick={() => handleBack()}>
                  Anterior
                </button>
              )}
            </div>

            <div>
              {currentStep < 4 && (
                <button className="btn btn-primary" onClick={() => handleNext()}>
                  Siguiente
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SupplierFormGuideOverlay
        isOpen={guide.isOpen}
        currentStep={guide.currentStep}
        currentStepIndex={guide.currentStepIndex}
        totalSteps={guide.totalSteps}
        highlightRect={guide.highlightRect}
        isVoiceEnabled={guide.isVoiceEnabled}
        hasSpeechSupport={guide.hasSpeechSupport}
        onPrevious={guide.goToPreviousStep}
        onNext={guide.goToNextStep}
        onClose={guide.closeGuide}
        onRepeatVoice={guide.repeatVoice}
        onToggleVoice={guide.toggleVoice}
      />
    </>
  );
};

export default SupplierRequestForm;
