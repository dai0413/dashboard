import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "../alert-context";
import { getDefaultValue } from "./initialValue.tsx/model-context";
import { Injury, InjuryForm, InjuryGet } from "../../types/models/injury";
import { APIError, ResponseStatus } from "../../types/types";
import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { convertGettedToForm } from "../../lib/convert/GettedtoForm";
import { steps } from "../../lib/form-steps";
import { ModelContext } from "../../types/context";
import { useApi } from "../api-context";

const getComparison = (value: any): string | number | (string | number)[] => {
  if (Array.isArray(value)) {
    // 配列: 各要素が Label 型なら id を抽出、その他はそのまま
    return value.map((item) =>
      item && typeof item === "object" && "id" in item ? item.id : item
    );
  }

  if (value && typeof value === "object" && "id" in value) {
    return value.id;
  }

  return value ?? ""; // null や undefined は空として扱う
};

const isEqual = (a: any, b: any): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return [...a].sort().join() === [...b].sort().join();
  }

  return a === b;
};

const initialFormData: InjuryForm = {};

const defaultContext = getDefaultValue(initialFormData);

const InjuryContext =
  createContext<ModelContext<ModelType.INJURY>>(defaultContext);

const InjuryProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const api = useApi();

  const [items, setItems] = useState<InjuryGet[]>([]);
  const [selected, setSelectedItem] = useState<InjuryGet | null>(null);
  const [formData, setFormData] = useState<InjuryForm>(initialFormData);

  useEffect(() => {
    // console.log("now form ", formData);
  }, [formData]);

  const [formSteps, setFormSteps] = useState<FormStep<ModelType.INJURY>[]>([]);

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

  const startEdit = (item?: InjuryGet) => {
    if (item) {
      setFormData(convertGettedToForm(ModelType.INJURY, item));
      setSelectedItem(item);
    }
  };

  const createItem = async () => {
    let alert: ResponseStatus = { success: false };
    const cleanedData = cleanData(formData);
    console.log(cleanedData);

    try {
      const res = await api.post(API_ROUTES.INJURY.CREATE, cleanedData);
      const item = res.data.data as Injury;
      setItems((prev) => [...prev, convert(ModelType.INJURY, item)]);
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

  const readItems = async (limit?: number) => {
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.get(API_ROUTES.INJURY.GET_ALL, {
        params: { limit: limit },
      });
      const items = res.data.data as Injury[];
      console.log(convert(ModelType.INJURY, items));
      setItems(convert(ModelType.INJURY, items));
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
      const res = await api.get(API_ROUTES.INJURY.DETAIL(id));
      const transfer = res.data.data as Injury;
      setSelectedItem(convert(ModelType.INJURY, transfer));
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

  const updateItem = async (updated: InjuryForm) => {
    if (!selected) return;
    const id = selected._id;
    let alert: ResponseStatus = { success: false };

    const cleanedData = cleanData(updated);

    try {
      const res = await api.patch(API_ROUTES.INJURY.UPDATE(id), cleanedData);
      const updatedItem = res.data.data as Injury;
      setItems((prev) =>
        prev.map((t) =>
          t._id === id ? convert(ModelType.INJURY, updatedItem) : t
        )
      );
      setSelectedItem(convert(ModelType.INJURY, updatedItem));
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
      const res = await api.delete(API_ROUTES.INJURY.DELETE(id));
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

  const handleFormData = <K extends keyof InjuryForm>(
    key: K,
    value: InjuryForm[K]
  ) => {
    console.log("handleing", key, value);
    setFormData((prev) => {
      // 同じ値をもう一度クリック → 選択解除
      if (prev[key] === value) {
        return {
          ...prev,
          [key]: null,
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
    setFormSteps(steps[ModelType.INJURY]);
  }, []);

  const getDiffKeys = () => {
    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, formValue] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(ModelType.INJURY, selected)[
        typedKey
      ];

      const formComparison = getComparison(formValue);
      const selectedComparison = getComparison(selectedValue);

      if (!isEqual(formComparison, selectedComparison)) {
        diff.push(key);
      }
    }

    return diff;
  };

  const value = {
    items,
    selected,
    formData,
    handleFormData,
    resetFormData,
    formSteps,

    setSelected,
    startEdit,

    createItem,
    readItem,
    readItems,
    updateItem,
    deleteItem,

    getDiffKeys,
  };

  return (
    <InjuryContext.Provider value={value}>{children}</InjuryContext.Provider>
  );
};

const useInjury = () => {
  const context = useContext(InjuryContext);
  if (!context) {
    throw new Error("useInjury must be used within a InjuryProvider");
  }
  return context;
};

export { useInjury, InjuryProvider };
