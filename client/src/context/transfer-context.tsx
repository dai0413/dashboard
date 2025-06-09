import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "./alert-context";
import { getDefaultValue } from "../context/initialValue.tsx/model-context";
import { Transfer, TransferForm, TransferGet } from "../types/models/transfer";
import { APIError, ResponseStatus } from "../types/types";
import { FormStep } from "../types/form";
import { ModelType } from "../types/models";

import { API_ROUTES } from "../lib/apiRoutes";
import api from "../lib/axios";
import { convert } from "../lib/convertGetData";
import { steps } from "../lib/form-steps";
import { ModelContext } from "../types/context";

const initialFormData: TransferForm = {};

const defaultContext = getDefaultValue(initialFormData);

const TransferContext =
  createContext<ModelContext<ModelType.TRANSFER>>(defaultContext);

const TransferProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const [items, setItems] = useState<TransferGet[]>([]);

  useEffect(() => {
    readItems();
  }, []);

  const [selected, setSelectedItem] = useState<TransferGet | null>(null);
  const [formData, setFormData] = useState<TransferForm>(initialFormData);

  useEffect(() => {
    console.log("now form ", formData);
  }, [formData]);

  const [formSteps, setFormSteps] = useState<FormStep<ModelType.TRANSFER>[]>(
    []
  );

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

  const createItem = async () => {
    let alert: ResponseStatus = { success: false };
    const cleanedData = cleanData(formData);
    console.log(cleanedData);

    try {
      const res = await api.post(API_ROUTES.TRANSFER.CREATE, cleanedData);
      const item = res.data.data as Transfer;
      setItems((prev) => [...prev, convert(ModelType.TRANSFER, item)]);
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

  const readItems = async () => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.get(API_ROUTES.TRANSFER.GET_ALL);
      const items = res.data.data as Transfer[];
      setItems(convert(ModelType.TRANSFER, items));
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

  const readItem = async (id: string) => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.get(API_ROUTES.TRANSFER.DETAIL(id));
      const transfer = res.data.data as Transfer;
      setSelectedItem(convert(ModelType.TRANSFER, transfer));
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

  const updateItem = async (id: string) => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.patch(API_ROUTES.TRANSFER.UPDATE(id), selected);
      setItems((prev) =>
        prev.map((t) =>
          t._id === id ? convert(ModelType.TRANSFER, res.data.data) : t
        )
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

  const deleteItem = async (id: string) => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.delete(API_ROUTES.TRANSFER.DELETE(id));
      setItems((prev) => prev.filter((t) => t._id !== id));
      setSelected();
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

  const setSelected = (id?: string) => {
    const finded = items.find((t) => t._id === id);
    setSelectedItem(finded ? finded : null);
  };

  const handleFormData = <K extends keyof TransferForm>(
    key: K,
    value: TransferForm[K]
  ) => {
    console.log("handleing", key, value);
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
    setFormData(initialFormData);
  };

  useEffect(() => {
    setFormSteps(steps[ModelType.TRANSFER]);
  }, []);

  const value = {
    items,
    selected,
    formData,
    handleFormData,
    resetFormData,
    formSteps,

    setSelected,

    createItem,
    readItem,
    readItems,
    updateItem,
    deleteItem,
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
