'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthButton } from './AuthButton';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function NavBar() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white py-5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transition-all duration-300">
              TeamFinder
            </span>
          </Link>

          {user && (
            <div className="flex-1 flex justify-center space-x-6.5">
              <Link 
                href="/projects" 
                className="text-gray-200 hover:text-white px-4 py-2 rounded-lg text-[15px] font-medium transition-all duration-300 hover:bg-white/10 hover:shadow-md"
              >
                Projects
              </Link>
              <Link 
                href="/postprojects" 
                className="text-gray-200 hover:text-white px-4 py-2 rounded-lg text-[15px] font-medium transition-all duration-300 hover:bg-white/10 hover:shadow-md"
              >
                Post Projects
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <div className="relative group">
                  <NotificationsIcon className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-300 transform hover:scale-110" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <AccountCircleIcon 
                    className="text-gray-300 hover:text-white cursor-pointer transition-all duration-300 transform hover:scale-110" 
                    onClick={() => setShowDropdown(!showDropdown)}
                  />
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-lg bg-white/95 backdrop-blur-sm ring-1 ring-black/5 transform transition-all duration-300 z-50">
                      <div className="py-2" role="menu" aria-orientation="vertical">
                        <Link 
                          href="/profile/posted-projects" 
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 first:rounded-t-xl"
                          onClick={() => setShowDropdown(false)}
                        >
                          My Projects
                        </Link>
                        <Link 
                          href="/profile/accepted-projects" 
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setShowDropdown(false)}
                        >
                          Accepted Projects
                        </Link>
                        <button 
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 cursor-pointer last:rounded-b-xl"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <AuthButton 
                variant="primary"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </AuthButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
