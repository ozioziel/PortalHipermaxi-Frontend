import React from 'react';
import '../../styles/variables.css';
import './formProgressBar.css';

interface FormProgressBarProps {
  totalSteps: number;
  completedSteps?: number;
  labels?: string[];
  compact?: boolean;
  currentStep?: number;
}

const FormProgressBar: React.FC<FormProgressBarProps> = ({
  totalSteps,
  completedSteps = 0,
  labels = [],
  compact = false,
}) => {
  const points = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <div className={`form-progress ${compact ? 'form-progress--compact' : ''}`}>
      <div className="form-progress__line" aria-hidden>
        <div
          className="form-progress__fill"
          style={{ width: `${(completedSteps / Math.max(totalSteps, 1)) * 100}%` }}
        />
      </div>

      <div className="form-progress__points" role="list">
        {points.map((index) => {
          const done = index < completedSteps;
          const isCurrent = typeof currentStep === 'number' && index === currentStep;
          return (
            <div
              role="listitem"
              key={index}
              className={`form-progress__point ${done ? 'is-done' : 'is-pending'} ${isCurrent ? 'is-current' : ''}`}
              title={labels[index] ?? (done ? 'Completado' : 'Pendiente')}
              aria-label={labels[index] ?? `Paso ${index + 1}`}
            >
              <span className="form-progress__dot" />
            </div>
          );
        })}
      </div>

      <div className="form-progress__meta">
        <small>
          Completado: {completedSteps} de {totalSteps} secciones
        </small>
      </div>
    </div>
  );
};

export default FormProgressBar;
