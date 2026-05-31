import React from 'react';
import './App.css';
import '../core/styles/global.css';
import AppRoutes from '../core/routes/AppRoutes';
import VoiceAssistantButton from '../components/VoiceAssistantButton';

export const App: React.FC = () => {
  return (
    <>
      <AppRoutes />
      <VoiceAssistantButton />
    </>
  );
};

export default App;
