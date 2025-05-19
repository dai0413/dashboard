import { createContext, ReactNode, useContext, useState } from "react";
import api from "../lib/axios";
import { useAlert } from "./alert-context";
import { APIError, ResponseStatus } from "../types/types";
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
  const {
    main: { handleSetAlert },
  } = useAlert();

  const register = async (
    user_name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.post(API_ROUTES.AUTH.REGISTER, {
        user_name,
        email,
        password,
      });
      setAccessToken(res.data?.accessToken);
      accessTokenRef = res.data?.accessToken;
      alert = { success: true, message: res.data?.message };
      handleSetAlert(alert);
      return true;
    } catch (err: any) {
      const apiError = err.response?.data as APIError;

      alert = {
        success: false,
        errors: apiError.error?.errors,
        message: apiError.error?.message,
      };
      handleSetAlert(alert);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.post(API_ROUTES.AUTH.LOGIN, { email, password });
      setAccessToken(res.data?.accessToken);
      accessTokenRef = res.data?.accessToken;
      alert = { success: true, message: res.data?.message };
      handleSetAlert(alert);
      return true;
    } catch (err: any) {
      const apiError = err.response?.data as APIError;

      alert = {
        success: false,
        errors: apiError.error?.errors,
        message: apiError.error?.message,
      };
      handleSetAlert(alert);
      return false;
    }
  };

  const logout = async () => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.post(API_ROUTES.AUTH.LOGOUT, {});
      setAccessToken(null);
      accessTokenRef = null;
      alert = { success: true, message: res.data?.message };
    } catch (err: any) {
      const apiError = err.response?.data as APIError;

      alert = {
        success: false,
        errors: apiError.error?.errors,
        message: apiError.error?.message,
      };
    } finally {
      handleSetAlert(alert);
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
