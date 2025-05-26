import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Transfer, TransferForm, TransferPost } from "../types/models";
import { API_ROUTES } from "../lib/apiRoutes";
import api from "../lib/axios";
import { useAlert } from "./alert-context";
import { APIError, ResponseStatus } from "../types/types";
import { FormStep } from "../types/form";

import { transformTransfer, transformTransfers } from "../lib/parseDates";
import { createConfirmationStep, steps } from "../lib/form-steps";

const initialFormData: TransferForm = {};

export type TransferState = {
  transfers: Transfer[];
  selectedTransfer: Transfer | null;
  formData: TransferForm;
  handleFormData: (key: keyof TransferForm, value: any) => void;
  resetFormData: () => void;
  formSteps: FormStep<TransferForm>[];
  setFormSteps: React.Dispatch<
    React.SetStateAction<FormStep<Partial<TransferPost>>[]>
  >;

  handleChoseTransferId: (id: string) => void;

  createTransfer: () => Promise<void>;
  readTransfer: (id: string) => Promise<void>;
  readAllTransfer: () => Promise<void>;
  updateTransfer: (id: string) => Promise<void>;
  deleteTransfer: (id: string) => Promise<void>;
};

const defaultValue = {
  transfers: [],
  selectedTransfer: null,
  formData: initialFormData,
  handleFormData: () => {},
  resetFormData: () => {},
  formSteps: [],
  setFormSteps: () => {},

  handleChoseTransferId: () => {},

  createTransfer: async () => {},
  readTransfer: async () => {},
  readAllTransfer: async () => {},
  updateTransfer: async () => {},
  deleteTransfer: async () => {},
};

const TransferContext = createContext<TransferState>(defaultValue);

const TransferProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    // setTransfers(transformTransfers(data));
    readAllTransfer();
  }, []);

  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(
    null
  );
  const [formData, setFormData] = useState<TransferForm>(initialFormData);

  const [formSteps, setFormSteps] = useState<FormStep<TransferForm>[]>([]);

  const cleanData = (data: typeof formData) => {
    const cleanedData: any = {};

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        cleanedData[key] = value.filter((v) => v && v.trim() !== "");
      } else {
        cleanedData[key] = value;
      }
    });

    return cleanedData;
  };

  const createTransfer = async () => {
    let alert: ResponseStatus = { success: false };
    const cleanedData = cleanData(formData);
    console.log(cleanedData);

    try {
      const res = await api.post(API_ROUTES.TRANSFER.CREATE, cleanedData);
      const transfer = res.data.data as Transfer;
      setTransfers((prev) => [...prev, transformTransfer(transfer)]);
      setFormData(initialFormData);

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

  const readAllTransfer = async () => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.get(API_ROUTES.TRANSFER.GET_ALL);
      const transfers = res.data.data as Transfer[];
      setTransfers(transformTransfers(transfers));
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

  const readTransfer = async (id: string) => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.get(API_ROUTES.TRANSFER.DETAIL(id));
      const transfer = res.data.data as Transfer;
      setSelectedTransfer(transfer);
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

  const updateTransfer = async (id: string) => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.patch(
        API_ROUTES.TRANSFER.UPDATE(id),
        selectedTransfer
      );
      setTransfers((prev) =>
        prev.map((t) => (t._id === id ? transformTransfer(res.data.data) : t))
      );
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

  const deleteTransfer = async (id: string) => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.delete(API_ROUTES.TRANSFER.DELETE(id));
      setTransfers((prev) => prev.filter((t) => t._id !== id));
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

  const handleChoseTransferId = (id: string) => {
    const selectedTransfer = transfers.find((t) => t._id === id);
    setSelectedTransfer(selectedTransfer || null);
  };

  const handleFormData = <K extends keyof TransferForm>(
    key: K,
    value: TransferForm[K]
  ) => {
    setFormData((prev) => {
      // 同じ値をもう一度クリック → 選択解除
      if (prev[key] === value) {
        return {
          ...prev,
          [key]: undefined,
        };
      }

      // 違う値なら選択更新
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const resetFormData = () => {
    console.log("reseting");
    setFormData(initialFormData);
  };

  useEffect(() => {
    setFormSteps([...steps, createConfirmationStep<TransferForm>()]);
  }, []);

  const value = {
    transfers,
    selectedTransfer,
    formData,
    handleFormData,
    resetFormData,
    formSteps,
    setFormSteps,

    handleChoseTransferId,

    createTransfer,
    readTransfer,
    readAllTransfer,
    updateTransfer,
    deleteTransfer,
  };

  return (
    <TransferContext.Provider value={value}>
      {children}
    </TransferContext.Provider>
  );
};

const useTransfer = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error("useTransfer must be used within a TransferProvider");
  }
  return context;
};

export { useTransfer, TransferProvider };
