import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import toast from "react-hot-toast";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ important

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false); // ✅ stop loading after auth check
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Google Login
  const loginWithGoogle = async () => {
    try {
      setLoading(true);

      // ✅ keep user logged in after refresh
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithPopup(auth, googleProvider);

      toast.success(`Welcome ${result.user.displayName || ""}`);
      return result.user; // ✅ useful for redirect
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch (err) {
      console.error(err);
      toast.error("Logout failed");
    }
  };

  return { user, loading, loginWithGoogle, logout };
}