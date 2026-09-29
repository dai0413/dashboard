import { AxiosInstance } from "axios";

type OnChangeArgs<FORM extends object, T extends boolean> = T extends true
  ? {
      metaData: Record<string, any>;
      api: AxiosInstance;
      formDatas: FORM[];
      formLabels: Record<string, any>[];
    }
  : {
      metaData: Record<string, any>;
      api: AxiosInstance;
      formData: FORM;
      formLabel: Record<string, any>;
    };

export type OnChangeReturn<
  FORM extends object,
  T extends boolean,
> = T extends true
  ? {
      formDatas: FORM[];
      formLabels: Record<string, any>[];
      metaData: Record<string, any>;
    }
  : {
      formData: FORM;
      formLabel: Record<string, any>;
      metaData: Record<string, any>;
    };

export type OnChange<FORM extends object, T extends boolean> = (
  args: OnChangeArgs<FORM, T>,
) => Promise<OnChangeReturn<FORM, T>>;
