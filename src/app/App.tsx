import React from 'react';
import './App.css';
import '../core/styles/global.css';
import AppRoutes from '../core/routes/AppRoutes';
import VoiceAssistantButton from '../components/VoiceAssistantButton';
import { SupportPanelProvider } from '../features/support/SupportPanelContext';
import { AuthProvider } from '../core/auth/AuthContext';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SupportPanelProvider>
        <AppRoutes />
        <VoiceAssistantButton />
      </SupportPanelProvider>
    </AuthProvider>
  );
};

export default App;
