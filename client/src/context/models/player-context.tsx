import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "../alert-context";
import { getDefaultValue } from "./initialValue.tsx/model-context";
import { Player, PlayerForm, PlayerGet } from "../../types/models/player";
import { APIError, ReadItemsParamsMap, ResponseStatus } from "../../types/api";
import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { convertGettedToForm } from "../../lib/convert/GettedtoForm";
import { steps } from "../../lib/form-steps";
import { ModelContext } from "../../types/context";
import { useApi } from "../api-context";
import {
  createItemBase,
  deleteItemBase,
  readItemBase,
  readItemsBase,
  updateItemBase,
} from "../../lib/api";
import { objectIsEqual, cleanData } from "../../utils";
import { fieldDefinition } from "../../lib/model-fields";
import {
  FilterableFieldDefinition,
  isFilterable,
  isSortable,
  SortableFieldDefinition,
} from "../../types/field";

const initialFormData: PlayerForm = {};

const defaultContext = getDefaultValue(initialFormData);

const PlayerContext =
  createContext<ModelContext<ModelType.PLAYER>>(defaultContext);

const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const {
    main: { handleSetAlert: mainHandleSetAlert },
    modal: { handleSetAlert },
  } = useAlert();

  const api = useApi();
  const [items, setItems] = useState<PlayerGet[]>([]);
  const [selected, setSelectedItem] = useState<PlayerGet | null>(null);
  const [formData, setFormData] = useState<PlayerForm>(initialFormData);
  const [formSteps, setFormSteps] = useState<FormStep<ModelType.PLAYER>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = (time: "start" | "end") =>
    time === "start" ? setIsLoading(true) : setIsLoading(false);

  const startNewData = (item?: Partial<PlayerForm>) => {
    item ? setFormData(item) : setFormData({});
  };

  const startEdit = (item?: PlayerGet) => {
    if (item) {
      setFormData(convertGettedToForm(ModelType.PLAYER, item));
      setSelectedItem(item);
    }
  };

  const createItem = async () =>
    createItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.PLAYER.CREATE,
      data: cleanData(formData),
      onAfterCreate: (item: Player) => {
        setItems((prev) => [...prev, convert(ModelType.PLAYER, item)]);
        setFormData(initialFormData);
      },
      handleLoading,
      handleSetAlert,
    });

  const readItems = async (params: ReadItemsParamsMap[ModelType.PLAYER] = {}) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.PLAYER.GET_ALL,
      params,
      onSuccess: (items: Player[]) => {
        setItems(convert(ModelType.PLAYER, items));
      },
      handleLoading,
      handleSetAlert,
    });

  const readItem = async (id: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.PLAYER.DETAIL(id),
      onSuccess: (item: Player) => {
        setSelectedItem(convert(ModelType.PLAYER, item));
      },
      handleLoading,
      handleSetAlert,
    });

  const updateItem = async (updated: PlayerForm) => {
    if (!selected) return;
    const id = selected._id;

    updateItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.PLAYER.UPDATE(id),
      data: updated,
      onAfterUpdate: (updatedItem: Player) => {
        setItems((prev) =>
          prev.map((t) =>
            t._id === id ? convert(ModelType.PLAYER, updatedItem) : t
          )
        );
        setSelectedItem(convert(ModelType.PLAYER, updatedItem));
      },
      handleLoading,
      handleSetAlert,
    });
  };

  const deleteItem = async (id: string) =>
    deleteItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.PLAYER.DELETE(id),
      onAfterDelete: () => {
        setItems((prev) => prev.filter((t) => t._id !== id));
        setSelected();
      },
      handleLoading,
      handleSetAlert,
    });

  const uploadFile = async (file: File) => {
    // console.log("sending in uploadFile");
    let alert: ResponseStatus = { success: false };

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(API_ROUTES.PLAYER.UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const item = res.data.data as Player[];
      setItems((prev) => [...prev, ...convert(ModelType.PLAYER, item)]);

      alert = { success: true, message: res.data?.message };
    } catch (err: any) {
      const apiError = err.response?.data as APIError;

      alert = {
        success: false,
        errors: apiError.error?.errors,
        message: apiError.error?.message,
      };
    } finally {
      mainHandleSetAlert(alert);
    }
  };

  const downloadFile = async () => {
    try {
      const res = await api.get(API_ROUTES.PLAYER.DOWNLOAD, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "players.csv";
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

  const handleFormData = <K extends keyof PlayerForm>(
    key: K,
    value: PlayerForm[K]
  ) => {
    // console.log("handleing", key, value);
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
    // console.log(steps);
    setFormSteps(steps[ModelType.PLAYER]);
  }, []);

  const getDiffKeys = () => {
    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, value] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(ModelType.PLAYER, selected)[
        typedKey
      ];

      !objectIsEqual(value, selectedValue) && diff.push(key);
    }

    return diff;
  };

  const filterableField = fieldDefinition[ModelType.PLAYER].filter(
    isFilterable
  ) as FilterableFieldDefinition[];

  const sortableField = fieldDefinition[ModelType.PLAYER].filter(
    isSortable
  ) as SortableFieldDefinition[];

  const value = {
    items,
    selected,
    formData,
    handleFormData,
    resetFormData,
    formSteps,

    setSelected,
    startEdit,
    startNewData,

    createItem,
    readItem,
    readItems,
    updateItem,
    deleteItem,

    getDiffKeys,
    isLoading,

    uploadFile,
    downloadFile,

    filterableField,
    sortableField,
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
