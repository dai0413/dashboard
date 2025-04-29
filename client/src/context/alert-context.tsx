import { createContext, ReactNode, useContext, useState } from "react";
import { APIError } from "../types/types";

type AlertState = {
  message: string | null;
  error: APIError;
  handleSetAlert: (value: string | null | APIError) => void;
};

const defaultValue: AlertState = {
  message: null,
  error: {},
  handleSetAlert: () => {},
};

const AlertContext = createContext<AlertState>(defaultValue);

const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setErrors] = useState<APIError>(defaultValue.error);

  const handleSetAlert = (value: string | null | APIError) => {
    if (value && typeof value === "object") {
      setMessage(null);
      setErrors(value as APIError);
    } else {
      setMessage(value as string | null);
      setErrors(defaultValue.error);
    }
  };

  const value = {
    message,
    error,
    handleSetAlert,
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
