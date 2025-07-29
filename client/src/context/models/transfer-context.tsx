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
  Transfer,
  TransferForm,
  TransferGet,
} from "../../types/models/transfer";
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

const initialFormData: TransferForm = {};

const defaultContext = getDefaultValue(initialFormData);

const TransferContext =
  createContext<ModelContext<ModelType.TRANSFER>>(defaultContext);

const TransferProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
  } = useAlert();

  const api = useApi();

  const [items, setItems] = useState<TransferGet[]>([]);
  const [selected, setSelectedItem] = useState<TransferGet | null>(null);
  const [formData, setFormData] = useState<TransferForm>(initialFormData);

  const [formSteps, setFormSteps] = useState<FormStep<ModelType.TRANSFER>[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoading = (time: "start" | "end") =>
    time === "start" ? setIsLoading(true) : setIsLoading(false);

  const startNewData = (item?: Partial<TransferForm>) => {
    item ? setFormData(item) : setFormData({});
  };

  const startEdit = (item?: TransferGet) => {
    if (item) {
      setFormData(convertGettedToForm(ModelType.TRANSFER, item));
      setSelectedItem(item);
    }
  };

  const createItem = async () =>
    createItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.CREATE,
      data: cleanData(formData),
      onAfterCreate: (item: Transfer) => {
        setItems((prev) => [...prev, convert(ModelType.TRANSFER, item)]);
        setFormData(initialFormData);
      },
      handleLoading,
      handleSetAlert,
    });

  const readItems = async (
    params: ReadItemsParamsMap[ModelType.TRANSFER] = {}
  ) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.GET_ALL,
      params,
      onSuccess: (items: Transfer[]) => {
        setItems(convert(ModelType.TRANSFER, items));
      },
      handleLoading,
      handleSetAlert,
    });

  const readItem = async (id: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.DETAIL(id),
      onSuccess: (item: Transfer) => {
        setSelectedItem(convert(ModelType.TRANSFER, item));
      },
      handleLoading,
      handleSetAlert,
    });

  const updateItem = async (updated: TransferForm) => {
    if (!selected) return;
    const id = selected._id;

    updateItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.UPDATE(id),
      data: updated,
      onAfterUpdate: (updatedItem: Transfer) => {
        setItems((prev) =>
          prev.map((t) =>
            t._id === id ? convert(ModelType.TRANSFER, updatedItem) : t
          )
        );
        setSelectedItem(convert(ModelType.TRANSFER, updatedItem));
      },
      handleLoading,
      handleSetAlert,
    });
  };

  const deleteItem = async (id: string) =>
    deleteItemBase({
      apiInstance: api,
      backendRoute: API_ROUTES.TRANSFER.DELETE(id),
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

  const handleFormData = <K extends keyof TransferForm>(
    key: K,
    value: TransferForm[K]
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
    setFormSteps(steps[ModelType.TRANSFER]);
  }, []);

  const getDiffKeys = () => {
    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, formValue] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(ModelType.TRANSFER, selected)[
        typedKey
      ];

      !objectIsEqual(formValue, selectedValue) && diff.push(key);
    }

    return diff;
  };

  const filterableField = fieldDefinition[ModelType.TRANSFER].filter(
    isFilterable
  ) as FilterableFieldDefinition[];

  const sortableField = fieldDefinition[ModelType.TRANSFER].filter(
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
