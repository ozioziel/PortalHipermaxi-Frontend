import React from 'react';

interface Props {
  rect: DOMRect | null;
}

const GuideSpotlight: React.FC<Props> = ({ rect }) => {
  if (!rect) {
    return <div className="support-guide-scrim support-guide-scrim-full" />;
  }

  const padding = 8;
  const top = Math.max(rect.top - padding, 0);
  const left = Math.max(rect.left - padding, 0);
  const right = Math.min(rect.right + padding, window.innerWidth);
  const bottom = Math.min(rect.bottom + padding, window.innerHeight);
  const width = Math.max(right - left, 0);
  const height = Math.max(bottom - top, 0);

  if (!width || !height) {
    return <div className="support-guide-scrim support-guide-scrim-full" />;
  }

  return (
    <>
      <div className="support-guide-scrim" style={{ top: 0, left: 0, right: 0, height: top }} />
      <div className="support-guide-scrim" style={{ top: bottom, left: 0, right: 0, bottom: 0 }} />
      <div className="support-guide-scrim" style={{ top, left: 0, width: left, height }} />
      <div className="support-guide-scrim" style={{ top, left: right, right: 0, height }} />
      <div
        className="support-guide-highlight"
        style={{
          top,
          left,
          width,
          height,
        }}
      />
    </>
  );
};

export default GuideSpotlight;
