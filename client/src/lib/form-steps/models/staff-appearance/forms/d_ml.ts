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
import { getSeasons } from "../../../utils/getSeasons";
import { bulkBase } from "../fields";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { readDraftData } from "../../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../../utils/getDraftData/readPostedDraftData";

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

  if (!res.success) return [];

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

type BaseModel = ModelType.STAFF_APPEARANCE;
const baseModel = ModelType.STAFF_APPEARANCE;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const multiModel: FormStep<BaseModel>[] = [
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const staffAppearance: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "スタッフの出場歴を入力開始",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      const season = metaData.season;
      if (!api) return { value: [], label: [] };

      const ids: string[] = metaData?.match;

      const updatedDraftData = await readDraftData({
        api,
        draftData,
        matchIds: ids,
        keys: ["match", "staffAppearance"],
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

          if (!newDraftData.staffAppearance) return { value: [], label: [] };

          const { home: homeStaffAppearance, away: awayStaffAppearance } =
            newDraftData.staffAppearance;

          const posted = updatedPostedDraftData[id];

          if (!posted.match) return { value: [], label: [] };

          const { _id: matchId, home_team, away_team, date } = posted.match;

          const match = {
            id: matchId,
            label: posted.matchLabel || "",
          };

          const homeSeasons = await getSeasons(api, home_team.id, date);
          const awaySeasons = await getSeasons(api, away_team.id, date);

          const home = await resolve(
            api,
            homeStaffAppearance,
            match,
            [...new Set([season, ...homeSeasons])].filter(
              (v) => typeof v === "string",
            ),
            home_team,
          );
          const away = await resolve(
            api,
            awayStaffAppearance,
            match,
            [
              ...new Set(
                [season, ...awaySeasons].filter((v) => typeof v === "string"),
              ),
            ],
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
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
