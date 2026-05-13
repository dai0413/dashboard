import { AxiosInstance } from "axios";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/refereeAppearance";
import { API_PATHS, Label, Select } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/referee-appearance";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { RefereeAppearanceForm } from "../../../../../types/models/referee-appearance";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { createItemBase } from "../../../../api";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { getFields } from "../fields";
import { validateRefereeEitherOne } from "../validations/referee";

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

  if (!res?.data || !Array.isArray(res.data.refereeAppearance)) return [];

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

export const refereeAppearance: FormStep<ModelType.REFEREE_APPEARANCE>[] = [
  {
    modelType: ModelType.REFEREE_APPEARANCE,
    stepLabel: "審判の出場歴を入力開始",
    type: StepType.FORM,
    fields: [],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const getDataUrl = metaData.getDataUrl;
      if (!getDataUrl || !api || !draftData[getDataUrl].refereeAppearance)
        return { value: [], label: [] };

      const { _id: matchId } = postedDraftData[getDataUrl].match;

      const match = {
        id: matchId,
        label: postedDraftData[getDataUrl].matchLabel || "",
      };

      const resolved = await resolve(
        api,
        draftData[getDataUrl].refereeAppearance,
        match,
      );

      const result = buildValueLabel(resolved);

      const value: RefereeAppearanceForm[] = result.value;
      const label: Record<string, any>[] = result.label;

      return { value, label };
    },
    many: true,
  },
  {
    modelType: ModelType.REFEREE_APPEARANCE,
    stepLabel: "詳細を入力",
    type: StepType.FORM,
    fields: getFields(["match", "referee", "referee_name", "role"]),
    validate: validateRefereeEitherOne,
    many: true,
  },
];
