import React, { useState } from 'react';

interface Props {
  text: string;
  ariaLabel?: string;
}

const HelpTooltip: React.FC<Props> = ({ text, ariaLabel = 'Ayuda contextual' }) => {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="help-tooltip-wrapper"
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="help-tooltip-button"
        aria-label={ariaLabel}
        onClick={() => setOpen((previous) => !previous)}
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      {open ? (
        <div className="help-tooltip-box" role="tooltip">
          {text}
        </div>
      ) : null}
    </span>
  );
};

export default HelpTooltip;
