import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileClock, 
  CheckSquare, 
  AlertTriangle, 
  FileX, 
  Users, 
  Settings, 
  HelpCircle,
  X
} from 'lucide-react';
import Button from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/list', label: 'Check List', icon: <CheckSquare size={20} /> },
    { path: '/pending', label: 'Pending Checks', icon: <FileClock size={20} /> },
    { path: '/validated', label: 'Validated', icon: <CheckSquare size={20} /> },
    { path: '/review', label: 'Needs Review', icon: <AlertTriangle size={20} /> },
    { path: '/rejected', label: 'Rejected', icon: <FileX size={20} /> },
    { path: '/users', label: 'Users', icon: <Users size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  const isActiveRoute = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 pt-16 z-10
        transition-all duration-300 ease-in-out group
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100 lg:w-16'}
        hover:w-64
      `}>
        <div className="lg:hidden absolute right-4 top-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="h-full flex flex-col justify-between">
          <div className="px-4 py-6">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                    transition-colors duration-200
                    ${isActiveRoute(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                  onClick={() => onClose()}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {item.label}
                  </span>
                  
                  {item.label === 'Needs Review' && (
                    <span className="ml-auto bg-warning-100 text-warning-800 text-xs font-semibold px-2.5 py-0.5 rounded-full hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      12
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Link
                to="/help"
                className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                <HelpCircle size={18} className="mr-2" />
                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  Help & Support
                </span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;