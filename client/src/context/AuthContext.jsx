import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getCurrentUser, logout } from "../services/AuthAPI";

// Central auth state for the app, shared via React Context.
//
// The problem it solves: many components need to know "who is logged in?" and be
// able to trigger sign-in/sign-out — passing that through props everywhere would
// be painful. AuthProvider holds the state once and any component reads it with
// the useAuth() hook, no prop drilling.
//
// What it exposes (via useAuth()):
//   user     — the logged-in profile, or null when logged out
//   loading  — true until the initial GET /auth/me resolves. Consumers (e.g.
//              ProtectedRoute) must wait on this so they don't redirect before
//              we know whether a session exists (avoids a flash-redirect).
//   signIn   — starts GitHub OAuth via a full-page redirect
//   signOut  — ends the session, clears user, and notifies the user
//
// On mount it asks the server who we are (GET /auth/me); a 401 just means "logged
// out" and leaves user null. The session itself lives in an http-only cookie on
// the server — this context only mirrors it for the UI.

// Context owns the shared information across components
const AuthContext = createContext(null);

// Provider owns the state and the actions to hand down
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getCurrentUser();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  const completeLogout = () => {
    setUser(null);
    toast.success("You've successfully signed out!", { id: "logout" });
  };

  const signOut = async () => {
    try {
      await logout();
      completeLogout();
    } catch (error) {
      // 401 means the user is already logged out
      if (error.status === 401) completeLogout();
      else
        toast.error("You've failed to sign out. Please try again.", {
          id: "logout",
        });
    }
  };

  const value = { user, loading, signIn, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
