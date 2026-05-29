import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";
import { Scraped as MatchScraped } from "@dai0413/myorg-shared/types/get-new-data/models/match";

import {
  AddPostedDraftData,
  FormStep,
  PostedDraftData,
  StepType,
} from "../../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { createItemBase } from "../../../../api";
import { AxiosInstance } from "axios";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { DraftData } from "../../../../../types/form/draftData";
import { convert } from "../../../../convert/DBtoGetted";
import { createConfirmationStep } from "../../../confirmationStep";
import { Match } from "../../../../../types/models/match";
import { convert as createLabel } from "../../../../convert/CreateLabel";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { bulkBase } from "../fields";

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

const afterMatchaddPostedDraftData: AddPostedDraftData = ({
  postedDraftData,
  res,
  metaData,
}) => {
  const card_ids: string[] = metaData.card_ids;

  if (!res.success) return {};

  const matchOriginal: Match[] = res.data;

  const posted: PostedDraftData = Object.fromEntries(
    matchOriginal.map((match, i) => {
      const matchData = convert(ModelType.MATCH, match);
      const label = createLabel(ModelType.MATCH, match);

      const periods = match.match_format?.period;
      const card_id = card_ids[i];

      return [
        card_id,
        {
          ...postedDraftData[card_id],
          matchLabel: label,
          match: { ...matchData },
          periods,
        },
      ];
    }),
  );

  return posted;
};

type BaseModel = ModelType.MATCH;
const baseModel = ModelType.MATCH;

const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "cardId");

export const multiModel: FormStep<BaseModel>[] = [
  bulkBase,
  {
    ...createConfirmationStep<BaseModel>(baseModel),
    addPostedDraftData: afterMatchaddPostedDraftData,
  },
];

export const match: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, MATCHモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    addDraftData: async ({ data, metaData, api, formLabel, draftData }) => {
      const ids: string[] = metaData?.card_ids;

      if (!api || !ids) return {};

      let results: DraftData = {};

      for (const id of ids) {
        if (id in draftData && draftData[id].match) {
          return (results = { [id]: { match: draftData[id].match } });
        }

        const res = await createItemBase<DraftData[any]["match"]>({
          apiInstance: api,
          backendRoute: API_PATHS.GET_NEW_DATA.D_M.MATCH,
          data: { id },
        });

        if (!res.success || !res.data) continue;

        const draftDataValue = res.data;

        results = {
          [id]: {
            match: {
              ...draftDataValue,
              competition_stage: {
                id: data.competition_stage,
                label: formLabel.competition_stage,
              },
            },
          },
        };
      }

      return results;
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
  ...multiModel,
];
