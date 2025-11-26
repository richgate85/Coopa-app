"use client";

import Link from 'next/link';
//
// THIS IS THE FIX!
// We are using the "long way" address (relative path)
// because this file is outside the 'app' folder.
//
import { useAuth } from '../app/context/auth-context'; // Import the "Shared Brain"
import { LogOut, LayoutDashboard } from 'lucide-react'; // Some nice icons

export default function Navigation() {
  // 1. Check the "Shared Brain" to see who is logged in and get actions
  const { user, signOutUser } = useAuth();

  const handleSignOut = async () => {
    try {
  await signOutUser();
      // We don't need to redirect here, the AuthProvider
      // will see the user is null and show the login state
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
            <span className="text-xl font-bold text-white">C</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">Coopa</span>
        </Link>

        {/* Links */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link href="/#how-it-works" className="text-gray-600 hover:text-green-600">
            How It Works
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-green-600">
            Pricing
          </Link>
        </div>

        {/* 2. Show different buttons based on login state */}
        <div className="flex items-center space-x-4">
          {user ? (
            // --- IF USER IS LOGGED IN ---
            <>
              <Link
                href="/dashboard"
                className="flex items-center text-sm font-medium text-gray-600 hover:text-green-600"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            // --- IF USER IS LOGGED OUT ---
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-green-600"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}