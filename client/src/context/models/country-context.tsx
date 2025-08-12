import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAlert } from "../alert-context";
import { getDefaultValue } from "./initialValue.tsx/model-context";
import { Country, CountryForm, CountryGet } from "../../types/models/country";
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

const initialFormData: CountryForm = {};

const defaultContext = getDefaultValue(initialFormData);

const CountryContext =
  createContext<ModelContext<ModelType.COUNTRY>>(defaultContext);

const CountryProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const api = useApi();

  const [items, setItems] = useState<CountryGet[]>([]);

  const [selected, setSelectedItem] = useState<CountryGet | null>(null);
  const [formData, setFormData] = useState<CountryForm>(initialFormData);
  const [formSteps, setFormSteps] = useState<FormStep<ModelType.COUNTRY>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = (time: "start" | "end") =>
    time === "start" ? setIsLoading(true) : setIsLoading(false);

  const startNewData = (item?: Partial<CountryForm>) => {
    item ? setFormData(item) : setFormData({});
  };

  const startEdit = (item?: CountryGet) => {
    if (item) {
      setFormData(convertGettedToForm(ModelType.COUNTRY, item));
      setSelectedItem(item);
    }
  };

  const createItem = async () =>
    createItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.COUNTRY.CREATE,
      data: cleanData(formData),
      onAfterCreate: (item: Country) => {
        setItems((prev) => [...prev, convert(ModelType.COUNTRY, item)]);
        setFormData(initialFormData);
      },
      handleLoading,
      handleSetAlert,
    });

  const readItems = async (
    params: ReadItemsParamsMap[ModelType.COUNTRY] = {}
  ) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.COUNTRY.GET_ALL,
      params,
      onSuccess: (items: Country[]) => {
        setItems(convert(ModelType.COUNTRY, items));
      },
      handleLoading,
      handleSetAlert,
    });

  const readItem = async (id: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.COUNTRY.DETAIL(id),
      onSuccess: (item: Country) => {
        setSelectedItem(convert(ModelType.COUNTRY, item));
      },
      handleLoading,
      handleSetAlert,
    });

  const deleteItem = async (id: string) =>
    deleteItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.COUNTRY.DELETE(id),
      onAfterDelete: () => {
        setItems((prev) => prev.filter((t) => t._id !== id));
        setSelected();
      },
      handleLoading,
      handleSetAlert,
    });

  const updateItem = async (updated: CountryForm) => {
    if (!selected) return;
    const id = selected._id;

    updateItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.COUNTRY.UPDATE(id),
      data: updated,
      onAfterUpdate: (updatedItem: Country) => {
        setItems((prev) =>
          prev.map((t) =>
            t._id === id ? convert(ModelType.COUNTRY, updatedItem) : t
          )
        );
        setSelectedItem(convert(ModelType.COUNTRY, updatedItem));
      },
      handleLoading,
      handleSetAlert,
    });
  };

  const setSelected = (id?: string) => {
    const finded = items.find((t) => t._id === id);
    setSelectedItem(finded ? finded : null);
  };

  const handleFormData = <K extends keyof CountryForm>(
    key: K,
    value: CountryForm[K]
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
    setFormSteps(steps[ModelType.COUNTRY]);
  }, []);

  const getDiffKeys = () => {
    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, formValue] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(ModelType.COUNTRY, selected)[
        typedKey
      ];

      !objectIsEqual(formValue, selectedValue) && diff.push(key);
    }

    return diff;
  };

  const filterableField = fieldDefinition[ModelType.COUNTRY].filter(
    isFilterable
  ) as FilterableFieldDefinition[];

  const sortableField = fieldDefinition[ModelType.COUNTRY].filter(
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
    <CountryContext.Provider value={value}>{children}</CountryContext.Provider>
  );
};

const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
};

export { useCountry, CountryProvider };
