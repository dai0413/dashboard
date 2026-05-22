import { API_PATHS, Label, Select } from "@dai0413/myorg-shared";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createItemBase, readItemBase } from "../../../../api";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { DraftData } from "../../../../../types/form/draftData";
import { getFields } from "../fields";
import { TeamMatchFormationForm } from "../../../../../types/models/team-match-formation";
import { Match } from "../../../../../types/models/match";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/site/l_m/team-match-formation";
import { convert } from "../../../../convert/CreateLabel";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/teamMatchFormation";
import { AxiosInstance } from "axios";
import { Scraped as TeamMatchFormationScraped } from "@dai0413/myorg-shared/types/get-new-data/models/team-match-formation";

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

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

export const teamMatchFormation: FormStep<BaseModel>[] = [
  {
    modelType: baseModel,
    stepLabel: "フォーメーションを入力開始",
    type: StepType.FORM,
    fields: [],
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    addDraftData: async ({ api, draftData, metaData }) => {
      if (!metaData || !api) return {};

      // const matchId: string = metaData.match;
      const matchId = "694356b435e6b4bcfd8e385e";

      const matchObj = await readItemBase<Match>({
        apiInstance: api,
        backendRoute: API_PATHS.MATCH.DETAIL(matchId),
      });

      if (!matchObj) return {};

      const stats = await createItemBase<Scraped>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.L_M.FORMATION,
        data: { date: matchObj.date, alph: matchObj.home_team.labalph },
      });

      if (!stats.success) return {};

      const { home, away } = stats.data;

      const newTeamMatchFormation: DraftData[any]["teamMatchFormation"] = {
        home,
        away,
      };

      const newDraftData: DraftData = {
        ...draftData,
        [matchId]: {
          ...draftData[matchId],
          teamMatchFormation: newTeamMatchFormation,
        },
      };

      console.log("newDraftData", newDraftData);

      return newDraftData;
    },
  },
  {
    stepLabel: "データ取得",
    type: StepType.FORM,
    modelType: baseModel,
    many: true,
    getDraftData: async ({ api, draftData, metaData }) => {
      // const matchId: string = metaData.match;
      const matchId = "694356b435e6b4bcfd8e385e";

      console.log("in getDraft", draftData[matchId].teamMatchFormation);

      if (!draftData[matchId].teamMatchFormation)
        return { value: [], label: [] };

      const matchObj = await readItemBase<Match>({
        apiInstance: api,
        backendRoute: API_PATHS.MATCH.DETAIL(matchId),
      });

      console.log("in getDraft matchObj", matchObj);

      if (!matchObj) return { value: [], label: [] };

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
        [draftData[matchId].teamMatchFormation.home],
        match,
        home,
      );
      console.log("in homeData", homeData);

      const awayData = await resolve(
        api,
        [draftData[matchId].teamMatchFormation.away],
        match,
        away,
      );

      const homeResult = buildValueLabel(homeData);
      const awayResult = buildValueLabel(awayData);

      const value: TeamMatchFormationForm[] = [
        ...homeResult.value,
        ...awayResult.value,
      ];
      const label: Record<string, any>[] = [
        ...homeResult.label,
        ...awayResult.label,
      ];

      console.log("in last label", label);

      return { value, label };
    },
  },
  {
    modelType: ModelType.TEAM_MATCH_FORMATION,
    stepLabel: "フォーメーションを入力",
    type: StepType.FORM,
    fields: getFields(["match", "team", "formation"]),
    many: true,
  },
];
