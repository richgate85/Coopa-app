"use client";

import { useEffect, useState, useCallback } from "react";
import { getAuthClient } from "@/lib/firebase.js";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

export type UseFirebaseAuthResult = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOutClient: () => Promise<void>;
};

export default function useFirebaseAuth(): UseFirebaseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthClient();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = getAuthClient();
    if (!auth) throw new Error("Auth not available");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    return result.user;
  }, []);

  const signOutClient = useCallback(async () => {
    const auth = getAuthClient();
    if (!auth) throw new Error("Auth not available");
    await signOut(auth);
    setUser(null);
  }, []);

  return { user, loading, signInWithGoogle, signOutClient };
}
