'use client'
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';
import Link from 'next/link';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function NavBar() {
  const { user } = useUser();

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
      <div className="flex items-center">
        {user ? (
          // Logged-in state: Notifications and Sign out
          <>
            <button className="text-white hover:text-gray-400 focus:outline-none mr-4">
              <NotificationsIcon className="h-6 w-6" />
            </button>
            
            <Link href="/api/auth/logout">
              <p className="text-white hover:text-gray-400 focus:outline-none cursor-pointer">Sign out</p>
            </Link>
          </>
        ) : (
            
          // Logged-out state: Only Sign in
          <Link href="/api/auth/login">
            <p className="text-white hover:text-gray-400 focus:outline-none cursor-pointer">Sign in</p>
          </Link>
        )}
      </div>
    </nav>
  );
}
