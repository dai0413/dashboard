import { key } from "@dai0413/myorg-shared/generateField";
import { AxiosInstance } from "axios";
import { OnChange } from "../../../../../types/form/onChange";
import { PlayerAppearance } from "../../../../../types/models/player-appearance";
import { readItemsBase } from "../../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { FormTypeMap, ModelType } from "../../../../../types/models";

const fetchPlayerAppearances = async (
  api: AxiosInstance,
  match: string,
  team: string,
): Promise<PlayerAppearance[] | null> => {
  const resBody = await readItemsBase({
    apiInstance: api,
    params: { team, match, getAll: true, play_status: "start" },
    backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
    returnResponse: true,
  });

  return resBody?.data ?? null;
};

const extractPositions = (playerAppearance: PlayerAppearance[]): string[] =>
  playerAppearance
    .filter((d) => d.play_status === "start")
    .map((d) => d.position)
    .filter((p): p is string => typeof p === "string");

const fetchFormationByKey = async (
  api: AxiosInstance,
  key: string,
): Promise<{ id: string; label: string } | null> => {
  const resBody = await readItemsBase({
    apiInstance: api,
    params: { key },
    backendRoute: API_PATHS.FORMATION.ROOT,
    returnResponse: true,
  });

  if (!resBody?.data || resBody.data.length !== 1) return null;

  const f = resBody.data[0];
  return { id: f._id, label: f.name };
};

export const updateFormationFromLineup: OnChange<
  FormTypeMap[ModelType.TEAM_MATCH_FORMATION]
> = async (data, api) => {
  const matchId = data.match;
  const teamId = data.team;

  if (matchId == null || teamId == null || !api) return [];

  const playerAppearance = await fetchPlayerAppearances(api, matchId, teamId);

  if (!playerAppearance) return [];

  const positions = extractPositions(playerAppearance);

  const formation = await fetchFormationByKey(api, key(positions));

  if (!formation) return [];

  return [
    {
      key: "formation",
      value: { key: formation.id, label: formation.label },
    },
  ];
};
