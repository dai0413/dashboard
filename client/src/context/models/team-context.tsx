import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "../alert-context";
import { getDefaultValue } from "./initialValue.tsx/model-context";
import { Team, TeamForm, TeamGet } from "../../types/models/team";
import { APIError, ResponseStatus } from "../../types/types";
import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { convertGettedToForm } from "../../lib/convert/GettedtoForm";
import { steps } from "../../lib/form-steps";
import { ModelContext } from "../../types/context";
import { useApi } from "../api-context";

const initialFormData: TeamForm = {};

const defaultContext = getDefaultValue(initialFormData);

const TeamContext = createContext<ModelContext<ModelType.TEAM>>(defaultContext);

const TeamProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const api = useApi();

  const [items, setItems] = useState<TeamGet[]>([]);

  const [selected, setSelectedItem] = useState<TeamGet | null>(null);
  const [formData, setFormData] = useState<TeamForm>(initialFormData);
  const [formSteps, setFormSteps] = useState<FormStep<ModelType.TEAM>[]>([]);

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

  const startEdit = (item?: TeamGet) => {
    if (item) {
      setFormData(convertGettedToForm(ModelType.TEAM, item));
      setSelectedItem(item);
    }
  };

  const createItem = async () => {
    let alert: ResponseStatus = { success: false };
    const cleanedData = cleanData(formData);
    console.log(cleanedData);

    try {
      const res = await api.post(API_ROUTES.TEAM.CREATE, cleanedData);
      const item = res.data.data as Team;
      setItems((prev) => [...prev, convert(ModelType.TEAM, item)]);
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
      const res = await api.get(API_ROUTES.TEAM.GET_ALL);
      const items = res.data.data as Team[];
      setItems(convert(ModelType.TEAM, items));

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
      const res = await api.get(API_ROUTES.TEAM.DETAIL(id));
      const item = res.data.data as Team;
      setSelectedItem(convert(ModelType.TEAM, item));
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

  const updateItem = async (updated: TeamForm) => {
    if (!selected) return;
    const id = selected._id;
    let alert: ResponseStatus = { success: false };
    try {
      const res = await api.patch(API_ROUTES.TEAM.UPDATE(id), updated);
      const updatedItem = res.data.data as Team;
      setItems((prev) =>
        prev.map((t) =>
          t._id === id ? convert(ModelType.TEAM, updatedItem) : t
        )
      );
      setSelectedItem(convert(ModelType.TEAM, updatedItem));
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
      const res = await api.delete(API_ROUTES.TEAM.DELETE(id));
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

  const downloadFile = async () => {
    try {
      const res = await api.get(API_ROUTES.TEAM.DOWNLOAD, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "teams.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("ファイルのダウンロードに失敗しました", error);
    }
  };

  const setSelected = (id?: string) => {
    const finded = items.find((t) => t._id === id);
    setSelectedItem(finded ? finded : null);
  };

  const handleFormData = <K extends keyof TeamForm>(
    key: K,
    value: TeamForm[K]
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
    console.log(steps);
    setFormSteps(steps[ModelType.TEAM]);
  }, []);

  const getDiffKeys = () => {
    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, value] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(ModelType.TEAM, selected)[
        typedKey
      ];

      if (
        value &&
        typeof value === "object" &&
        "id" in value &&
        "label" in value &&
        selectedValue &&
        typeof selectedValue === "object" &&
        "id" in selectedValue
      ) {
        if ((value as any).id !== (selectedValue as any).id) {
          diff.push(key);
        }
      } else {
        if (value !== selectedValue) {
          diff.push(key);
        }
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
    downloadFile,

    getDiffKeys,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

export { useTeam, TeamProvider };
