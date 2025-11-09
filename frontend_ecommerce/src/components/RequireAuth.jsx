import { useAuth } from "../contenxt/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const auth = useAuth();
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
