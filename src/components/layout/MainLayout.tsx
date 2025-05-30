import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div 
        className="fixed top-0 left-0 h-full z-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Sidebar isOpen={sidebarOpen || isHovered} onClose={closeSidebar} />
      </div>
      
      <main className={`
        pt-16 min-h-screen transition-all duration-300
        ${isHovered ? 'lg:ml-64' : 'lg:ml-16'}
      `}>
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;