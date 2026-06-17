import { API_PATHS, Label, Select } from "@dai0413/myorg-shared";
import { DataSource, FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createItemBase, readItemBase } from "../../../../api";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { DraftData } from "../../../../../types/form/draftData";
import { getFields } from "../fields";
import { TeamMatchFormationForm } from "../../../../../types/models/team-match-formation";
import { Match } from "../../../../../types/models/match";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/team-match-formation";
import { convert } from "../../../../convert/CreateLabel";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/teamMatchFormation";
import { AxiosInstance } from "axios";
import { Scraped as TeamMatchFormationScraped } from "@dai0413/myorg-shared/types/get-new-data/models/team-match-formation";
import { getPreMatchSelect } from "../../../l_m/preMatchSelectStep";
import { createConfirmationStep } from "../../../confirmationStep";
import { buildValueLabel } from "../../../utils/resolver/resolveToValue";

type BaseModel = ModelType.TEAM_MATCH_FORMATION;
const baseModel = ModelType.TEAM_MATCH_FORMATION;

const KEYS = ["team", "match", "formation"] as const;

const buildResolveInput = (
  draftData: TeamMatchFormationScraped[],
  match: Label,
  team: Label,
) => {
  const data = draftData.map((d) => {
    return {
      ...d,
      match,
      team,
    };
  });
  return data;
};

const fetchResolved = async (
  api: AxiosInstance,
  input: ResolveInput<{ formation: Select.MODEL }>[],
): Promise<ResolveOutput[]> => {
  const res = await createItemBase<{ teamMatchFormation: ResolveOutput[] }>({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { teamMatchFormation: input },
    returnResponse: true,
  });

  if (!res.success) return [];

  return res.data.teamMatchFormation;
};

const resolve = async (
  api: AxiosInstance,
  data: TeamMatchFormationScraped[],
  match: Label,
  team: Label,
) => {
  const input = buildResolveInput(data, match, team);
  return fetchResolved(api, input);
};

export const teamMatchFormation: FormStep<BaseModel>[] = [
  ...getPreMatchSelect<BaseModel>(baseModel),
  {
    stepLabel: "試合を選択",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.META_DATA,
    fields: getFields(["match"], { match: { multi: true } }),
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    addDraftData: async ({ api, draftData, metaData }) => {
      if (!metaData || !api) return {};

      const matchIds: string[] = metaData.match;

      let newData: DraftData = { ...draftData };

      const missingMatchIds = matchIds.filter(
        (matchId) => !newData[matchId]?.teamMatchFormation,
      );

      for (const matchId of missingMatchIds) {
        const teamMatchFormation = newData[matchId]?.teamMatchFormation;

        // 既存データあり
        if (teamMatchFormation) continue;

        // 既存データなし
        const matchObj = await readItemBase<Match>({
          apiInstance: api,
          backendRoute: API_PATHS.MATCH.DETAIL(matchId),
        });

        if (!matchObj) continue;

        const res = await createItemBase<Scraped>({
          apiInstance: api,
          backendRoute: API_PATHS.GET_NEW_DATA.L_M.FORMATION,
          data: {
            date: matchObj.date,
            alph: matchObj.home_team.labalph,
            key: matchId,
          },
        });

        if (!res.success) continue;

        newData = {
          ...newData,
          [matchId]: {
            ...draftData[matchId],
            teamMatchFormation: res.data,
          },
        };
      }

      return newData;
    },
  },
  {
    stepLabel: "データ取得",
    type: StepType.FORM,
    modelType: baseModel,
    many: true,
    getDraftData: async ({ api, draftData, metaData }) => {
      if (!metaData || !api) return { value: [], label: [] };

      const matchIds: string[] = metaData.match;

      let newDataValue: TeamMatchFormationForm[] = [];
      let newDataLabel: Record<string, any>[] = [];

      const havingMatchIds = matchIds.filter(
        (matchId) => draftData[matchId]?.teamMatchFormation,
      );

      for (const matchId of havingMatchIds) {
        const teamMatchFormation = draftData[matchId]?.teamMatchFormation;

        if (!teamMatchFormation) continue;

        const matchObj = await readItemBase<Match>({
          apiInstance: api,
          backendRoute: API_PATHS.MATCH.DETAIL(matchId),
        });

        if (!matchObj) continue;

        const match = {
          id: matchId,
          label: convert(ModelType.MATCH, matchObj) || "",
        };

        const home = {
          id: matchObj.home_team._id,
          label: convert(ModelType.TEAM, matchObj.home_team),
        };

        const away = {
          id: matchObj.away_team._id,
          label: convert(ModelType.TEAM, matchObj.away_team),
        };

        const homeData = await resolve(
          api,
          [teamMatchFormation.home],
          match,
          home,
        );

        const awayData = await resolve(
          api,
          [teamMatchFormation.away],
          match,
          away,
        );

        const homeResult = buildValueLabel(homeData, KEYS);
        const awayResult = buildValueLabel(awayData, KEYS);

        newDataValue.push(...homeResult.value, ...awayResult.value);
        newDataLabel.push(...homeResult.label, ...awayResult.label);
      }

      return { value: newDataValue, label: newDataLabel };
    },
  },
  {
    modelType: ModelType.TEAM_MATCH_FORMATION,
    stepLabel: "フォーメーションを入力",
    type: StepType.FORM,
    fields: getFields(["match", "team", "formation"]),
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
