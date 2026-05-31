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

const createEmptyErrors = (): SupplierRequestErrors => ({});

type SharedSectionProps = {
  formData: SupplierRequestFormData;
  errors: SupplierRequestErrors;
  onFieldChange: (field: SupplierRequestField, value: string) => void;
};

type SupplierFormSection = {
  label: string;
  tour: string;
  component: (props: SharedSectionProps) => React.ReactElement;
};

const sectionDefinitions: SupplierFormSection[] = [
  {
    label: 'Datos generales',
    tour: 'supplier-general-section',
    component: (props) => <SupplierGeneralDataSection {...props} />,
  },
  {
    label: 'Roles y contactos',
    tour: 'supplier-contact-section',
    component: (props) => <SupplierRolesSection {...props} />,
  },
  {
    label: 'Catalogo',
    tour: 'supplier-documents-section',
    component: (props) => <SupplierCatalogSection {...props} />,
  },
  {
    label: 'Resumen',
    tour: 'supplier-summary-section',
    component: (props) => (
      <div data-guide="supplier-summary">
        <SupplierRequestSummary formData={props.formData} />
      </div>
    ),
  },
];

const sectionFields: Record<number, SupplierRequestField[]> = {
  0: ['providerName', 'legalName', 'nit'],
  1: [
    'systemsManagerName',
    'systemsManagerEmail',
    'systemsManagerPhone',
    'hubManagerName',
    'hubManagerEmail',
    'hubManagerPhone',
    'salesManagerName',
    'salesManagerEmail',
    'salesManagerPhone',
  ],
  2: [
    'providerCode',
    'region',
    'sellerName',
    'sellerPhone',
    'hipermaxiCommercialManager',
    'observations',
  ],
  3: [],
};

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
  useAutoGuide(guide.openGuide);

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

  const validateSection = (sectionIndex: number) => {
    const validation = validateSupplierRequest(formData);
    const relevantFields = sectionFields[sectionIndex] || [];
    const sectionErrors: SupplierRequestErrors = {};

    relevantFields.forEach((field) => {
      if (validation[field]) {
        sectionErrors[field] = validation[field];
      }
    });

    setErrors((current) => {
      const next = { ...current };
      relevantFields.forEach((field) => {
        if (validation[field]) {
          next[field] = validation[field];
        } else {
          delete next[field];
        }
      });
      return next;
    });

    return Object.keys(sectionErrors).length === 0;
  };

  const handleClearForm = () => {
    setFormData(initialSupplierRequestFormData);
    setErrors(createEmptyErrors());
    setHasAttemptedSubmit(false);
    setIsSubmitting(false);
    setCurrentSectionIndex(0);
    guide.closeGuide();
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
    if (!validateSection(currentSectionIndex)) {
      return;
    }

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

  const progressValidation = validateSupplierRequest(formData);
  const generalCompleted = Boolean(
    formData.providerName.trim()
      && formData.legalName.trim()
      && formData.nit.trim()
      && !progressValidation.providerName
      && !progressValidation.legalName
      && !progressValidation.nit,
  );
  const contactsCompleted = Boolean(
    formData.hubManagerName.trim()
      && formData.hubManagerEmail.trim()
      && formData.hubManagerPhone.trim()
      && !progressValidation.systemsManagerEmail
      && !progressValidation.systemsManagerPhone
      && !progressValidation.hubManagerName
      && !progressValidation.hubManagerEmail
      && !progressValidation.hubManagerPhone
      && !progressValidation.salesManagerEmail
      && !progressValidation.salesManagerPhone,
  );
  const catalogCompleted = Boolean(
    formData.providerCode.trim()
      && formData.region.trim()
      && !progressValidation.providerCode
      && !progressValidation.region
      && !progressValidation.sellerPhone,
  );
  const summaryCompleted = generalCompleted && contactsCompleted && catalogCompleted;

  return (
    <>
      <div style={{ display: 'grid', gap: 16 }}>
        <FormProgressBar
          totalSteps={sectionDefinitions.length}
          currentStep={currentSectionIndex}
          completedSteps={[
            generalCompleted,
            contactsCompleted,
            catalogCompleted,
            summaryCompleted,
          ].filter(Boolean).length}
          labels={sectionDefinitions.map((section) => section.label)}
        />

        <section className="card" style={supportCardStyle}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Guia visual del formulario</h2>
            <p style={supportCardTextStyle}>
              Inicie una guia paso a paso para ubicar los campos clave y escuchar
              indicaciones si la sintesis de voz esta disponible.
            </p>
          </div>

          <button
            className="btn btn-secondary"
            data-tour="start-guide-button"
            onClick={guide.openGuide}
            style={supportCardButtonStyle}
          >
            Iniciar guia
          </button>
        </section>

        <div style={{ display: 'grid', gap: 16 }} data-tour={currentSection.tour}>
          {currentSection.component({ formData, errors, onFieldChange: handleFieldChange })}

          <div style={sectionFooterStyle}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                data-tour="back-button"
                onClick={goToPreviousSection}
                disabled={currentSectionIndex === 0}
                style={sectionButtonStyle}
              >
                Anterior
              </button>

              {currentSectionIndex === sectionDefinitions.length - 1 ? (
                <button
                  className="btn btn-secondary"
                  onClick={handleClearForm}
                  style={sectionButtonStyle}
                >
                  Limpiar
                </button>
              ) : null}
            </div>

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
                data-guide="supplier-submit"
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
