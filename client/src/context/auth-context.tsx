import { createContext, ReactNode, useContext, useState } from "react";

type AuthState = {
  token: string | null;
};

const defaultValue: AuthState = {
  token: null,
};

const AuthContext = createContext<AuthState>(defaultValue);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const value: AuthState = {
    token,
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
