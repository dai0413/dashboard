import { createContext, ReactNode, useContext, useState } from "react";
import { ResponseStatus } from "../types/types";

type AlertState = {
  main: {
    alert: ResponseStatus;
    handleSetAlert: (value: ResponseStatus) => void;
    resetAlert: () => void;
  };
  modal: {
    alert: ResponseStatus;
    handleSetAlert: (value: ResponseStatus) => void;
    resetAlert: () => void;
  };
};

const defaultValue: AlertState = {
  main: {
    alert: { success: null },
    handleSetAlert: () => {},
    resetAlert: () => {},
  },
  modal: {
    alert: { success: null },
    handleSetAlert: () => {},
    resetAlert: () => {},
  },
};

const AlertContext = createContext<AlertState>(defaultValue);

const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [mainAlert, setMainAlert] = useState<ResponseStatus>(
    defaultValue.main.alert
  );

  const MainHandleSetAlert = (value: ResponseStatus) => {
    setMainAlert(value);
  };
  const MainResetAlert = () => MainHandleSetAlert(defaultValue.modal.alert);

  const [modalAlert, setModalAlert] = useState<ResponseStatus>(
    defaultValue.modal.alert
  );

  const ModalHandleSetAlert = (value: ResponseStatus) => {
    setModalAlert(value);
  };
  const ModalResetAlert = () => ModalHandleSetAlert(defaultValue.modal.alert);

  const value = {
    main: {
      alert: mainAlert,
      handleSetAlert: MainHandleSetAlert,
      resetAlert: MainResetAlert,
    },
    modal: {
      alert: modalAlert,
      handleSetAlert: ModalHandleSetAlert,
      resetAlert: ModalResetAlert,
    },
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
