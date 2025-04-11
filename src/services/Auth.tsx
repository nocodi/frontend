import { createContext, PropsWithChildren, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

type AuthJwtPayload = JwtPayload & { user_id: string };

const parseAuthJwt = (token: string) => {
  const payload = jwtDecode<AuthJwtPayload>(token);
  return payload["user_id"];
};

export type AuthContextType = {
  userId: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userId, setUserId] = useState(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    return parseAuthJwt(token);
  });

  const isAuthenticated = localStorage.getItem("authToken") != null;

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setUserId(parseAuthJwt(token));
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUserId(null);
  };

  const value = {
    userId,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
