import { DraftData, DraftDataValue } from "../../../../types/form";
import { AxiosInstance } from "axios";
import { From } from "../../../../types/types";
import { readD_MMap } from "./readD_M";
import { readJ_MMap } from "./readJ_M";
import { CreateItemResponse } from "@dai0413/myorg-shared";

export type J_MReadableKey = keyof typeof readJ_MMap;
export type D_MReadableKey = keyof typeof readD_MMap;

type J_MReadDraftDataParams = {
  api: AxiosInstance;
  draftData: DraftData;
  identifiers: string[];
  readParams: ReadParams;
  readDraftDataKey: J_MReadableKey[];
  from: From.J_M;
};

type D_MReadDraftDataParams = {
  api: AxiosInstance;
  draftData: DraftData;
  identifiers: string[];
  readParams: ReadParams;
  readDraftDataKey: D_MReadableKey[];
  from: From.D_M;
};

export type ReadDraftDataParams =
  | J_MReadDraftDataParams
  | D_MReadDraftDataParams;

type ReadableDraftDataKey = keyof DraftDataValue;

export type ReadMap = Partial<Record<ReadableDraftDataKey, ReadFun<any>>>;

export type ReadParams =
  | {
      cardId: string[];
    }
  | {
      url: string;
    };

export type ReadFun<K extends ReadableDraftDataKey> = (
  api: AxiosInstance,
  readParams: ReadParams,
) => Promise<CreateItemResponse<DraftDataValue[K] | undefined>>;
