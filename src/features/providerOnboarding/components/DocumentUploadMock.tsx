import React, {useState} from 'react';

interface Props { label: string }

export const DocumentUploadMock: React.FC<Props> = ({label}) => {
  const [added, setAdded] = useState(false);
  return (
    <div className="doc-card">
      <div>{label}</div>
      <div>
        <button className="btn-small btn-white" onClick={() => setAdded(!added)}>{added ? 'Archivo agregado' : 'Simular subir'}</button>
      </div>
    </div>
  );
};

export default DocumentUploadMock;
