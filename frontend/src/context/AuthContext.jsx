import { createContext, useContext, useState } from "react";

import { decodeToken, isTokenExpired } from "../utils/auth";

const AuthContext = createContext();

function getStoredSession() {
  const storedToken = localStorage.getItem("token");
  const storedUser = decodeToken(storedToken);

  if (!storedToken || !storedUser?.role || isTokenExpired(storedUser)) {
    localStorage.removeItem("token");
    return { token: null, user: null };
  }

  return { token: storedToken, user: storedUser };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);

  const login = (token) => {
    const nextUser = decodeToken(token);

    if (!nextUser?.role || isTokenExpired(nextUser)) {
      localStorage.removeItem("token");
      setSession({ token: null, user: null });
      return false;
    }

    localStorage.setItem("token", token);
    setSession({ token, user: nextUser });
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setSession({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
