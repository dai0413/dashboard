import { createContext, ReactNode, useContext, useState } from "react";
import { useAlert } from "../alert-context";
import {
  NationalMatchSeries,
  NationalMatchSeriesForm,
  NationalMatchSeriesGet,
} from "../../types/models/national-match-series";
import { APIError, ReadItemsParamsMap, ResponseStatus } from "../../types/api";
import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { convertGettedToForm } from "../../lib/convert/GettedtoForm";
import { getSingleSteps } from "../../lib/form-steps";
import {
  BulkFormContext,
  MetaCrudContext,
  SingleFormContext,
} from "../../types/context";
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
import { updateFormValue } from "../../utils/updateFormValue";
import { getBulkSteps } from "../../lib/form-steps/many";

type ContextModelType = ModelType.NATIONAL_MATCH_SERIES;
const ContextModelString = ModelType.NATIONAL_MATCH_SERIES;
type Form = NationalMatchSeriesForm;
type Get = NationalMatchSeriesGet;
type Model = NationalMatchSeries;
const backendRoute = API_ROUTES.NATIONAL_MATCH_SERIES;
const singleStep = getSingleSteps(ContextModelString);
const bulkStep = getBulkSteps(ContextModelString);

const SingleContext = createContext<SingleFormContext<ContextModelType> | null>(
  null
);

const BulkContext = createContext<BulkFormContext<ContextModelType> | null>(
  null
);

const MetaCrudContextContext =
  createContext<MetaCrudContext<ContextModelType> | null>(null);

const SingleProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<Form>({});

  const startNewData = (item?: Partial<Form>) => {
    item ? setFormData(item) : setFormData({});
  };

  const startEdit = (item?: Get) => {
    if (item) {
      setFormData(convertGettedToForm(ContextModelString, item));
    }
  };

  const handleFormData = <K extends keyof Form>(key: K, value: Form[K]) => {
    setFormData((prev) => updateFormValue(prev, key, value));
  };

  const resetFormData = () => {
    setFormData({});
  };

  const value: SingleFormContext<ContextModelType> = {
    formData,
    handleFormData,
    resetFormData,
    formSteps: singleStep,
    startNewData,
    startEdit,
  };
  return (
    <SingleContext.Provider value={value}>{children}</SingleContext.Provider>
  );
};

const BulkProvider = ({ children }: { children: ReactNode }) => {
  const [formDatas, setFormDatas] = useState<Form[]>([]);

  const value: BulkFormContext<ContextModelType> = {
    formDatas,
    setFormDatas,
    manyDataFormSteps: bulkStep,
  };
  return <BulkContext.Provider value={value}>{children}</BulkContext.Provider>;
};

const MetaCrudProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
    main: { handleSetAlert: mainHandleSetAlert },
  } = useAlert();
  const api = useApi();
  const { formData } = useSingle();

  const [items, setItems] = useState<Get[]>([]);
  const [selected, setSelectedItem] = useState<Get | null>(null);

  const createItems = async (formDatas: Form[]) => {
    createItemBase({
      apiInstance: api,
      backendRoute: backendRoute.CREATE,
      data: cleanData(formDatas),
      onAfterCreate: (item: Model[]) => {
        const createItems = convert(ContextModelString, item);
        setItems((prev) => [...prev, ...createItems]);
      },
      handleLoading,
      handleSetAlert,
    });
  };

  const createItem = async () =>
    createItemBase({
      apiInstance: api,
      backendRoute: backendRoute.CREATE,
      data: cleanData(formData),
      onAfterCreate: (item: Model) => {
        setItems((prev) => [...prev, convert(ContextModelString, item)]);
      },
      handleLoading,
      handleSetAlert,
    });

  const readItems = async (params: ReadItemsParamsMap[ContextModelType] = {}) =>
    readItemsBase({
      apiInstance: api,
      backendRoute: backendRoute.GET_ALL,
      params,
      onSuccess: (items: Model[]) => {
        setItems(convert(ContextModelString, items));
      },
      handleLoading,
      handleSetAlert,
    });

  const readItem = async (id: string) =>
    readItemBase({
      apiInstance: api,
      backendRoute: backendRoute.DETAIL(id),
      onSuccess: (item: Model) => {
        setSelectedItem(convert(ContextModelString, item));
      },
      handleLoading,
      handleSetAlert,
    });

  const deleteItem = async (id: string) =>
    deleteItemBase({
      apiInstance: api,
      backendRoute: backendRoute.DELETE(id),
      onAfterDelete: () => {
        setItems((prev) => prev.filter((t) => t._id !== id));
        setSelected();
      },
      handleLoading,
      handleSetAlert,
    });

  const updateItem = async (updated: Form) => {
    if (!selected) return;
    const id = selected._id;

    updateItemBase({
      apiInstance: api,
      backendRoute: backendRoute.UPDATE(id),
      data: updated,
      onAfterUpdate: (updatedItem: Model) => {
        setItems((prev) =>
          prev.map((t) =>
            t._id === id ? convert(ContextModelString, updatedItem) : t
          )
        );
        setSelectedItem(convert(ContextModelString, updatedItem));
      },
      handleLoading,
      handleSetAlert,
    });
  };

  const uploadFile =
    typeof backendRoute.UPLOAD === "string"
      ? async (file: File) => {
          let alert: ResponseStatus = { success: false };

          const formData = new FormData();
          formData.append("file", file);

          try {
            const res = await api.post(backendRoute.UPLOAD!, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            const item = res.data.data as Model[];
            setItems((prev) => [...prev, ...convert(ContextModelString, item)]);

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
        }
      : undefined;

  const downloadFile =
    typeof backendRoute.DOWNLOAD === "string"
      ? async () => {
          try {
            const res = await api.get(backendRoute.DOWNLOAD!, {
              responseType: "blob",
            });

            const blob = new Blob([res.data], {
              type: "text/csv;charset=utf-8;",
            });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${ContextModelString}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("ファイルのダウンロードに失敗しました", error);
          }
        }
      : undefined;

  const setSelected = (id?: string) => {
    const finded = items.find((t) => t._id === id);
    setSelectedItem(finded ? finded : null);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLoading = (time: "start" | "end") =>
    time === "start" ? setIsLoading(true) : setIsLoading(false);

  const getDiffKeys = () => {
    if (!selected) return [];

    const diff: string[] = [];
    for (const [key, formValue] of Object.entries(formData)) {
      const typedKey = key as keyof typeof formData;
      const selectedValue = convertGettedToForm(ContextModelString, selected)[
        typedKey
      ];

      !objectIsEqual(formValue, selectedValue) && diff.push(key);
    }

    return diff;
  };

  const filterableField = fieldDefinition[ContextModelString].filter(
    isFilterable
  ) as FilterableFieldDefinition[];

  const sortableField = fieldDefinition[ContextModelString].filter(
    isSortable
  ) as SortableFieldDefinition[];

  const value: MetaCrudContext<ContextModelType> = {
    items,
    selected,
    setSelected,
    readItem,
    readItems,
    createItem,
    createItems,
    updateItem,
    deleteItem,
    getDiffKeys,
    uploadFile,
    downloadFile,
    isLoading,
    filterableField,
    sortableField,
  };
  return (
    <MetaCrudContextContext.Provider value={value}>
      {children}
    </MetaCrudContextContext.Provider>
  );
};

const NationalMatchSeriesContext = {
  single: SingleContext,
  bulk: BulkContext,
  metacrud: MetaCrudContextContext,
};

const NationalMatchSeriesProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SingleProvider>
      <BulkProvider>
        <MetaCrudProvider>{children}</MetaCrudProvider>
      </BulkProvider>
    </SingleProvider>
  );
};

const useSingle = () => {
  const context = useContext(SingleContext);
  if (!context) {
    throw new Error("useSingle must be used within a SingleProvider");
  }
  return context;
};

const useNationalMatchSeries = () => {
  const single = useContext(NationalMatchSeriesContext.single);
  const bulk = useContext(NationalMatchSeriesContext.bulk);
  const metacrud = useContext(NationalMatchSeriesContext.metacrud);

  if (!single || !bulk || !metacrud) {
    throw new Error(
      "useNationalMatchSeries must be used within NationalMatchSeriesProvider"
    );
  }

  return { single, bulk, metacrud };
};

export { useNationalMatchSeries, NationalMatchSeriesProvider };
