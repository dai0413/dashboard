import { createContext, ReactNode, useContext, useState } from "react";
import { useAlert } from "../../context/alert-context";
import {
  FormTypeMap,
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../types/models";
import { BaseCrudRoutes } from "../../types/baseCrudRoutes";
import { convert } from "../../lib/convert/DBtoGetted";
import { MetaCrudContext } from "../../types/context";
import { api } from "../../context/api-context";
import {
  createItemBase,
  deleteItemBase,
  readItemBase,
  readItemsBase,
  updateItemBase,
  uploadFileBase,
} from "../../lib/api";
import { cleanData } from "../data";
import { QueryParams, UploadJobType } from "@dai0413/myorg-shared";

export function createModelContext<T extends ModelType>(
  ContextModelString: T,
  backendRoute: BaseCrudRoutes,
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

    const [items, setItems] = useState<Get[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const [selected, setSelectedItem] = useState<Get | null>(null);

    const [uploadJob, setUploadJob] = useState<UploadJobType | null>(null);

    const resetItems = () => setItems([]);

    const createItems = async (formDatas: Form[]) => {
      const success = await createItemBase<Form[]>({
        apiInstance: api,
        backendRoute: backendRoute.ROOT,
        data: cleanData(formDatas),
        handleLoading,
        handleSetAlert,
        returnResponse: true,
      });

      return success;
    };

    const createItem = async (formData: Form) => {
      const result = await createItemBase<Form>({
        apiInstance: api,
        backendRoute: backendRoute.ROOT,
        data: cleanData(formData),
        handleLoading,
        handleSetAlert,
      });

      return result;
    };

    const readItems = async (params: QueryParams) => {
      const obj = await readItemsBase<Model[]>({
        apiInstance: api,
        backendRoute: backendRoute.ROOT,
        params,
        handleLoading,
        handleSetAlert,
        returnResponse: true,
      });

      if (obj) {
        setItems(convert(ContextModelString, obj.data));
        setTotalCount(obj.totalCount);
        setPage(obj.page);
        setPageSize(obj.pageSize);
      }
    };

    const readItem = async (id: string) => {
      const item = await readItemBase<Model>({
        apiInstance: api,
        backendRoute: backendRoute.DETAIL(id),
        returnResponse: true,
        handleLoading,
        handleSetAlert,
      });

      if (item) setSelectedItem(convert(ContextModelString, item));
    };

    const deleteItem = async (id: string) => {
      const success = await deleteItemBase({
        apiInstance: api,
        backendRoute: backendRoute.DETAIL(id),
        handleLoading,
        handleSetAlert,
      });

      if (success) {
        setItems((prev) => prev.filter((t) => t._id !== id));
        setSelected();
      }

      return success;
    };

    const updateItem = async (updated: Form) => {
      if (!selected) return false;
      const id = selected._id;

      const result = await updateItemBase<Form>({
        apiInstance: api,
        backendRoute: backendRoute.DETAIL(id),
        data: updated,
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
              handleSetAlert: mainHandleSetAlert,
              setUploadJob,
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
      resetItems,
      isLoading,
      uploadJob,
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
