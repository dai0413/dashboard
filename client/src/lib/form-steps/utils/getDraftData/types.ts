import { AxiosInstance } from "axios";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { DraftData, DraftDataValue } from "../../../../types/form";
import { readMap } from "./readMap";

type ReadRequest = {
  [K in keyof typeof readMap]: {
    [F in keyof (typeof readMap)[K]]: {
      draftDataKey: K;
      from: F;
      params: ReadParams;
    };
  }[keyof (typeof readMap)[K]];
}[keyof typeof readMap];

export type ReadDraftDataParams = {
  api: AxiosInstance;
  draftData: DraftData;
  identifiers: string[];
  requests: ReadRequest[];
};

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
