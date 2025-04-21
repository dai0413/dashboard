import { createContext, ReactNode, useContext, useState } from "react";
import axios from "axios";
import { useAlert } from "./alert-context";
import { APIError } from "../types";
import { API_ROUTES } from "../lib/apiRoutes";

type AuthState = {
  accessToken: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  refresh: (accessToken: string) => void;
};

const defaultValue: AuthState = {
  accessToken: null,
  login: () => {},
  logout: () => {},
  refresh: () => {},
};

const AuthContext = createContext<AuthState>(defaultValue);

let accessTokenRef: string | null = null;

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { setMessage, setErrors } = useAlert();

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(API_ROUTES.AUTH.LOGIN, { email, password });
      setAccessToken(res.data?.accessToken);
      accessTokenRef = res.data?.accessToken;
      setMessage(res.data?.message);
    } catch (err: any) {
      const data: APIError = err.response?.data;
      setErrors(data);
    }
  };

  const logout = async () => {
    try {
      const res = await axios.post(API_ROUTES.AUTH.LOGOUT, {});
      setAccessToken(null);
      accessTokenRef = null;
      setMessage(res.data?.message);
    } catch (err: any) {
      const data: APIError = err.response?.data;
      setErrors(data);
    }
  };

  const refresh = async (token: string) => {
    setAccessToken(token);
    accessTokenRef = token;
  };

  const value: AuthState = {
    accessToken,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const getAccessToken = () => accessTokenRef;

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth, getAccessToken };
