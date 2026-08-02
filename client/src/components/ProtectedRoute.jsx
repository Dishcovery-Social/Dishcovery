import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for /auth/me to load the user
  if (!user) return <Navigate to="/" replace />;
  return <Outlet />;
}
