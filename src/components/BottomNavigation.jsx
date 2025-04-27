// src/components/BottomNavigation.jsx
import { useLocation, Link } from 'react-router-dom';
import { Home, Camera, Clock, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Navigation items
  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
    },
    {
      path: '/outfit-check',
      label: 'Check',
      icon: Camera,
    },
    {
      path: '/history',
      label: 'History',
      icon: Clock,
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <IconComponent className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;