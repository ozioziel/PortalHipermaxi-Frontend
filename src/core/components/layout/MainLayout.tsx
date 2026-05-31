import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SupportChatWidget from '../../../features/support/components/SupportChatWidget';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Navbar />
      <main style={{flex:1,padding:'28px 0'}}>
        <div className="container">{children}</div>
      </main>
      <Footer />
      <SupportChatWidget />
    </div>
  );
};

export default MainLayout;
