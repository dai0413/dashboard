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
import { ReadItemsParamsMap } from "../../types/api";
import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { convertGettedToForm } from "../../lib/convert/GettedtoForm";
import { steps } from "../../lib/form-steps";
import { ModelContext } from "../../types/context";
import { useApi } from "../api-context";
import { objectIsEqual } from "../../utils/isEqual";
import {
  createItemBase,
  deleteItemBase,
  readItemBase,
  readItemsBase,
  updateItemBase,
} from "../../lib/api";
import { cleanData } from "../../utils/cleanData";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = (time: "start" | "end") =>
    time === "start" ? setIsLoading(true) : setIsLoading(false);

  const startNewData = (item?: Partial<TeamForm>) => {
    item ? setFormData(item) : setFormData({});
  };

  const startEdit = (item?: TeamGet) => {
    if (item) {
      setFormData(convertGettedToForm(ModelType.TEAM, item));
      setSelectedItem(item);
    }
  };

  const createItem = async () =>
    createItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TEAM.CREATE,
      data: cleanData(formData),
      onAfterCreate: (item: Team) => {
        setItems((prev) => [...prev, convert(ModelType.TEAM, item)]);
        setFormData(initialFormData);
      },
      handleLoading,
      handleSetAlert,
    });

  const readItems = async (params: ReadItemsParamsMap[ModelType.TEAM] = {}) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TEAM.GET_ALL,
      params,
      onSuccess: (items: Team[]) => {
        setItems(convert(ModelType.TEAM, items));
      },
      handleLoading,
      handleSetAlert,
    });

  const readItem = async (id: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TEAM.DETAIL(id),
      onSuccess: (item: Team) => {
        setSelectedItem(convert(ModelType.TEAM, item));
      },
      handleLoading,
      handleSetAlert,
    });

  const deleteItem = async (id: string) =>
    deleteItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TEAM.DELETE(id),
      onAfterDelete: () => {
        setItems((prev) => prev.filter((t) => t._id !== id));
        setSelected();
      },
      handleLoading,
      handleSetAlert,
    });

  const updateItem = async (updated: TeamForm) => {
    if (!selected) return;
    const id = selected._id;

    updateItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TEAM.UPDATE(id),
      data: updated,
      onAfterUpdate: (updatedItem: Team) => {
        setItems((prev) =>
          prev.map((t) =>
            t._id === id ? convert(ModelType.TEAM, updatedItem) : t
          )
        );
        setSelectedItem(convert(ModelType.TEAM, updatedItem));
      },
      handleLoading,
      handleSetAlert,
    });
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
    setFormSteps(steps[ModelType.TEAM]);
  }, []);

  const getDiffKeys = () => {
    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, formValue] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(ModelType.TEAM, selected)[
        typedKey
      ];

      !objectIsEqual(formValue, selectedValue) && diff.push(key);
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
    startNewData,

    createItem,
    readItem,
    readItems,
    updateItem,
    deleteItem,
    downloadFile,

    getDiffKeys,
    isLoading,
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
