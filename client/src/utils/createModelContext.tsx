import { createContext, ReactNode, useContext, useState } from "react";
import { useAlert } from "../context/alert-context";
import {
  FormTypeMap,
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../types/models";
import { BaseCrudRoutes } from "../types/baseCrudRoutes";
import { convert } from "../lib/convert/DBtoGetted";
import { MetaCrudContext } from "../types/context";
import { useApi } from "../context/api-context";
import {
  createItemBase,
  deleteItemBase,
  readItemBase,
  readItemsBase,
  updateItemBase,
  uploadFileBase,
} from "../lib/api";
import { cleanData } from ".";
import { fieldDefinition } from "../lib/model-fields";
import { isFilterable, isSortable } from "../types/field";
import { QueryParams, ResBody } from "@dai0413/myorg-shared";

export function createModelContext<T extends ModelType>(
  ContextModelString: T,
  backendRoute: BaseCrudRoutes
) {
  type Form = FormTypeMap[T];
  type Get = GettedModelDataMap[T];
  type Model = ModelDataMap[T];

  const Context = createContext<MetaCrudContext<T> | null>(null);

  const MetaCrudProvider = ({ children }: { children: ReactNode }) => {
    const {
      modal: { handleSetAlert },
      main: { handleSetAlert: mainHandleSetAlert },
    } = useAlert();
    const api = useApi();

    const [items, setItems] = useState<Get[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const [selected, setSelectedItem] = useState<Get | null>(null);

    const createItems = async (formDatas: Form[]) => {
      const result = createItemBase({
        apiInstance: api,
        backendRoute: backendRoute.ROOT,
        data: cleanData(formDatas),
        onAfterCreate: (item: Model[]) => {
          const createItems = convert(ContextModelString, item);
          setItems((prev) => [...prev, ...createItems]);
        },
        handleLoading,
        handleSetAlert,
      });
      return result;
    };

    const createItem = async (formData: Form) => {
      const result = createItemBase({
        apiInstance: api,
        backendRoute: backendRoute.ROOT,
        data: cleanData(formData),
        onAfterCreate: (item: Model) => {
          setItems((prev) => [...prev, convert(ContextModelString, item)]);
        },
        handleLoading,
        handleSetAlert,
      });
      return result;
    };

    const readItems = async (params: QueryParams) => {
      readItemsBase({
        apiInstance: api,
        backendRoute: backendRoute.ROOT,
        params,
        onSuccess: (resBody: ResBody<Model[]>) => {
          setItems(convert(ContextModelString, resBody.data));
          setTotalCount(resBody.totalCount ? resBody.totalCount : 1);
          setPage(resBody.page ? resBody.page : 1);
          setPageSize(resBody.pageSize ? resBody.pageSize : 1);
        },
        handleLoading,
        handleSetAlert,
      });
    };

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

    const deleteItem = async (id: string) => {
      const result = deleteItemBase({
        apiInstance: api,
        backendRoute: backendRoute.DETAIL(id),
        onAfterDelete: () => {
          setItems((prev) => prev.filter((t) => t._id !== id));
          setSelected();
        },
        handleLoading,
        handleSetAlert,
      });

      return result;
    };

    const updateItem = async (updated: Form) => {
      if (!selected) return false;
      console.log(updated);
      const id = selected._id;

      const result = updateItemBase({
        apiInstance: api,
        backendRoute: backendRoute.DETAIL(id),
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

      return result;
    };

    const uploadFile =
      typeof backendRoute.UPLOAD === "string"
        ? async (file: File) => {
            const result = uploadFileBase({
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

            return result;
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
              return true;
            } catch (error) {
              console.error("ファイルのダウンロードに失敗しました", error);

              return false;
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

    const filterableField =
      fieldDefinition[ContextModelString].filter(isFilterable);

    const sortableField =
      fieldDefinition[ContextModelString].filter(isSortable);

    const value: MetaCrudContext<T> = {
      items,
      totalCount,
      page,
      pageSize,
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

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useMetaCrud = () => {
    const metacrud = useContext(Context);

    if (!metacrud) {
      throw new Error("useMetaCrud must be used within MetaCrudProvider");
    }

    return { metacrud };
  };

  return { MetaCrudProvider, useMetaCrud };
}
