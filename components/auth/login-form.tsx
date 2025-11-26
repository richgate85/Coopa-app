"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
//
// THESE ARE THE CORRECT PATHS.
//
import { useAuth } from '../../app/lib/auth-context'; // Path to "Shared Brain"
import { User } from 'firebase/auth';

export default function LoginForm() {
  // Local user state is available from the app-level AuthProvider
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 
  const { signInWithGoogle, signOutUser, user: loggedInUser } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const u = await signInWithGoogle();
      console.log("Welcome,", u?.displayName);
      if (u) router.push('/dashboard');
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signing in with:", email, password);
  };

  // Check the "Shared Brain" to see if we're already logged in
  if (loggedInUser) {
    // If we are logged in, show the "Welcome" message
    // This part is for when you're already logged in
    // and you just visit the /login page
    return (
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          You are already logged in,
        </h1>
        <img 
          src={loggedInUser.photoURL || 'https://placehold.co/100x100/eeeeee/313131?text=Me'} 
          alt="Your profile" 
          className="w-24 h-24 mx-auto mb-4 rounded-full"
        />
        <h2 className="text-2xl text-gray-700 font-semibold mb-6">{loggedInUser.displayName}</h2>
        
        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // If the user is NOT logged in, show the sign-in form
  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
        Sign in to your account
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Welcome back to Coopa!
      </p>

      <form onSubmit={handleEmailSignIn} className="space-y-6">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mt-1 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            Sign in
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm font-medium text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-4 py-3 font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          <svg className="inline w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.712 34.61 44 28.134 44 20c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}