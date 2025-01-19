'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthButton } from './AuthButton';

export default function NavBar() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

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

  return (
    <nav className="bg-[#0F172A] text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-white">TeamFinder</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/projects" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Projects
                </Link>
                <Link href="/postprojects" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Post Projects
                </Link>
                <Link href="/myprojects" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  My Projects
                </Link>
                <Link href="/profile/accepted-projects" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Accepted Projects
                </Link>
                <Link href="/profile/posted-projects" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Posted Projects
                </Link>
                <div className="relative">
                  <NotificationsIcon className="text-gray-300 hover:text-white cursor-pointer" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <AccountCircleIcon className="text-gray-300 hover:text-white cursor-pointer" />
                <AuthButton variant="secondary">Logout</AuthButton>
              </>
            ) : (
              <AuthButton variant="primary">Sign In</AuthButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
