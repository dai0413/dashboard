import { createContext, ReactNode, useContext, useState } from "react";
import axios from "axios";
import { useAlert } from "./alert-context";
import { APIError, ResponseStatus } from "../types/types";
import { API_ROUTES } from "../lib/apiRoutes";

type AuthState = {
  accessToken: string | null;
  profile: Profile;
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
  profile: { admin: false, is_staff: false },
  register: async () => true,
  login: async () => true,
  logout: async () => {},
  refresh: async () => {},
};

type Profile = {
  admin: boolean;
  is_staff: boolean;
};

const AuthContext = createContext<AuthState>(defaultValue);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(defaultValue.profile);
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
      const res = await axios.post(API_ROUTES.AUTH.REGISTER, {
        user_name,
        email,
        password,
      });
      setAccessToken(res.data?.accessToken);

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
      console.log("login start");
      const res = await axios.post(API_ROUTES.AUTH.LOGIN, { email, password });
      setAccessToken(res.data?.accessToken);
      setProfile({ admin: res.data?.admin, is_staff: res.data?.is_staff });
      console.log("login function", res.data.accessToken);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.accessToken}`;

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
      const res = await axios.post(API_ROUTES.AUTH.LOGOUT, {});
      console.log(res);
      axios.defaults.headers.common["Authorization"] = "";
      setAccessToken(null);
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
  };

  const value: AuthState = {
    accessToken,
    profile,
    register,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
