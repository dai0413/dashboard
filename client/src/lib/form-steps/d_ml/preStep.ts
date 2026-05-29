import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";
import { Scraped as MatchScraped } from "@dai0413/myorg-shared/types/get-new-data/models/match";
import { FormStep, StepType } from "../../../types/form";
import { FormTypeMap, ModelType } from "../../../types/models";
import { createItemBase } from "../../api";
import { AxiosInstance } from "axios";
import {
  resolveToLabel,
  resolveToValue,
} from "../utils/resolver/resolveToValue";
import { DraftData, DraftDataValue } from "../../../types/form/draftData";
import { getPreMatchSelect } from "./preMatchSelectStep";

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

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "cardId");

export const preStep: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, VALUESデータを取得します",
    type: StepType.FORM,
    many: true,
    addDraftData: async ({ data, metaData, api, formLabel }) => {
      const id: string[] = metaData?.card_ids;

      if (!api || !id) return {};

      const res = await createItemBase<DraftData>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.D_M.VALUES,
        data: { id },
        returnResponse: true,
      });

      if (!res.success) return {};

      const draftDataValue = res.data;

      const applyCompetitionStage = (item: DraftDataValue) => {
        if (!item.match) return item;

        return {
          ...item,
          match: {
            ...item.match,
            competition_stage: {
              id: data.competition_stage,
              label: formLabel.competition_stage,
            },
          },
        };
      };

      const nextData: DraftData = Object.fromEntries(
        Object.entries(draftDataValue).map(([key, value]) => [
          key,
          applyCompetitionStage(value),
        ]),
      );

      return nextData;
    },
    getDraftData: async ({ draftData, api }) => {
      const matchData: MatchScraped[] = Object.values(draftData)
        .flatMap((v) => v.match)
        .filter((v): v is MatchScraped => v !== undefined);

      if (!matchData || !api) return null;

      const resolvedData = await resolve(api, matchData);
      const resolvedOutput = buildValueLabel(resolvedData);

      const value: FormTypeMap[ModelType.MATCH][] = resolvedOutput.value.map(
        (v) => {
          return { ...v, date: v.date?.toString() };
        },
      );
      const label: Record<string, any>[] = resolvedOutput.label;

      return { value, label };
    },
  },
];
