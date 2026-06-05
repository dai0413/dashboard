import { AxiosInstance } from "axios";
import { Label, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";
import { Scraped as MatchScraped } from "@dai0413/myorg-shared/types/get-new-data/models/match";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";
import { fetchResolved } from "../../utils/resolver/fetchResolved";
import { ReadDraftDataParams } from "../../utils/getDraftData/types";

const KEYS = [
  "home_team",
  "away_team",
  "stadium",
  "match_format",
  "competition_stage",
] as const;

type Input = ResolveInput<{
  competition: Select.MODEL;
  home_team: Select.MODEL;
  away_team: Select.MODEL;
  match_format: Select.MODEL;
  stadium: Select.MODEL;
}>;

const resolve = async (api: AxiosInstance, data: Input[]) => {
  return fetchResolved<"match", Input, ResolveOutput>(api, "match", data);
};

type GetDraftDataParams = {
  readDraftDataParams: Omit<ReadDraftDataParams, "readDraftDataKey">;
  competition_stage: Label;
};

export const getDraftData = async ({
  readDraftDataParams,
  competition_stage,
}: GetDraftDataParams): Promise<{
  value: FormTypeMap[ModelType.MATCH][];
  label: Record<string, any>[];
} | null> => {
  const updatedDraftData = await readDraftData(readDraftDataParams);

  const matchData: MatchScraped[] = Object.values(updatedDraftData)
    .flatMap((v) => v.match)
    .filter((v): v is MatchScraped => v !== undefined);

  const { api } = readDraftDataParams;

  const resolvedData = await resolve(api, matchData);
  const resolvedOutput = buildValueLabel(resolvedData, KEYS);

  const value: FormTypeMap[ModelType.MATCH][] = resolvedOutput.value.map(
    (v) => {
      return {
        ...v,
        date: v.date?.toString(),
        competition_stage: competition_stage.id,
      };
    },
  );
  const label: Record<string, any>[] = resolvedOutput.label.map((v) => {
    return {
      ...v,
      competition_stage: competition_stage.label,
    };
  });

  return { value, label };
};
