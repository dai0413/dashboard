import { createContext, ReactNode, useContext, useState } from "react";
import { useAlert } from "./alert-context";
import { APIError, AlertStatus } from "../types/alert";
import { API_PATHS } from "../lib/api-paths";
import { useApi } from "./api-context";

type AuthState = {
  accessToken: string | null;
  staffState: StaffState;
  register: (
    user_name: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refresh: (accessToken: string) => void;
  loading: boolean;
};

const defaultValue: AuthState = {
  accessToken: null,
  staffState: { admin: false, is_staff: false },
  register: async () => true,
  login: async () => true,
  logout: async () => {},
  refresh: async () => {},
  loading: false,
};

type StaffState = {
  admin: boolean;
  is_staff: boolean;
};

const AuthContext = createContext<AuthState>(defaultValue);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [staffState, setStaffState] = useState<StaffState>(
    defaultValue.staffState
  );
  const [loading, setLoading] = useState<boolean>(false);
  const {
    main: { handleSetAlert },
  } = useAlert();
  const api = useApi();

  const register = async (
    user_name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    let alert: AlertStatus = { success: false };
    try {
      const res = await api.post(API_PATHS.AUTH.REGISTER, {
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
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    let alert: AlertStatus = { success: false };
    try {
      const res = await api.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      setAccessToken(res.data?.accessToken);
      setStaffState({ admin: res.data?.admin, is_staff: res.data?.is_staff });

      api.defaults.headers.common[
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
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    let alert: AlertStatus = { success: false };
    try {
      const res = await api.post(API_PATHS.AUTH.LOGOUT, {});
      console.log(res);
      api.defaults.headers.common["Authorization"] = "";
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
    staffState,
    register,
    login,
    logout,
    refresh,
    loading,
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
