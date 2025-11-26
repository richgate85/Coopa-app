"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

//
// RELATIVE PATH FIX ATTEMPT 2
//
// Current file: app/components/dashboard/dashboard-header.tsx
//
// Target 1: app/lib/firebase.js
// Path: ../../../lib/firebase.js (Up from dashboard, Up from components, Up from app? Wait.)
//
// Let's trace it carefully:
// 1. Start in 'dashboard' folder.
// 2. '../' takes us to 'components' folder.
// 3. '../../' takes us to 'app' folder.
// 4. '../../../' takes us to PROJECT ROOT (where 'lib' is NOT located if it's inside 'app').
//
// IF 'lib' and 'context' are inside 'app':
// Path should be: ../../lib/firebase.js
//
// auth actions and state are provided by the shared AuthProvider

//
// Target 2: app/lib/auth-context.tsx
// Path: ../../lib/auth-context
//
import { useAuth } from '../../app/lib/auth-context';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { Bell } from 'lucide-react';

export function DashboardHeader() { 
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return null;
  }

  const initials = user.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('')
    : '...';

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-white px-6">
      <div className="flex items-center space-x-6">
        <span className="text-lg font-semibold text-green-600">Coopa</span>
        <nav className="hidden items-center space-x-4 md:flex">
          <Link href="/dashboard" className="text-sm font-medium text-green-600">
            Dashboard
          </Link>
          <Link href="/dashboard/browse" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Browse Requests
          </Link>
          <Link href="/dashboard/co-op" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            My Co-op
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative rounded-full p-1 text-gray-500 hover:text-gray-700">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-600 text-xs text-white">1</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-green-500">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <div className="text-sm font-medium text-gray-800">{user.displayName}</div>
                <div className="text-xs text-gray-500">Unity Co-op</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/co-op')}>
              Co-op Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:bg-red-50 focus:text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}