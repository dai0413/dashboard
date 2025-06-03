import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "./alert-context";
import { getDefaultValue } from "../context/initialValue.tsx/model-context";
import { Player, PlayerForm, PlayerGet } from "../types/models/player";
import { APIError, ResponseStatus } from "../types/types";
import { FormStep } from "../types/form";
import { ModelType } from "../types/models";

import { API_ROUTES } from "../lib/apiRoutes";
import api from "../lib/axios";
import { convert } from "../lib/convertGetData";
import { steps } from "../lib/form-steps";
import { ModelContext } from "./form-context";

const initialFormData: PlayerForm = {};

const defaultContext = getDefaultValue(initialFormData);

const PlayerContext =
  createContext<ModelContext<ModelType.PLAYER>>(defaultContext);

const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const [items, setItems] = useState<PlayerGet[]>([]);

  useEffect(() => {
    readItems();
  }, []);

  const [selected, setSelectedItem] = useState<PlayerGet | null>(null);
  const [formData, setFormData] = useState<PlayerForm>(initialFormData);

  useEffect(() => {
    console.log("now form ", formData);
  }, [formData]);

  const [formSteps, setFormSteps] = useState<FormStep<ModelType.PLAYER>[]>([]);

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
      const res = await api.post(API_ROUTES.PLAYER.CREATE, cleanedData);
      const item = res.data.data as Player;
      setItems((prev) => [...prev, convert(ModelType.PLAYER, item)]);
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
      const res = await api.get(API_ROUTES.PLAYER.GET_ALL);
      const items = res.data.data as Player[];
      setItems(convert(ModelType.PLAYER, items));
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
      const res = await api.get(API_ROUTES.PLAYER.DETAIL(id));
      const item = res.data.data as Player;
      setSelectedItem(convert(ModelType.PLAYER, item));
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
      const res = await api.patch(API_ROUTES.PLAYER.UPDATE(id), selected);
      setItems((prev) =>
        prev.map((t) =>
          t._id === id ? convert(ModelType.PLAYER, res.data.data) : t
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
      const res = await api.delete(API_ROUTES.PLAYER.DELETE(id));
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

  const handleFormData = <K extends keyof PlayerForm>(
    key: K,
    value: PlayerForm[K]
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
    console.log(steps);
    setFormSteps(steps[ModelType.PLAYER]);
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
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

export { usePlayer, PlayerProvider };
