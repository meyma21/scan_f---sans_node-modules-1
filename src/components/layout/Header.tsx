import React from 'react';
import { Search, Bell, User, Settings, Menu } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden mr-2"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </Button>
        
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-primary-900">CheckScan</h1>
          <span className="text-accent-500 ml-1 font-bold">Pro</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:bg-white sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search checks..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500 ring-2 ring-white"></span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          aria-label="Settings"
        >
          <Settings size={20} />
        </Button>
        
        <div className="ml-2 flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;