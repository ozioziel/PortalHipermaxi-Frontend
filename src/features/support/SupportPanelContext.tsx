import React, { createContext, useContext, useState } from 'react';

interface SupportPanelContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SupportPanelContext = createContext<SupportPanelContextValue | undefined>(undefined);

export const SupportPanelProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <SupportPanelContext.Provider value={{ open, setOpen }}>
      {children}
    </SupportPanelContext.Provider>
  );
};

export const useSupportPanel = (): SupportPanelContextValue => {
  const context = useContext(SupportPanelContext);
  if (!context) {
    throw new Error('useSupportPanel must be used within SupportPanelProvider');
  }
  return context;
};
