import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "../alert-context";
import { getDefaultValue } from "./initialValue.tsx/model-context";
import {
  NationalCallup,
  NationalCallupForm,
  NationalCallupGet,
} from "../../types/models/national-callup";
import { ReadItemsParamsMap } from "../../types/api";
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

const initialFormData: NationalCallupForm = {};

const defaultContext = getDefaultValue(initialFormData);

const NationalCallupContext =
  createContext<ModelContext<ModelType.NATIONAL_CALLUP>>(defaultContext);

const NationalCallupProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const api = useApi();

  const [items, setItems] = useState<NationalCallupGet[]>([]);

  const [selected, setSelectedItem] = useState<NationalCallupGet | null>(null);
  const [formData, setFormData] = useState<NationalCallupForm>(initialFormData);

  const [formSteps, setFormSteps] = useState<
    FormStep<ModelType.NATIONAL_CALLUP>[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = (time: "start" | "end") =>
    time === "start" ? setIsLoading(true) : setIsLoading(false);

  const startNewData = (item?: Partial<NationalCallupForm>) => {
    item ? setFormData(item) : setFormData({});
  };

  const startEdit = (item?: NationalCallupGet) => {
    if (item) {
      setFormData(convertGettedToForm(ModelType.NATIONAL_CALLUP, item));
      setSelectedItem(item);
    }
  };

  const createItem = async () =>
    createItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_CALLUP.CREATE,
      data: cleanData(formData),
      onAfterCreate: (item: NationalCallup) => {
        setItems((prev) => [...prev, convert(ModelType.NATIONAL_CALLUP, item)]);
        setFormData(initialFormData);
      },
      handleLoading,
      handleSetAlert,
    });

  const readItems = async (
    params: ReadItemsParamsMap[ModelType.NATIONAL_CALLUP] = {}
  ) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_CALLUP.GET_ALL,
      params,
      onSuccess: (items: NationalCallup[]) => {
        setItems(convert(ModelType.NATIONAL_CALLUP, items));
      },
      handleLoading,
      handleSetAlert,
    });

  const readItem = async (id: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_CALLUP.DETAIL(id),
      onSuccess: (item: NationalCallup) => {
        setSelectedItem(convert(ModelType.NATIONAL_CALLUP, item));
      },
      handleLoading,
      handleSetAlert,
    });

  const deleteItem = async (id: string) =>
    deleteItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_CALLUP.DELETE(id),
      onAfterDelete: () => {
        setItems((prev) => prev.filter((t) => t._id !== id));
        setSelected();
      },
      handleLoading,
      handleSetAlert,
    });

  const updateItem = async (updated: NationalCallupForm) => {
    if (!selected) return;
    const id = selected._id;

    updateItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_CALLUP.UPDATE(id),
      data: updated,
      onAfterUpdate: (updatedItem: NationalCallup) => {
        setItems((prev) =>
          prev.map((t) =>
            t._id === id ? convert(ModelType.NATIONAL_CALLUP, updatedItem) : t
          )
        );
        setSelectedItem(convert(ModelType.NATIONAL_CALLUP, updatedItem));
      },
      handleLoading,
      handleSetAlert,
    });
  };

  const setSelected = (id?: string) => {
    const finded = items.find((t) => t._id === id);
    setSelectedItem(finded ? finded : null);
  };

  const handleFormData = <K extends keyof NationalCallupForm>(
    key: K,
    value: NationalCallupForm[K]
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
    setFormSteps(steps[ModelType.NATIONAL_CALLUP]);
  }, []);

  const getDiffKeys = () => {
    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, formValue] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(
        ModelType.NATIONAL_CALLUP,
        selected
      )[typedKey];

      !objectIsEqual(formValue, selectedValue) && diff.push(key);
    }

    return diff;
  };

  const filterableField = fieldDefinition[ModelType.NATIONAL_CALLUP].filter(
    isFilterable
  ) as FilterableFieldDefinition[];

  const sortableField = fieldDefinition[ModelType.NATIONAL_CALLUP].filter(
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
    <NationalCallupContext.Provider value={value}>
      {children}
    </NationalCallupContext.Provider>
  );
};

const useNationalCallup = () => {
  const context = useContext(NationalCallupContext);
  if (!context) {
    throw new Error(
      "useNationalCallup must be used within a NationalCallupProvider"
    );
  }
  return context;
};

export { useNationalCallup, NationalCallupProvider };
