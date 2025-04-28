import { createContext, ReactNode, useContext, useState } from "react";
import { APIError } from "../types/types";

type AlertState = {
  message: string | null;
  error: APIError;
  setMessage: (mes: string) => void;
  setErrors: (error: APIError) => void;
};

const defaultValue: AlertState = {
  message: null,
  error: {},
  setMessage: () => {},
  setErrors: () => {},
};

const AlertContext = createContext<AlertState>(defaultValue);

const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setErrors] = useState<APIError>(defaultValue.error);

  const value = {
    message,
    error,
    setMessage,
    setErrors,
  };

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAuth must be used within an AlertProvider");
  }
  return context;
};

export { AlertProvider, useAlert };
