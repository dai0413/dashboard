import { Form } from "@dai0413/myorg-shared/types/j_m/staff-appearance";
import { FormStep, StepType } from "../../../types/form";
import { FormTypeMap, ModelType } from "../../../types/models";
import { StaffAppearanceForm } from "../../../types/models/staff-appearance";
import { setMatchTeam } from "../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../types/types";

const getStaffAppearanceValues = (
  draftData: Form[],
  team?: Label,
  matchId?: string,
): StaffAppearanceForm[] => {
  const data: StaffAppearanceForm[] = draftData.map((d) => {
    return {
      ...d,
      match: matchId,
      staff: d.staff ? d.staff.id : undefined,
      team: team ? team?.id : undefined,
    };
  });

  return data;
};

const getStaffAppearanceLabels = (
  draftData: Form[],
  team?: Label,
  matchLabel?: string,
): Record<string, any>[] => {
  const data: Record<string, any>[] = draftData.map((d) => {
    return {
      ...d,
      match: matchLabel,
      staff: d.staff ? d.staff.label : undefined,
      team: team ? team?.label : undefined,
    };
  });

  return data;
};

export const staffAppearance: FormStep<ModelType.STAFF_APPEARANCE>[] = [
  {
    modelType: ModelType.STAFF_APPEARANCE,
    stepLabel: "スタッフの出場歴を入力開始",
    type: StepType.FORM,
    fields: [],
    createFilterConditions: async (
      data: FormTypeMap[ModelType.STAFF_APPEARANCE],
      api,
    ) => setMatchTeam(data, api),
    getDraftData: (draftData, postedDraftData, scrapingUrl) => {
      if (!scrapingUrl) return { value: [], label: [] };

      const {
        _id: matchId,
        home_team,
        away_team,
      } = postedDraftData[scrapingUrl].match;
      const { home, away } = draftData[scrapingUrl].staffAppearance;

      const value: StaffAppearanceForm[] = [
        ...getStaffAppearanceValues(home, home_team, matchId),
        ...getStaffAppearanceValues(away, away_team, matchId),
      ];

      const label: Record<string, any>[] = [
        ...getStaffAppearanceLabels(
          home,
          home_team,
          postedDraftData[scrapingUrl].matchLabel,
        ),
        ...getStaffAppearanceLabels(
          away,
          away_team,
          postedDraftData[scrapingUrl].matchLabel,
        ),
      ];

      return { value, label };
    },
    many: true,
  },
  {
    modelType: ModelType.STAFF_APPEARANCE,
    stepLabel: "背番号・ステータス・ポジション・プレイ時間を入力",
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
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "staff",
        label: "スタッフ",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "staff_name",
        label: "登録外スタッフ",
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
      if (!data.staff && !data.staff_name) {
        return {
          success: false,
          message: "スタッフを選択・または入力してください",
        };
      }
      return {
        success: true,
      };
    },
    many: true,
  },
];
