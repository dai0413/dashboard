import { AxiosInstance } from "axios";
import { DraftData } from "./draftData";
import { UpdateData } from "./update";

type BaseArgs = {
  metaData: Record<string, any>;
  draftData: DraftData;
  api: AxiosInstance;
};
type PrepareUpdateDataArgs<FORM extends object, T extends boolean> = BaseArgs &
  (T extends true
    ? {
        formDatas: FORM[];
        formLabels: Record<string, any>[];
      }
    : {
        formData: FORM;
        formLabel: Record<string, any>;
      });

type PrepareUpdateDataReturn<
  FORM extends object,
  T extends boolean,
> = T extends true
  ? {
      originalDatas: UpdateData<FORM>[];
      formDatas: FORM[];
      formLabels: Record<string, any>[];
      metaData: Record<string, any>;
      metaDataLabel: Record<string, any>;
    }
  : {
      originalData: UpdateData<FORM> | null;
      formData: FORM;
      formLabel: Record<string, any>;
      metaData: Record<string, any>;
      metaDataLabel: Record<string, any>;
    };

export type PrepareUpdateData<FORM extends object, T extends boolean> = (
  args: PrepareUpdateDataArgs<FORM, T>,
) => Promise<PrepareUpdateDataReturn<FORM, T>>;
