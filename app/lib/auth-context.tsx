"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
// Both files live in `app/lib/` so import via a local relative path to avoid
// any fragile resolution differences during builds. Keep the extension off
// (Next/TypeScript resolves it automatically).
import { auth } from "./firebase";
import { createUserProfile } from "@/lib/firestore-service";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      try {
        if (u) {
          await createUserProfile({
            uid: u.uid,
            displayName: u.displayName || undefined,
            email: u.email || undefined,
            photoURL: u.photoURL || undefined,
            role: 'member',
          });
        }
      } catch (err) {
        // avoid breaking auth flow
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Auth not available");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user ?? null);
    return result.user ?? null;
  };

  const signOutUser = async () => {
    if (!auth) throw new Error("Auth not available");
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
