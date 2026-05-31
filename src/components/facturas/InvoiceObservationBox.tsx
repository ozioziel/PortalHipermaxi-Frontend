import React from 'react';

interface InvoiceObservationBoxProps {
  observations: string[];
}

const InvoiceObservationBox: React.FC<InvoiceObservationBoxProps> = ({
  observations,
}) => {
  if (observations.length === 0) {
    return null;
  }

  return (
    <div
      className="invoice-observation-box"
      data-guide="invoice-observations"
    >
      <h4>Observación Hipermaxi:</h4>
      <ul>
        {observations.map((observation) => (
          <li key={observation}>{observation}</li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceObservationBox;
