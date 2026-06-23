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

type ReadableDraftDataKey = keyof DraftDataValue | "values";

export type ReadMap = Partial<Record<ReadableDraftDataKey, ReadFun<any>>>;

type ReadParams =
  | {
      cardId: string[];
    }
  | {
      url: string;
    }
  | {
      getParams: { date: Date; alph: string; matchId: string }[];
    }
  | {
      getParam: { date?: Date; alph?: string };
    };

type ReadResult<K extends ReadableDraftDataKey> = K extends "values"
  ? DraftData
  : K extends keyof DraftDataValue
    ? DraftDataValue[K]
    : never;

export type ReadFun<K extends ReadableDraftDataKey> = (
  api: AxiosInstance,
  readParams: ReadParams,
) => Promise<CreateItemResponse<ReadResult<K> | undefined>>;
