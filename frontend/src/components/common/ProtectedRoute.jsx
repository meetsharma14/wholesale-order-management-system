import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getHomePath } from "../../utils/auth";

export default function ProtectedRoute({ children, roles }) {
  const { token, user } = useAuth();

  if (!token || !user?.role) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={getHomePath(user?.role)} replace />;
  }

  return children;
}
