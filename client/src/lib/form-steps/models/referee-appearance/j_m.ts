import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { RefereeAppearanceForm } from "../../../../types/models/referee-appearance";
import { setMatchTeam } from "../../utils/createFilterConditions/setMatchTeam";
import { createItemBase } from "../../../api";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/refereeAppearance";
import { API_PATHS, Label, Select } from "@dai0413/myorg-shared";
import { AxiosInstance } from "axios";
import {
  resolveToLabel,
  resolveToValue,
} from "../../utils/resolver/resolveToValue";
import { DraftDataValue } from "../../../../types/form/draftData";

const KEYS = ["match", "referee"] as const;

const buildResolveInput = (
  draftData: DraftDataValue["refereeAppearance"],
  match: Label,
) => {
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
  const res = await createItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { refereeAppearance: input },
    returnResponse: true,
  });

  if (!res?.data || !Array.isArray(res.data.refereeAppearance)) return [];

  return res.data.refereeAppearance;
};

const resolve = async (
  api: AxiosInstance,
  data: DraftDataValue["staffAppearance"]["home"],
  match: Label,
) => {
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
      if (!getDataUrl || !api) return { value: [], label: [] };

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
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "referee",
        label: "審判",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "referee_name",
        label: "登録外審判",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "role",
        label: "役割",
        fieldType: "input",
        valueType: "text",
      },
    ],
    validate: (data) => {
      if (!data.referee && !data.referee_name) {
        return {
          success: false,
          message: "審判を選択・または入力してください",
        };
      }
      return {
        success: true,
      };
    },
    many: true,
  },
];
