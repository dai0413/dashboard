import { FormStep, StepType } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { StaffAppearanceForm } from "../../../../types/models/staff-appearance";
import { setMatchTeam } from "../../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../../types/types";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/staffAppearance";
import { createItemBase } from "../../../api";
import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  resolveToLabel,
  resolveToValue,
} from "../../utils/resolver/resolveToValue";
import { AxiosInstance } from "axios";
import { DraftDataValue } from "../../../../types/form/draftData";
import { getSeasons } from "../../utils/getDraftData/getSeasons";

const KEYS = ["match", "staff", "team"] as const;

const buildResolveInput = (
  draftData: DraftDataValue["staffAppearance"]["home"],
  match: Label,
  season: string[],
  team?: Label,
): ResolveInput<{ staff: Select.MODEL }>[] => {
  const data = draftData.map((d) => {
    return {
      ...d,
      match,
      team: team,
      season,
    };
  });

  return data;
};

const fetchResolved = async (
  api: AxiosInstance,
  input: ResolveInput<{ staff: Select.MODEL }>[],
): Promise<ResolveOutput[]> => {
  const res = await createItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { staffAppearance: input },
    returnResponse: true,
  });

  if (!res?.data || !Array.isArray(res.data.staffAppearance)) return [];

  return res.data.staffAppearance;
};

const resolve = async (
  api: AxiosInstance,
  data: DraftDataValue["staffAppearance"]["home"],
  match: Label,
  season: string[],
  team?: Label,
) => {
  const input = buildResolveInput(data, match, season, team);
  return fetchResolved(api, input);
};

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

export const staffAppearance: FormStep<ModelType.STAFF_APPEARANCE>[] = [
  {
    modelType: ModelType.STAFF_APPEARANCE,
    stepLabel: "スタッフの出場歴を入力開始",
    type: StepType.FORM,
    fields: [],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const getDataUrl = metaData.getDataUrl;
      const season = metaData.season;
      if (!getDataUrl || !api) return { value: [], label: [] };

      const {
        _id: matchId,
        home_team,
        away_team,
        date,
      } = postedDraftData[getDataUrl].match;

      const match = {
        id: matchId,
        label: postedDraftData[getDataUrl].matchLabel || "",
      };

      const homeSeasons = await getSeasons(api, home_team.id, date);
      const awaySeasons = await getSeasons(api, away_team.id, date);

      const home = await resolve(
        api,
        draftData[getDataUrl].staffAppearance.home,
        match,
        [...new Set([season, ...homeSeasons])],
        home_team,
      );
      const away = await resolve(
        api,
        draftData[getDataUrl].staffAppearance.away,
        match,
        [...new Set([season, ...awaySeasons])],
        away_team,
      );

      const homeResult = buildValueLabel(home);
      const awayResult = buildValueLabel(away);

      const value: StaffAppearanceForm[] = [
        ...homeResult.value,
        ...awayResult.value,
      ];
      const label: Record<string, any>[] = [
        ...homeResult.label,
        ...awayResult.label,
      ];

      return { value, label };
    },
    many: true,
  },
  {
    modelType: ModelType.STAFF_APPEARANCE,
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
