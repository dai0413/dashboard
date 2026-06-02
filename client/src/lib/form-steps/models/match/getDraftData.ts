import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";
import { Scraped as MatchScraped } from "@dai0413/myorg-shared/types/get-new-data/models/match";
import { GetDraftData } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";
import { createItemBase } from "../../../api";
import { AxiosInstance } from "axios";

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
}>[];

const fetchResolved = async (
  api: AxiosInstance,
  input: Input,
): Promise<ResolveOutput[]> => {
  const res = await createItemBase<{ match: ResolveOutput[] }>({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { match: input },
    returnResponse: true,
  });

  if (!res.success) return [];

  return res.data.match;
};

const resolve = async (api: AxiosInstance, data: MatchScraped[]) => {
  const input: Input = data;
  return fetchResolved(api, input);
};

export const getDraftData: GetDraftData<ModelType.MATCH, true> = async ({
  draftData,
  api,
  metaData,
}) => {
  const ids: string[] = metaData?.card_ids;

  if (!api || !ids) return { value: [], label: [] };

  const updatedDraftData = await readDraftData({
    api,
    draftData,
    matchIds: ids,
    keys: ["match"],
  });

  const matchData: MatchScraped[] = Object.values(updatedDraftData)
    .flatMap((v) => v.match)
    .filter((v): v is MatchScraped => v !== undefined);

  if (!matchData || !api) return null;

  const resolvedData = await resolve(api, matchData);
  const resolvedOutput = buildValueLabel(resolvedData, KEYS);

  const value: FormTypeMap[ModelType.MATCH][] = resolvedOutput.value.map(
    (v) => {
      return { ...v, date: v.date?.toString() };
    },
  );
  const label: Record<string, any>[] = resolvedOutput.label;

  return { value, label };
};
