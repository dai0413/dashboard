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
  NationalMatchSeries,
  NationalMatchSeriesForm,
  NationalMatchSeriesGet,
} from "../../types/models/national-match-series";
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

const japan = import.meta.env.VITE_JPN_COUNTRY_ID;

const initialFormData: NationalMatchSeriesForm = {
  country: japan,
};

const defaultContext = getDefaultValue(initialFormData);

const NationalMatchSeriesContext =
  createContext<ModelContext<ModelType.NATIONAL_MATCH_SERIES>>(defaultContext);

const NationalMatchSeriesProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const api = useApi();

  const [items, setItems] = useState<NationalMatchSeriesGet[]>([]);

  const [selected, setSelectedItem] = useState<NationalMatchSeriesGet | null>(
    null
  );
  const [formData, setFormData] =
    useState<NationalMatchSeriesForm>(initialFormData);

  const [formSteps, setFormSteps] = useState<
    FormStep<ModelType.NATIONAL_MATCH_SERIES>[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = (time: "start" | "end") =>
    time === "start" ? setIsLoading(true) : setIsLoading(false);

  const startNewData = (item?: Partial<NationalMatchSeriesForm>) => {
    item ? setFormData(item) : setFormData({});
  };

  const startEdit = (item?: NationalMatchSeriesGet) => {
    if (item) {
      setFormData(convertGettedToForm(ModelType.NATIONAL_MATCH_SERIES, item));
      setSelectedItem(item);
    }
  };

  const createItem = async () =>
    createItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_MATCH_SERIES.CREATE,
      data: cleanData(formData),
      onAfterCreate: (item: NationalMatchSeries) => {
        setItems((prev) => [
          ...prev,
          convert(ModelType.NATIONAL_MATCH_SERIES, item),
        ]);
        setFormData(initialFormData);
      },
      handleLoading,
      handleSetAlert,
    });

  const readItems = async (
    params: ReadItemsParamsMap[ModelType.NATIONAL_MATCH_SERIES] = {}
  ) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_MATCH_SERIES.GET_ALL,
      params,
      onSuccess: (items: NationalMatchSeries[]) => {
        setItems(convert(ModelType.NATIONAL_MATCH_SERIES, items));
      },
      handleLoading,
      handleSetAlert,
    });

  const readItem = async (id: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_MATCH_SERIES.DETAIL(id),
      onSuccess: (item: NationalMatchSeries) => {
        setSelectedItem(convert(ModelType.NATIONAL_MATCH_SERIES, item));
      },
      handleLoading,
      handleSetAlert,
    });

  const deleteItem = async (id: string) =>
    deleteItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_MATCH_SERIES.DELETE(id),
      onAfterDelete: () => {
        setItems((prev) => prev.filter((t) => t._id !== id));
        setSelected();
      },
      handleLoading,
      handleSetAlert,
    });

  const updateItem = async (updated: NationalMatchSeriesForm) => {
    if (!selected) return;
    const id = selected._id;

    updateItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.NATIONAL_MATCH_SERIES.UPDATE(id),
      data: updated,
      onAfterUpdate: (updatedItem: NationalMatchSeries) => {
        setItems((prev) =>
          prev.map((t) =>
            t._id === id
              ? convert(ModelType.NATIONAL_MATCH_SERIES, updatedItem)
              : t
          )
        );
        setSelectedItem(convert(ModelType.NATIONAL_MATCH_SERIES, updatedItem));
      },
      handleLoading,
      handleSetAlert,
    });
  };

  const setSelected = (id?: string) => {
    const finded = items.find((t) => t._id === id);
    setSelectedItem(finded ? finded : null);
  };

  const handleFormData = <K extends keyof NationalMatchSeriesForm>(
    key: K,
    value: NationalMatchSeriesForm[K]
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
    setFormSteps(steps[ModelType.NATIONAL_MATCH_SERIES]);
  }, []);

  const getDiffKeys = () => {
    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, formValue] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(
        ModelType.NATIONAL_MATCH_SERIES,
        selected
      )[typedKey];

      !objectIsEqual(formValue, selectedValue) && diff.push(key);
    }

    return diff;
  };

  const filterableField = fieldDefinition[
    ModelType.NATIONAL_MATCH_SERIES
  ].filter(isFilterable) as FilterableFieldDefinition[];

  const sortableField = fieldDefinition[ModelType.NATIONAL_MATCH_SERIES].filter(
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
    <NationalMatchSeriesContext.Provider value={value}>
      {children}
    </NationalMatchSeriesContext.Provider>
  );
};

const useNationalMatchSeries = () => {
  const context = useContext(NationalMatchSeriesContext);
  if (!context) {
    throw new Error(
      "useNationalMatchSeries must be used within a NationalMatchSeriesProvider"
    );
  }
  return context;
};

export { useNationalMatchSeries, NationalMatchSeriesProvider };
