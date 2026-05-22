import {
  DataSource,
  DraftData,
  FormStep,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { getFields } from "../fields";
import { createField } from "../utils/createField";
import { createItemBase, readItemBase } from "../../../../api";
import { StatsLForm } from "../../../../../types/models/stats-l";
import { API_PATHS } from "@dai0413/myorg-shared";
import { Match } from "../../../../../types/models/match";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/site/l_m/stats-l";
import { convert as convertToLabel } from "../../../../convert/CreateLabel";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { ResolveOutput } from "@dai0413/myorg-shared/types/resolver/statsL";

type BaseModel = ModelType.STATS_L;
const baseModel = ModelType.STATS_L;

const KEYS = ["match", "team"] as const;

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

export const statsL: FormStep<BaseModel>[] = [
  {
    stepLabel: "試合を選択",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.META_DATA,
    fields: getFields(["match"]),
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    addDraftData: async ({ api, draftData, metaData }) => {
      if (!metaData || !api) return {};

      // const matchId: string = metaData.match;
      const matchId = "694356b435e6b4bcfd8e385e";

      const matchObj = await readItemBase<Match>({
        apiInstance: api,
        backendRoute: API_PATHS.MATCH.DETAIL(matchId),
      });

      console.log("matchObj", matchObj);

      if (!matchObj) return {};

      const stats = await createItemBase<Scraped>({
        apiInstance: api,
        backendRoute: API_PATHS.GET_NEW_DATA.L_M.STATS,
        data: { date: matchObj.date, alph: matchObj.home_team.labalph },
      });

      if (!stats.success) return {};

      const { home, away } = stats.data;

      const newStatsL: DraftData[any]["statsL"] = {
        home,
        away,
      };

      const newDraftData: DraftData = {
        ...draftData,
        [matchId]: {
          ...draftData[matchId],
          statsL: newStatsL,
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

      if (!draftData[matchId].statsL) return { value: [], label: [] };

      const matchObj = await readItemBase<Match>({
        apiInstance: api,
        backendRoute: API_PATHS.MATCH.DETAIL(matchId),
      });

      if (!matchObj) return { value: [], label: [] };

      const match = {
        id: matchId,
        label: convertToLabel(ModelType.MATCH, matchObj) || "",
      };

      const home = {
        id: matchObj.home_team._id,
        label: convertToLabel(ModelType.TEAM, matchObj.home_team),
      };

      const away = {
        id: matchObj.away_team._id,
        label: convertToLabel(ModelType.TEAM, matchObj.away_team),
      };

      const homeData = { ...draftData[matchId].statsL.home, match, team: home };
      const awayData = { ...draftData[matchId].statsL.away, match, team: away };

      const homeResult = buildValueLabel([homeData]);
      const awayResult = buildValueLabel([awayData]);

      const value: StatsLForm[] = [...homeResult.value, ...awayResult.value];
      const label: Record<string, any>[] = [
        ...homeResult.label,
        ...awayResult.label,
      ];

      return { value, label };
    },
  },
  {
    stepLabel: "チームを選択, スタッツを入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: [...getFields(["team"]), ...createField()],
    many: true,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
