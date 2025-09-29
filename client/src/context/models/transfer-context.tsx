import { createContext, ReactNode, useContext, useState } from "react";
import { useAlert } from "../alert-context";
import {
  Transfer,
  TransferForm,
  TransferGet,
} from "../../types/models/transfer";
import { ReadItemsParamsMap } from "../../types/api";
import { ModelType } from "../../types/models";

import { API_ROUTES } from "../../lib/apiRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { MetaCrudContext } from "../../types/context";
import { useApi } from "../api-context";
import {
  createItemBase,
  deleteItemBase,
  readItemBase,
  readItemsBase,
  updateItemBase,
} from "../../lib/api";
import { cleanData } from "../../utils";
import { fieldDefinition } from "../../lib/model-fields";
import {
  FilterableFieldDefinition,
  isFilterable,
  isSortable,
  SortableFieldDefinition,
} from "../../types/field";
import { uploadFileBase } from "../../lib/api/uploadFile";

type ContextModelType = ModelType.TRANSFER;
const ContextModelString = ModelType.TRANSFER;
type Form = TransferForm;
type Get = TransferGet;
type Model = Transfer;
const backendRoute = API_ROUTES.TRANSFER;

const MetaCrudContextContext =
  createContext<MetaCrudContext<ContextModelType> | null>(null);

const MetaCrudProvider = ({ children }: { children: ReactNode }) => {
  const {
    modal: { handleSetAlert },
    main: { handleSetAlert: mainHandleSetAlert },
  } = useAlert();
  const api = useApi();

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

  const createItem = async (formData: Form) =>
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
          uploadFileBase({
            apiInstance: api,
            backendRoute: backendRoute.UPLOAD!,
            data: file,
            onAfterUpload: (item: Model[] | Model) => {
              if (Array.isArray(item)) {
                const createItems = convert(ContextModelString, item);
                setItems((prev) => [...prev, ...createItems]);
              } else {
                const createItems = convert(ContextModelString, item);
                setItems((prev) => [...prev, ...[createItems]]);
              }
            },
            handleSetAlert: mainHandleSetAlert,
          });
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

const MatchFormatContext = {
  metacrud: MetaCrudContextContext,
};

const TransferProvider = ({ children }: { children: ReactNode }) => {
  return <MetaCrudProvider>{children}</MetaCrudProvider>;
};

const useTransfer = () => {
  const metacrud = useContext(MatchFormatContext.metacrud);

  if (!metacrud) {
    throw new Error("useTransfer must be used within TransferProvider");
  }

  return { metacrud };
};

export { useTransfer, TransferProvider };
