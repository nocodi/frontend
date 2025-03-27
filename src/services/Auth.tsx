import { createContext, PropsWithChildren, useState } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import api from "./api";

type AuthJwtPayload = JwtPayload & { user_id: string };

const parseAuthJwt = (token: string) => {
  const payload = jwtDecode<AuthJwtPayload>(token);
  return payload["user_id"];
};

export type AuthContextType = {
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userId, setUserId] = useState(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    return parseAuthJwt(token);
  });

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { token } = response.data as { token: string };
    localStorage.setItem("authToken", token);
    setUserId(parseAuthJwt(token));
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUserId(null);
  };

  const value = {
    userId,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
