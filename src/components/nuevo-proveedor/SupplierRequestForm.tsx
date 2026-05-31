import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierCatalogSection from './SupplierCatalogSection';
import SupplierFormGuideOverlay from './SupplierFormGuideOverlay';
import SupplierGeneralDataSection from './SupplierGeneralDataSection';
import SupplierRequestSuccess from './SupplierRequestSuccess';
import SupplierRequestSummary from './SupplierRequestSummary';
import SupplierRolesSection from './SupplierRolesSection';
import useSupplierFormGuide from '../../hooks/nuevo-proveedor/useSupplierFormGuide';
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

const progressWrapperStyle: React.CSSProperties = {
  display: 'grid',
  gap: 14,
  padding: '18px 20px',
  borderRadius: 16,
  border: '1px solid #e5e7eb',
  background: '#ffffff',
};

const progressLineStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 10,
};

const progressStepStyle = (active: boolean): React.CSSProperties => ({
  padding: '12px 14px',
  borderRadius: 999,
  background: active ? '#1d4ed8' : '#f8fafc',
  color: active ? '#ffffff' : '#475569',
  fontSize: 13,
  fontWeight: 700,
  textAlign: 'center',
});

const sectionFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  marginTop: 18,
};

const sectionButtonStyle: React.CSSProperties = {
  minWidth: 140,
};

const secondaryButtonStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #d1d5db',
  color: 'var(--text-dark)',
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

const createEmptyErrors = (): SupplierRequestErrors => ({});

type SupplierFormSection = {
  label: string;
  tour: string;
  component: (props: Record<string, unknown>) => JSX.Element;
};

const sectionDefinitions: SupplierFormSection[] = [
  {
    label: 'Datos generales',
    tour: 'supplier-general-section',
    component: (props) => <SupplierGeneralDataSection {...(props as any)} />,
  },
  {
    label: 'Datos de contacto',
    tour: 'supplier-contact-section',
    component: (props) => <SupplierRolesSection {...(props as any)} />,
  },
  {
    label: 'Documentos',
    tour: 'supplier-documents-section',
    component: (props) => <SupplierCatalogSection {...(props as any)} />,
  },
  {
    label: 'Resumen',
    tour: 'supplier-summary-section',
    component: (props) => <SupplierRequestSummary formData={(props as any).formData} />,
  },
];

export const SupplierRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SupplierRequestFormData>(
    initialSupplierRequestFormData,
  );
  const [errors, setErrors] = useState<SupplierRequestErrors>(createEmptyErrors);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState('');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const guide = useSupplierFormGuide({
    activeSectionIndex: currentSectionIndex,
    onSectionChange: setCurrentSectionIndex,
  });

  const currentSection = sectionDefinitions[currentSectionIndex];

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
    setCurrentSectionIndex(0);
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

  const goToPreviousSection = () => {
    setCurrentSectionIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  const goToNextSection = () => {
    setCurrentSectionIndex((previousIndex) =>
      Math.min(previousIndex + 1, sectionDefinitions.length - 1),
    );
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
            data-tour="start-guide-button"
            onClick={guide.openGuide}
            style={supportCardButtonStyle}
          >
            Iniciar guía
          </button>
        </section>

        <section className="card" data-tour="supplier-progress-bar" style={progressWrapperStyle}>
          <div style={progressLineStyle}>
            {sectionDefinitions.map((section, index) => (
              <div key={section.tour} style={progressStepStyle(index === currentSectionIndex)}>
                {section.label}
              </div>
            ))}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Paso {currentSectionIndex + 1} de {sectionDefinitions.length}
          </div>
        </section>

        <div style={{ display: 'grid', gap: 16 }} data-tour={currentSection.tour}>
          {currentSection.component({ formData, errors, onFieldChange: handleFieldChange })}

          <div style={sectionFooterStyle}>
            <button
              className="btn btn-secondary"
              data-tour="back-button"
              onClick={goToPreviousSection}
              disabled={currentSectionIndex === 0}
              style={sectionButtonStyle}
            >
              Anterior
            </button>

            {currentSectionIndex < sectionDefinitions.length - 1 ? (
              <button
                className="btn btn-primary"
                data-tour="next-button"
                onClick={goToNextSection}
                style={sectionButtonStyle}
              >
                Siguiente
              </button>
            ) : (
              <button
                className="btn btn-primary"
                data-tour="supplier-submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={sectionButtonStyle}
              >
                {isSubmitting ? 'Enviando solicitud...' : 'Enviar solicitud'}
              </button>
            )}
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
