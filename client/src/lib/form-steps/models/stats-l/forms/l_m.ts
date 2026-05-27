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
import { getPreMatchSelect } from "../../../core/preMatchSelectStep";

type BaseModel = ModelType.STATS_L;
const baseModel = ModelType.STATS_L;

const KEYS = ["match", "team"] as const;

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

const preSteps = getPreMatchSelect<BaseModel>(baseModel);

export const statsL: FormStep<BaseModel>[] = [
  ...preSteps,
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
        (matchId) => !newData[matchId]?.statsL,
      );

      for (const matchId of missingMatchIds) {
        const statsL = newData[matchId]?.statsL;

        // 既存データあり
        if (statsL) continue;

        // 既存データなし
        const matchObj = await readItemBase<Match>({
          apiInstance: api,
          backendRoute: API_PATHS.MATCH.DETAIL(matchId),
        });

        if (!matchObj) continue;

        const res = await createItemBase<Scraped>({
          apiInstance: api,
          // backendRoute: API_PATHS.GET_NEW_DATA.L_M.STATS,
          backendRoute: "/get-new-data/l-m/stats",
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
            statsL: res.data,
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

      let newDataValue: StatsLForm[] = [];
      let newDataLabel: Record<string, any>[] = [];

      const havingMatchIds = matchIds.filter(
        (matchId) => draftData[matchId]?.statsL,
      );

      for (const matchId of havingMatchIds) {
        const statsL = draftData[matchId]?.statsL;

        if (!statsL) continue;

        const matchObj = await readItemBase<Match>({
          apiInstance: api,
          backendRoute: API_PATHS.MATCH.DETAIL(matchId),
        });

        if (!matchObj) continue;

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

        const homeData = {
          ...statsL.home,
          match,
          team: home,
        };
        const awayData = {
          ...statsL.away,
          match,
          team: away,
        };

        const homeResult = buildValueLabel([homeData]);
        const awayResult = buildValueLabel([awayData]);

        newDataValue.push(...homeResult.value, ...awayResult.value);
        newDataLabel.push(...homeResult.label, ...awayResult.label);
      }

      return { value: newDataValue, label: newDataLabel };
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
