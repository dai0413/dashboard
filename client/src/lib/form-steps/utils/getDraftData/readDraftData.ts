import { API_PATHS, CreateItemResponse } from "@dai0413/myorg-shared";
import { DraftData, DraftDataValue } from "../../../../types/form";
import { createItemBase } from "../../../api";
import { AxiosInstance } from "axios";

const readMatch: ReadFun<"match"> = async (
  api: AxiosInstance,
  matchId: string,
) =>
  createItemBase<DraftData[any]["match"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.MATCH,
    data: { id: matchId },
  });

const readPlayerAppearance: ReadFun<"playerAppearance"> = async (
  api: AxiosInstance,
  matchId: string,
) =>
  createItemBase<DraftData[any]["playerAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.PLAYER_APPEARANCE,
    data: { id: matchId },
  });

const readPlayerMatchEventLog: ReadFun<"playerMatchEventLog"> = async (
  api: AxiosInstance,
  matchId: string,
) =>
  createItemBase<DraftData[any]["playerMatchEventLog"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.PLAYER_MATCH_EVENT_LOG,
    data: { id: matchId },
  });

const readStaffAppearance: ReadFun<"staffAppearance"> = async (
  api: AxiosInstance,
  matchId: string,
) =>
  createItemBase<DraftData[any]["staffAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.STAFF_APPEARANCE,
    data: { id: matchId },
  });

const readStaffMatchEventLog: ReadFun<"staffMatchEventLog"> = async (
  api: AxiosInstance,
  matchId: string,
) =>
  createItemBase<DraftData[any]["staffMatchEventLog"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.STAFF_MATCH_EVENT_LOG,
    data: { id: matchId },
  });

const readRefereeAppearance: ReadFun<"refereeAppearance"> = async (
  api: AxiosInstance,
  matchId: string,
) =>
  createItemBase<DraftData[any]["refereeAppearance"]>({
    apiInstance: api,
    backendRoute: API_PATHS.GET_NEW_DATA.D_M.REFEREE_APPEARANCE,
    data: { id: matchId },
  });

type ReadFun<K extends keyof DraftDataValue> = (
  api: AxiosInstance,
  matchId: string,
) => Promise<CreateItemResponse<DraftDataValue[K] | undefined>>;

const readMap = {
  match: readMatch,
  playerAppearance: readPlayerAppearance,
  playerMatchEventLog: readPlayerMatchEventLog,
  staffAppearance: readStaffAppearance,
  staffMatchEventLog: readStaffMatchEventLog,
  refereeAppearance: readRefereeAppearance,
} satisfies Record<string, ReadFun<any>>;

type ReadableDraftDataKey = keyof typeof readMap;

type ReadDraftDataParams = {
  api: AxiosInstance;
  draftData: DraftData;
  matchIds: string[];
  keys: ReadableDraftDataKey[];
};

export const readDraftData = async ({
  api,
  draftData,
  matchIds,
  keys,
}: ReadDraftDataParams): Promise<DraftData> => {
  const entries = await Promise.all(
    matchIds.map(async (matchId) => {
      const originalData = draftData[matchId];

      const missingKeys = keys.filter(
        (key) => originalData?.[key] === undefined,
      );

      const responses = await Promise.all(
        missingKeys.map(async (key) => {
          const response = await readMap[key](api, matchId);

          return {
            key,
            response,
          };
        }),
      );

      const data: Partial<DraftDataValue> = {
        ...(originalData ?? {}),
      };

      for (const { key, response } of responses) {
        if (response.success) {
          data[key] = response.data as never;
        }
      }

      return [matchId, data] as const;
    }),
  );

  return Object.fromEntries(entries);
};
