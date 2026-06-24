import { AxiosInstance } from "axios";
import { Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/statsL";
import { PostedDraftData } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../utils/getDraftData/readPostedDraftData";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";
import { fetchResolved } from "../../utils/resolver/fetchResolved";
import { ReadDraftDataParams } from "../../utils/getDraftData/types";

const KEYS = ["match", "team"] as const;

type Input = ResolveInput<{ match: Select.LABEL; team: Select.LABEL }>;

const resolve = async (api: AxiosInstance, data: Input) => {
  return fetchResolved<"statsL", Input, ResolveOutput>(api, "statsL", [data]);
};

type GetDraftDataParams = {
  readDraftDataParams: ReadDraftDataParams;
  postedDraftData: PostedDraftData;
};

export const getDraftData = async ({
  readDraftDataParams,
  postedDraftData,
}: GetDraftDataParams): Promise<{
  value: FormTypeMap[ModelType.STATS_L][];
  label: Record<string, any>[];
} | null> => {
  const updatedDraftData = await readDraftData(readDraftDataParams);

  const updatedPostedDraftData = await readPostedDraftData({
    ...readDraftDataParams,
    postedDraftData,
    readPostedDraftDataKey: ["match"],
  });

  const { identifiers, api } = readDraftDataParams;

  const results = await Promise.all(
    identifiers.map(async (identifiers) => {
      const newDraftData = updatedDraftData[identifiers];

      if (!newDraftData.statsL) return { value: [], label: [] };

      const { home: homeStatsL, away: awayStatsL } = newDraftData.statsL;

      const posted = updatedPostedDraftData[identifiers];

      if (!posted.match) return { value: [], label: [] };

      const { _id: matchId, home_team, away_team } = posted.match;

      const match = {
        id: matchId,
        label: posted.matchLabel || "",
      };

      const home = await resolve(api, {
        ...homeStatsL,
        match,
        team: home_team,
      });

      const away = await resolve(api, {
        ...awayStatsL,
        match,
        team: away_team,
      });

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
