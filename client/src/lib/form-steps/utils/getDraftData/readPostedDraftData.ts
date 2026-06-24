import { API_PATHS } from "@dai0413/myorg-shared";
import { PostedDraftData, PostedDraftDataValues } from "../../../../types/form";
import { Match } from "../../../../types/models/match";
import { readItemBase, readItemsBase } from "../../../api";
import { ModelType } from "../../../../types/models";
import { AxiosInstance } from "axios";
import { convert } from "../../../convert/DBtoGetted";
import { convert as createLabel } from "../../../convert/CreateLabel";
import { PlayerAppearance } from "../../../../types/models/player-appearance";
import { StaffAppearance } from "../../../../types/models/staff-appearance";

const readMatch: ReadFun = async (api: AxiosInstance, matchId: string) => {
  const res = await readItemBase<Match>({
    apiInstance: api,
    backendRoute: API_PATHS.MATCH.DETAIL(matchId),
  });

  if (!res) return undefined;

  const result: PostedDraftData[any] = {
    match: convert(ModelType.MATCH, res),
    matchLabel: createLabel(ModelType.MATCH, res),
    periods: res.match_format?.period,
  };

  return result;
};

const readPlayerAppearance = async (
  api: AxiosInstance,
  matchId: string,
  postedDraftDataValues: PostedDraftDataValues,
) => {
  const homeId = postedDraftDataValues.match?.home_team.id;
  const awayId = postedDraftDataValues.match?.away_team.id;

  const res = await readItemsBase<PlayerAppearance[]>({
    apiInstance: api,
    backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
    params: { match: matchId, getAll: true },
  });

  if (!res?.data) return undefined;

  const players = convert(ModelType.PLAYER_APPEARANCE, res.data);

  const homePlayerAppearance = players.filter((d) => d.team.id === homeId);
  const awayPlayerAppearance = players.filter((d) => d.team.id === awayId);

  const result: PostedDraftData[any] = {
    playerAppearance: {
      home: homePlayerAppearance,
      away: awayPlayerAppearance,
    },
  };

  return result;
};

const readStaffAppearance = async (
  api: AxiosInstance,
  matchId: string,
  postedDraftDataValues: PostedDraftDataValues,
) => {
  const homeId = postedDraftDataValues.match?.home_team.id;
  const awayId = postedDraftDataValues.match?.away_team.id;

  const res = await readItemsBase<StaffAppearance[]>({
    apiInstance: api,
    backendRoute: API_PATHS.STAFF_APPEARANCE.ROOT,
    params: { match: matchId, getAll: true },
  });

  if (!res?.data) return undefined;

  const staffs = convert(ModelType.STAFF_APPEARANCE, res.data);

  const homeStaffAppearance = staffs.filter((d) => d.team.id === homeId);
  const awayStaffAppearance = staffs.filter((d) => d.team.id === awayId);

  const result: PostedDraftData[any] = {
    staffAppearance: {
      home: homeStaffAppearance,
      away: awayStaffAppearance,
    },
  };

  return result;
};

type ReadFun = (
  api: AxiosInstance,
  matchId: string,
  postedDraftDataValues: PostedDraftDataValues,
) => Promise<PostedDraftDataValues | undefined>;

const readMap = {
  match: readMatch,
  playerAppearance: readPlayerAppearance,
  staffAppearance: readStaffAppearance,
} satisfies Record<string, ReadFun>;

type ReadableDraftDataKey = keyof typeof readMap;

type ReadDraftDataParams = {
  api: AxiosInstance;
  postedDraftData: PostedDraftData;
  identifiers: string[];
  readPostedDraftDataKey: ReadableDraftDataKey[];
};

export const readPostedDraftData = async ({
  api,
  postedDraftData,
  identifiers,
  readPostedDraftDataKey,
}: ReadDraftDataParams): Promise<PostedDraftData> => {
  const entries = await Promise.all(
    identifiers.map(async (identifier) => {
      const originalData = postedDraftData[identifier] || {};

      const missingKeys = readPostedDraftDataKey.filter(
        (key) => originalData?.[key] === undefined,
      );

      let data: Partial<PostedDraftDataValues> = {
        ...(originalData ?? {}),
      };

      for (const key of missingKeys) {
        const response = await readMap[key](api, identifier, data);

        if (response) {
          data = { ...data, ...response };
        }
      }

      return [identifier, data];
    }),
  );

  return Object.fromEntries(entries);
};
