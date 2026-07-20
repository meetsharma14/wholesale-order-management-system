import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getHomePath } from "../../utils/auth";

export default function PublicRoute({ children }) {
  const { token, user } = useAuth();

  if (token && user?.role) {
    return <Navigate to={getHomePath(user?.role)} replace />;
  }

  return children;
}
