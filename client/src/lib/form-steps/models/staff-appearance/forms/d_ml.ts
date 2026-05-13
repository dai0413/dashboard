import { AxiosInstance } from "axios";
import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/staffAppearance";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/staff-appearance";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../../../types/types";
import { createItemBase } from "../../../../api";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { getSeasons } from "../../../utils/getDraftData/getSeasons";
import { getFields } from "../fields";
import { validateStaffEitherOne } from "../validations/staff";

const KEYS = ["match", "staff", "team"] as const;

const buildResolveInput = (
  draftData: Scraped[],
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
  const res = await createItemBase<{ staffAppearance: ResolveOutput[] }>({
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
  data: Scraped[],
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
      const season = metaData.season;
      if (!api) return { value: [], label: [] };

      const results = await Promise.all(
        Object.entries(postedDraftData).map(async ([url, posted]) => {
          const draft = draftData[url];
          if (!draft || !draft.staffAppearance) return { value: [], label: [] };

          const { _id: matchId, home_team, away_team, date } = posted.match;

          const match = {
            id: matchId,
            label: posted.matchLabel || "",
          };

          const homeSeasons = await getSeasons(api, home_team.id, date);
          const awaySeasons = await getSeasons(api, away_team.id, date);

          const home = await resolve(
            api,
            draft.staffAppearance.home,
            match,
            [...new Set([season, ...homeSeasons])],
            home_team,
          );
          const away = await resolve(
            api,
            draft.staffAppearance.away,
            match,
            [...new Set([season, ...awaySeasons])],
            away_team,
          );

          const homeResult = buildValueLabel(home);
          const awayResult = buildValueLabel(away);

          return {
            value: [...homeResult.value, ...awayResult.value],
            label: [...homeResult.label, ...awayResult.label],
          };
        }),
      );

      return {
        value: results.flatMap((r) => r.value),
        label: results.flatMap((r) => r.label),
      };
    },
    many: true,
  },
  {
    modelType: ModelType.STAFF_APPEARANCE,
    stepLabel: "詳細を入力",
    type: StepType.FORM,
    fields: getFields(["match", "team", "staff", "staff_name", "role"]),
    validate: validateStaffEitherOne,
    many: true,
  },
];
