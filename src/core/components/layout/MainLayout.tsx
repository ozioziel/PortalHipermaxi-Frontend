import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

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
    </div>
  );
};

export default MainLayout;
