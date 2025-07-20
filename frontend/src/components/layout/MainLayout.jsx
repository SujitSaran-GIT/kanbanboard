import React from 'react';
import Navbar from '../ui/Navbar';
import ThreeBackground from '../ui/ThreeBackground';

const MainLayout = ({ children }) => (
  <div className="relative min-h-screen">
    <ThreeBackground />
    <Navbar />
    <main className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto w-full">
      {children}
    </main>
  </div>
);

export default MainLayout; 