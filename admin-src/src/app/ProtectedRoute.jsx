import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export { ProtectedRoute };
