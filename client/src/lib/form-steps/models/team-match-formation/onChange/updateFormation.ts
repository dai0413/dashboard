import { key } from "@dai0413/myorg-shared/generateField";
import { AxiosInstance } from "axios";
import { OnChange } from "../../../../../types/form/onChange";
import { PlayerAppearance } from "../../../../../types/models/player-appearance";
import { readItemsBase } from "../../../../api";
import { API_PATHS } from "@dai0413/myorg-shared";
import { TeamMatchFormationForm } from "../../../../../types/models/team-match-formation";
import { Formation } from "../../../../../types/models/formation";

const fetchPlayerAppearances = async (
  api: AxiosInstance,
  match: string,
  team: string,
): Promise<PlayerAppearance[] | null> => {
  const obj = await readItemsBase<PlayerAppearance[]>({
    apiInstance: api,
    params: { team, match, getAll: true, play_status: "start" },
    backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
  });

  return obj?.data ?? null;
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
  const obj = await readItemsBase<Formation[]>({
    apiInstance: api,
    params: { key },
    backendRoute: API_PATHS.FORMATION.ROOT,
  });

  if (!obj?.data || obj.data.length !== 1) return null;

  const f = obj.data[0];
  return { id: f._id, label: f.name };
};

export const updateFormationFromLineup: OnChange<
  TeamMatchFormationForm,
  false
> = async ({ formData, formLabel, api }) => {
  const matchId = formData.match;
  const teamId = formData.team;

  if (matchId == null || teamId == null || !api) return { formData, formLabel };

  const playerAppearance = await fetchPlayerAppearances(api, matchId, teamId);

  if (!playerAppearance) return { formData, formLabel };

  const positions = extractPositions(playerAppearance);

  const formation = await fetchFormationByKey(api, key(positions));

  if (!formation) return { formData, formLabel };

  let returnValue: Partial<TeamMatchFormationForm> = {};
  let returnFormLabel: Record<string, any> = {};
  returnValue["formation"] = formation.id;
  returnFormLabel["formation"] = formation.label;

  return { formData: returnValue, formLabel: returnFormLabel };
};
