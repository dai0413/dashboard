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
import { ReadItemsParamsMap } from "../../types/api";
import { FormStep } from "../../types/form";
import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { convertGettedToForm } from "../../lib/convert/GettedtoForm";
import { steps } from "../../lib/form-steps";
import { ModelContext } from "../../types/context";
import { useApi } from "../api-context";
import { objectIsEqual, cleanData } from "../../utils";
import {
  createItemBase,
  deleteItemBase,
  readItemBase,
  readItemsBase,
  updateItemBase,
} from "../../lib/api";
import { fieldDefinition } from "../../lib/model-fields";
import {
  FilterableFieldDefinition,
  isFilterable,
  isSortable,
  SortableFieldDefinition,
} from "../../types/field";

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
  const [formSteps, setFormSteps] = useState<FormStep<ModelType.INJURY>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = (time: "start" | "end") =>
    time === "start" ? setIsLoading(true) : setIsLoading(false);

  const startNewData = (item?: Partial<InjuryForm>) => {
    item ? setFormData(item) : setFormData({});
  };

  const startEdit = (item?: InjuryGet) => {
    if (item) {
      setFormData(convertGettedToForm(ModelType.INJURY, item));
      setSelectedItem(item);
    }
  };

  const createItem = async () =>
    createItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.INJURY.CREATE,
      data: cleanData(formData),
      onAfterCreate: (item: Injury) => {
        setItems((prev) => [...prev, convert(ModelType.INJURY, item)]);
        setFormData(initialFormData);
      },
      handleLoading,
      handleSetAlert,
    });

  const readItems = async (params: ReadItemsParamsMap[ModelType.INJURY] = {}) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.INJURY.GET_ALL,
      params,
      onSuccess: (items: Injury[]) => {
        setItems(convert(ModelType.INJURY, items));
      },
      handleLoading,
      handleSetAlert,
    });

  const readItem = async (id: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.INJURY.DETAIL(id),
      onSuccess: (item: Injury) => {
        setSelectedItem(convert(ModelType.INJURY, item));
      },
      handleLoading,
      handleSetAlert,
    });

  const updateItem = async (updated: InjuryForm) => {
    if (!selected) return;
    const id = selected._id;

    updateItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.INJURY.UPDATE(id),
      data: updated,
      onAfterUpdate: (updatedItem: Injury) => {
        setItems((prev) =>
          prev.map((t) =>
            t._id === id ? convert(ModelType.INJURY, updatedItem) : t
          )
        );
        setSelectedItem(convert(ModelType.INJURY, updatedItem));
      },
      handleLoading,
      handleSetAlert,
    });
  };

  const deleteItem = async (id: string) =>
    deleteItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.INJURY.DELETE(id),
      onAfterDelete: () => {
        setItems((prev) => prev.filter((t) => t._id !== id));
        setSelected();
      },
      handleLoading,
      handleSetAlert,
    });

  const setSelected = (id?: string) => {
    const finded = items.find((t) => t._id === id);
    setSelectedItem(finded ? finded : null);
  };

  const handleFormData = <K extends keyof InjuryForm>(
    key: K,
    value: InjuryForm[K]
  ) => {
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

      !objectIsEqual(formValue, selectedValue) && diff.push(key);
    }

    return diff;
  };

  const filterableField = fieldDefinition[ModelType.INJURY].filter(
    isFilterable
  ) as FilterableFieldDefinition[];

  const sortableField = fieldDefinition[ModelType.INJURY].filter(
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

    filterableField,
    sortableField,
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
