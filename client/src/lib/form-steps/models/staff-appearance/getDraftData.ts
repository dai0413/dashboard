import { AxiosInstance } from "axios";
import { Label, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/staffAppearance";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/staff-appearance";
import { PostedDraftData } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../utils/getDraftData/readPostedDraftData";
import { getSeasons } from "../../utils/getSeasons";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";
import { fetchResolved } from "../../utils/resolver/fetchResolved";
import { ReadDraftDataParams } from "../../utils/getDraftData/types";

const KEYS = ["match", "staff", "team"] as const;

type Input = ResolveInput<{ staff: Select.MODEL }>;

const buildResolveInput = (
  draftData: Scraped[],
  match: Label,
  season: string[],
  team?: Label,
): Input[] => {
  const data = draftData.map((d) => {
    return {
      ...d,
      match,
      team: team,
      season,
    };
  });

  return data;
};

const resolve = async (
  api: AxiosInstance,
  data: Scraped[],
  match: Label,
  season: string[],
  team?: Label,
) => {
  const input = buildResolveInput(data, match, season, team);
  return fetchResolved<"staffAppearance", Input, ResolveOutput>(
    api,
    "staffAppearance",
    input,
  );
};

type GetDraftDataParams = {
  readDraftDataParams: Omit<ReadDraftDataParams, "readDraftDataKey">;
  postedDraftData: PostedDraftData;
  season: string;
};

export const getDraftData = async ({
  readDraftDataParams,
  postedDraftData,
  season,
}: GetDraftDataParams): Promise<{
  value: FormTypeMap[ModelType.PLAYER_APPEARANCE][];
  label: Record<string, any>[];
} | null> => {
  const updatedDraftData = await readDraftData({
    ...readDraftDataParams,
    readDraftDataKey: ["match", "staffAppearance"],
  });

  const updatedPostedDraftData = await readPostedDraftData({
    ...readDraftDataParams,
    postedDraftData,
    readPostedDraftDataKey: ["match"],
  });

  const { identifiers, api } = readDraftDataParams;

  const results = await Promise.all(
    identifiers.map(async (identifier) => {
      const newDraftData = updatedDraftData[identifier];

      if (!newDraftData.staffAppearance) return { value: [], label: [] };

      const { home: homeStaffAppearance, away: awayStaffAppearance } =
        newDraftData.staffAppearance;

      const posted = updatedPostedDraftData[identifier];

      if (!posted.match) return { value: [], label: [] };

      const { _id: matchId, home_team, away_team, date } = posted.match;

      const match = {
        id: matchId,
        label: posted.matchLabel || "",
      };

      const homeSeasons = await getSeasons(api, home_team.id, date);
      const awaySeasons = await getSeasons(api, away_team.id, date);

      const home = await resolve(
        api,
        homeStaffAppearance,
        match,
        [...new Set([season, ...homeSeasons])].filter(
          (v) => typeof v === "string",
        ),
        home_team,
      );
      const away = await resolve(
        api,
        awayStaffAppearance,
        match,
        [
          ...new Set(
            [season, ...awaySeasons].filter((v) => typeof v === "string"),
          ),
        ],
        away_team,
      );

      const homeResult = buildValueLabel(home, KEYS);
      const awayResult = buildValueLabel(away, KEYS);

      return {
        value: [...homeResult.value, ...awayResult.value],
        label: [...homeResult.label, ...awayResult.label],
      };
    }),
  );

  return {
    value: results.flatMap((r) => r.value),
    label: results.flatMap((r) => r.label),
  };
};
