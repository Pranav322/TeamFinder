'use client'
import { useAuth } from '@/contexts/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function AuthButton({ variant = 'primary', children }: AuthButtonProps) {
  const { logout } = useAuth();

  const handleAuth = async () => {
    try {
      if (children === 'Logout') {
        await logout();
      } else {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error('Error with authentication:', error);
    }
  };

  const buttonClasses = variant === 'primary' 
    ? "px-6 py-2 rounded-full bg-black text-white text-sm font-medium border border-gray-700 hover:bg-gray-800 transition-colors"
    : "px-6 py-2 rounded-full bg-white text-black text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors";

  return (
    <button className={buttonClasses} onClick={handleAuth}>
      {children}
    </button>
  );
} 