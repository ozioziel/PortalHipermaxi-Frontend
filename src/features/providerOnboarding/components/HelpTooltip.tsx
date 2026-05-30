import React, {useState} from 'react';

interface Props { text: string }

export const HelpTooltip: React.FC<Props> = ({text}) => {
  const [open, setOpen] = useState(false);
  return (
    <span style={{display:'inline-block'}}>
      <button className="help-btn" onClick={() => setOpen(!open)}>?</button>
      {open && <div style={{position:'absolute',background:'white',border:'1px solid #e5e7eb',padding:8,borderRadius:6,marginTop:6,zIndex:50}}>{text}</div>}
    </span>
  );
};

export default HelpTooltip;
