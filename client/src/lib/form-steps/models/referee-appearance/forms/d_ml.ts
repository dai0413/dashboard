import { AxiosInstance } from "axios";
import { API_PATHS, Label, Select } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/referee-appearance";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/refereeAppearance";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { createItemBase } from "../../../../api";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { bulkBase, getFields } from "../fields";
import { validateRefereeEitherOne } from "../validations/referee";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { readDraftData } from "../../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../../utils/getDraftData/readPostedDraftData";

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

      const updatedDraftData = await readDraftData({
        api,
        draftData,
        matchIds: ids,
        keys: ["match", "refereeAppearance"],
      });

      const updatedPostedDraftData = await readPostedDraftData({
        api,
        postedDraftData,
        matchIds: ids,
        keys: ["match"],
      });

      const results = await Promise.all(
        ids.map(async (id) => {
          const newDraftData = updatedDraftData[id];

          if (!newDraftData.refereeAppearance) return { value: [], label: [] };

          const posted = updatedPostedDraftData[id];

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
