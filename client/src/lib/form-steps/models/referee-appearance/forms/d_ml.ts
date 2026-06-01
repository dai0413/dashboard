import { AxiosInstance } from "axios";
import { API_PATHS, Label, Select } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/referee-appearance";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/refereeAppearance";
import {
  DraftData,
  FormStep,
  PostedDraftData,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { createItemBase, readItemBase } from "../../../../api";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { bulkBase, getFields } from "../fields";
import { validateRefereeEitherOne } from "../validations/referee";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { Match } from "../../../../../types/models/match";
import { convert } from "../../../../convert/DBtoGetted";
import { convert as createLabel } from "../../../../convert/CreateLabel";

const KEYS = ["match", "referee"] as const;

const buildResolveInput = (draftData: Scraped[], match: Label) => {
  const data = draftData.map((d) => {
    return {
      ...d,
      match,
    };
  });
  return data;
};

const fetchResolved = async (
  api: AxiosInstance,
  input: ResolveInput<{ referee: Select.MODEL }>[],
): Promise<ResolveOutput[]> => {
  const res = await createItemBase<{ refereeAppearance: ResolveOutput[] }>({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { refereeAppearance: input },
    returnResponse: true,
  });

  if (!res.success) return [];

  return res.data.refereeAppearance;
};

const resolve = async (api: AxiosInstance, data: Scraped[], match: Label) => {
  const input = buildResolveInput(data, match);
  return fetchResolved(api, input);
};

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

type BaseModel = ModelType.REFEREE_APPEARANCE;
const baseModel = ModelType.REFEREE_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const multiModel: FormStep<BaseModel>[] = [
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const refereeAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "審判の出場歴を入力開始",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      if (!api) return { value: [], label: [] };

      const ids: string[] = metaData?.match;

      const readDraftData = async (
        matchId: string,
      ): Promise<DraftData[any]> => {
        const readMatch = async () =>
          createItemBase<DraftData[any]["match"]>({
            apiInstance: api,
            backendRoute: API_PATHS.GET_NEW_DATA.D_M.MATCH,
            data: { id: matchId },
          });

        const readRefereeAppearance = async () =>
          createItemBase<DraftData[any]["refereeAppearance"]>({
            apiInstance: api,
            backendRoute: API_PATHS.GET_NEW_DATA.D_M.REFEREE_APPEARANCE,
            data: { id: matchId },
          });

        const [resMatch, resRefereeAppearance] = await Promise.all([
          readMatch(),
          readRefereeAppearance(),
        ]);

        if (!resMatch.success || !resRefereeAppearance.success) return {};

        const results: DraftData[any] = {
          match: resMatch.data,
          refereeAppearance: resRefereeAppearance.data,
        };

        return results;
      };

      const readPostedDraftData = async (
        matchId: string,
      ): Promise<PostedDraftData[any]> => {
        const readMatch = async () =>
          readItemBase<Match>({
            apiInstance: api,
            backendRoute: API_PATHS.MATCH.DETAIL(matchId),
          });

        const resMatch = await readMatch();

        if (!resMatch) return {};

        const match = convert(ModelType.MATCH, resMatch);

        if (!match) return {};
        const results: PostedDraftData[any] = {
          match: convert(ModelType.MATCH, resMatch),
          matchLabel: createLabel(ModelType.MATCH, resMatch),
        };

        return results;
      };

      const results = await Promise.all(
        ids.map(async (id) => {
          const newDraftData =
            id in draftData && draftData[id].refereeAppearance
              ? draftData[id]
              : await readDraftData(id);

          if (!newDraftData.refereeAppearance) return { value: [], label: [] };

          const posted =
            id in postedDraftData && postedDraftData[id].match
              ? postedDraftData[id]
              : await readPostedDraftData(id);

          if (!posted.match) return { value: [], label: [] };

          const { _id: matchId } = posted.match;

          const match = {
            id: matchId,
            label: posted.matchLabel || "",
          };

          const resolved = await resolve(
            api,
            newDraftData.refereeAppearance,
            match,
          );

          const result = buildValueLabel(resolved);

          return { value: result.value, label: result.label };
        }),
      );

      return {
        value: results.flatMap((r) => r.value),
        label: results.flatMap((r) => r.label),
      };
    },
  },
  {
    modelType: baseModel,
    stepLabel: "詳細を入力",
    type: StepType.FORM,
    fields: getFields(["match", "referee", "referee_name", "role"]),
    validate: validateRefereeEitherOne,
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
