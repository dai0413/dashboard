import { createContext, ReactNode, useContext, useState } from "react";
import api from "../lib/axios";
import { useAlert } from "./alert-context";
import { APIError } from "../types/types";
import { API_ROUTES } from "../lib/apiRoutes";

type AuthState = {
  accessToken: string | null;
  register: (
    user_name: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refresh: (accessToken: string) => void;
};

const defaultValue: AuthState = {
  accessToken: null,
  register: async () => true,
  login: async () => true,
  logout: async () => {},
  refresh: async () => {},
};

const AuthContext = createContext<AuthState>(defaultValue);

let accessTokenRef: string | null = null;

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { handleSetAlert } = useAlert();

  const register = async (
    user_name: string,
    email: string,
    password: string
  ) => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.post(API_ROUTES.AUTH.REGISTER, {
        user_name,
        email,
        password,
      });
      setAccessToken(res.data?.accessToken);
      accessTokenRef = res.data?.accessToken;
      alertData = res.data?.message;
      return true;
    } catch (err: any) {
      alertData = err.response?.data as APIError;
      return false;
    } finally {
      console.log("alert is ", alertData);
      handleSetAlert(alertData);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.post(API_ROUTES.AUTH.LOGIN, { email, password });
      setAccessToken(res.data?.accessToken);
      accessTokenRef = res.data?.accessToken;
      alertData = res.data?.message;
      return true;
    } catch (err: any) {
      alertData = err.response?.data as APIError;
      console.log("login false");
      return false;
    } finally {
      handleSetAlert(alertData);
    }
  };

  const logout = async () => {
    let alertData: string | APIError | null = null;
    try {
      const res = await api.post(API_ROUTES.AUTH.LOGOUT, {});
      setAccessToken(null);
      accessTokenRef = null;
      alertData = res.data?.message;
    } catch (err: any) {
      alertData = err.response?.data as APIError;
    } finally {
      handleSetAlert(alertData);
    }
  };

  const refresh = async (token: string) => {
    setAccessToken(token);
    accessTokenRef = token;
  };

  const value: AuthState = {
    accessToken,
    register,
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
