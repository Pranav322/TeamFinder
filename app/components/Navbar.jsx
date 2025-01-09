'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavBar() {
  console.log('NavBar rendered');
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
  
        // Filter notifications for the current user and pending status
        const relevantNotifications = data.filter(n => 
          n.projectowneremail === user?.email && n.status === 'pending'
        );
  
        setNotifications(relevantNotifications);
  
        console.log('Notifications after setting state:', data);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };
  
    if (user) {
      fetchNotifications();
      // Refresh notifications every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);
  
  
  

  const handleNotificationAction = async (notificationId, status) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Remove the notification from the list
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  return (
    <nav className="flex items-center justify-between h-16 bg-gray-900 text-white px-4 shadow-md">
      <Link href="/">
        <p className="text-2xl font-bold cursor-pointer hover:text-blue-400 transition duration-300">TeamFinder</p>
      </Link>

      {user && (
        <ul className="flex space-x-4 list-none">
          <li>
            <Link href="/projects">
              <p className="hover:text-blue-400 transition duration-300 cursor-pointer">Browse Projects</p>
            </Link>
          </li>
          <li>
            <Link href="/postprojects">
              <p className="hover:text-blue-400 transition duration-300 cursor-pointer">Post Projects</p>
            </Link>
          </li>
        </ul>
      )}

      {user && (
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 hover:bg-gray-800 rounded-full transition duration-300"
            >
              <NotificationsIcon />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Popup */}
            {showNotifications && (
              <div className="absolute right-0 top-12 bg-white border rounded shadow-lg text-black p-4 w-80 max-h-[80vh] overflow-y-auto z-50">
                <h3 className="font-semibold mb-2">Notifications</h3>
                {notifications.length === 0 ? (
                  <p className="text-gray-500">No new notifications</p>
                ) : (
                  <ul className="space-y-4">
                    {notifications.map((notification) => (
                      <li key={notification.id} className="border-b pb-2">
                        <p className="mb-2">
                          <span className="font-semibold">{notification.userEmail}</span> wants to join your project
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleNotificationAction(notification.id, 'accepted')}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleNotificationAction(notification.id, 'rejected')}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-full transition duration-300"
            >
              <AccountCircleIcon className="h-8 w-8" />
              <span className="hidden md:block">{user.email}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 bg-white border rounded shadow-lg text-black p-2 w-48 z-50">
                <Link href="/profile/posted-projects">
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                    Posted Projects
                  </p>
                </Link>
                <Link href="/profile/accepted-projects">
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded">
                    Accepted Projects
                  </p>
                </Link>
                <div className="border-t my-2"></div>
                <Link href="/api/auth/logout">
                  <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded text-red-600">
                    Sign out
                  </p>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {!user && (
        <Link href="/api/auth/login">
          <p className="text-white hover:text-blue-400 transition duration-300 cursor-pointer">Sign in</p>
        </Link>
      )}
    </nav>
  );
}
