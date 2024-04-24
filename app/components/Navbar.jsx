'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function NavBar() {
  console.log('NavBar rendered');
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
  
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error('Notifications data is not an array:', data);
        }
  
        console.log('Notifications after setting state:', data);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };
  
    fetchNotifications();
  }, []);
  
  
  

  const handleNotificationClick = () => {
    setShowPopup(!showPopup);
  };

  return (
    <nav className="flex items-center justify-between h-16 bg-gray-800 text-white px-4">
   
      {/* Left Side - Logo */}
      <Link href="/">
        <p className="text-xl font-bold cursor-pointer">TeamFinder</p>
      </Link>

      {/* Center - Navigation Links (Visible only when logged in) */}
      {user && (
        <ul className="flex space-x-4 list-none">
          <li>
            <Link href="/projects">
              <p className="hover:text-gray-400 cursor-pointer">Browse Projects</p>
            </Link>
          </li>
          <li>
            <Link href="/postprojects">
              <p className="hover:text-gray-400 cursor-pointer">Post Projects</p>
            </Link>
          </li>
          <li>
                        <Link href="/myprojects">
              <p className="hover:text-gray-400 cursor-pointer">My Projects</p>
            </Link>
          </li>
        </ul>
      )}

      {/* Right Side - Notifications and Authentication */}
      {/* Right Side - Notifications and Authentication */}
{/* Right Side - Notifications and Authentication */}
<div className="flex items-center">
  {user ? (
    <>
      <button onClick={handleNotificationClick} className="text-white hover:text-gray-400 focus:outline-none mr-4">
        <NotificationsIcon className="h-6 w-6" />
       
          <span className="bg-red-500 rounded-full w-3 h-3"></span>
   
      </button>
      
      <Link href="/api/auth/logout">
        <p className="text-white hover:text-gray-400 focus:outline-none cursor-pointer">Sign out</p>
      </Link>
    </>
  ) : (
    <Link href="/api/auth/login">
      <p className="text-white hover:text-gray-400 focus:outline-none cursor-pointer">Sign in</p>
    </Link>
  )}
</div>

{/* Notification Popup */}
{showPopup && (
  <div className="absolute right-0 top-16 bg-blue border rounded shadow-lg text-black p-4 ">
    <h3 className="font-semibold mb-2">Notifications</h3>
    <ul>
      {notifications && notifications.map((notification, index) => (
        <li key={index}>
          {notification.projectowneremail === user?.email && (
            <div>
              {notification.userEmail} wants to join your project.
              <div className="mt-2">
                <button
                  onClick={() => handleAccept(notification.id)}
                  className="mr-2 bg-green-500 text-white px-4 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDeny(notification.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Deny
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
)}

    </nav>
  );
}
