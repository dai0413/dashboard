import { AxiosInstance } from "axios";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/draftData";
import { FormTypeMap } from "../models";
import { PostedDraftData } from "./postedDraftData";

export type AddDraftData<K extends keyof FormTypeMap> = (args: {
  data: FormTypeMap[K] & Record<string, any>;
  metaData: Record<string, any>;
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  api: AxiosInstance;
  formLabel: Record<string, any>;
}) => Promise<DraftData>;

export type GetDraftData<
  K extends keyof FormTypeMap,
  T extends boolean,
> = (args: {
  data: FormTypeMap[K] & Record<string, any>;
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  metaData: Record<string, any>;
  api: AxiosInstance;
  formLabel: Record<string, any>;
}) => T extends true
  ? Promise<{ value: FormTypeMap[K][]; label: Record<string, any>[] } | null>
  : Promise<{ value: FormTypeMap[K]; label: Record<string, any> } | null>;

export type DraftDataValue = Scraped[any];

export type DraftData = Record<string, DraftDataValue>;
