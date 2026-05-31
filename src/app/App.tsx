import React from 'react';
import './App.css';
import '../core/styles/global.css';
import AppRoutes from '../core/routes/AppRoutes';
import VoiceAssistantButton from '../components/VoiceAssistantButton';
import { SupportPanelProvider } from '../features/support/SupportPanelContext';

export const App: React.FC = () => {
  return (
    <SupportPanelProvider>
      <AppRoutes />
      <VoiceAssistantButton />
    </SupportPanelProvider>
  );
};

export default App;
