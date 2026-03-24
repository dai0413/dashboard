import { Form } from "@dai0413/myorg-shared/types/j_m/referee-appearance";
import { FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { RefereeAppearanceForm } from "../../../types/models/referee-appearance";
import { setMatchTeam } from "../utils/createFilterConditions/setMatchTeam";

const getRefereeAppearanceValues = (
  draftData: Form[],
  matchId?: string,
): RefereeAppearanceForm[] => {
  const data: RefereeAppearanceForm[] = draftData.map((d) => {
    return {
      ...d,
      match: matchId,
      referee: d.referee ? d.referee.id : undefined,
    };
  });

  return data;
};

const getRefereeAppearanceLabels = (
  draftData: Form[],
  matchLabel?: string,
): Record<string, any>[] => {
  const data: Record<string, any>[] = draftData.map((d) => {
    return {
      ...d,
      match: matchLabel,
      referee: d.referee ? d.referee.label : undefined,
    };
  });

  return data;
};

export const refereeAppearance: FormStep<ModelType.REFEREE_APPEARANCE>[] = [
  {
    modelType: ModelType.REFEREE_APPEARANCE,
    stepLabel: "審判の出場歴を入力開始",
    type: StepType.FORM,
    fields: [],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: ({ draftData, postedDraftData, metaData }) => {
      const getDataUrl = metaData.getDataUrl;
      if (!getDataUrl) return { value: [], label: [] };

      const { _id: matchId } = postedDraftData[getDataUrl].match;
      const { refereeAppearance } = draftData[getDataUrl];

      const value: RefereeAppearanceForm[] = getRefereeAppearanceValues(
        refereeAppearance,
        matchId,
      );

      const label: Record<string, any>[] = getRefereeAppearanceLabels(
        refereeAppearance,
        postedDraftData[getDataUrl].matchLabel,
      );

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
