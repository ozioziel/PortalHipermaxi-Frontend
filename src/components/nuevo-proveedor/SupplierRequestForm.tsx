import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierCatalogSection from './SupplierCatalogSection';
import SupplierFormGuideOverlay from './SupplierFormGuideOverlay';
import SupplierGeneralDataSection from './SupplierGeneralDataSection';
import SupplierRequestSuccess from './SupplierRequestSuccess';
import SupplierRequestSummary from './SupplierRequestSummary';
import SupplierRolesSection from './SupplierRolesSection';
import useSupplierFormGuide from '../../hooks/nuevo-proveedor/useSupplierFormGuide';
import useAutoGuide from '../../hooks/useAutoGuide';
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
  useAutoGuide(guide.openGuide); // abre la guía si el chat navegó con ?guide=1
  const [formData, setFormData] = useState<SupplierRequestFormData>(
    initialSupplierRequestFormData,
  );
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

  const handleClearForm = () => {
    setFormData(initialSupplierRequestFormData);
    setErrors(createEmptyErrors());
    setHasAttemptedSubmit(false);
    setIsSubmitting(false);
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

        <SupplierGeneralDataSection
          formData={formData}
          errors={errors}
          onFieldChange={handleFieldChange}
        />

        <SupplierRolesSection
          formData={formData}
          errors={errors}
          onFieldChange={handleFieldChange}
        />

        <SupplierCatalogSection
          formData={formData}
          errors={errors}
          onFieldChange={handleFieldChange}
        />

        <SupplierRequestSummary formData={formData} />

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
