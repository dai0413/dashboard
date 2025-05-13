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

const ModalAlertContext = createContext<AlertState>(defaultValue);

const ModalAlertProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setErrors] = useState<APIError>(defaultValue.error);

  const handleSetAlert = (value: string | null | APIError) => {
    console.log("handleSetAlert");
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
    <ModalAlertContext.Provider value={value}>
      {children}
    </ModalAlertContext.Provider>
  );
};

const useModalAlert = () => {
  const context = useContext(ModalAlertContext);
  if (!context) {
    throw new Error("useAuth must be used within an ModalAlertProvider");
  }
  return context;
};

export { ModalAlertProvider, useModalAlert };
