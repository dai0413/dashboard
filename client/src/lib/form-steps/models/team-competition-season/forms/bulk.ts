import { API_PATHS } from "@dai0413/myorg-shared";
import {
  DataSource,
  FormStep,
  QuickFilterItemsByKey,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { TeamCompetitionSeasonForm } from "../../../../../types/models/team-competition-season";
import { readItemBase, readItemsBase } from "../../../../api";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { convert } from "../../../../convert/CreateLabel";
import { TeamCompetitionSeason as Option } from "../../../../../utils/createOption/types/model/team-competition-season";
import { Season } from "../../../../../types/models/season";

type BaseModel = ModelType.TEAM_COMPETITION_SEASON;
const baseModel = ModelType.TEAM_COMPETITION_SEASON;

export const bulk: FormStep<ModelType.TEAM_COMPETITION_SEASON>[] = [
  {
    stepLabel: "シーズンを選択",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["season"]),
    createQuickFilterItems: async ({ data, metaData, api }) => {
      if (!api || !metaData || !data?.season) return {};

      const item = await readItemBase<Season>({
        apiInstance: api,
        backendRoute: API_PATHS.SEASON.DETAIL(data?.season),
      });

      if (!item) return {};

      const seasons = await readItemsBase<Season[]>({
        apiInstance: api,
        backendRoute: API_PATHS.SEASON.ROOT,
        params: {
          competition: item?.competition._id,
          start_date: `<${item.start_date}`,
          sort: "-start_date",
          limit: 5,
        },
      });

      if (!seasons) return {};

      // season ごとに QuickFilterItemsByKey を作成
      const first: QuickFilterItemsByKey = {
        "team-competition-season": seasons?.data.map((season) => {
          const seasonId = season._id;
          const label = convert(ModelType.SEASON, season);

          return {
            key: seasonId,
            label: label,
            filterCondition: [
              {
                key: "season",
                label: "シーズン",
                type: "select",
                filterKey: "season",
                filterable: true,
                value: [seasonId],
                valueLabel: [seasonId],
                operator: "equals",
              },
            ],
          };
        }),
      };

      return first;
    },
  },
  {
    stepLabel: "チームを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team", "order", "note"]),
    many: true,
    fieldCopy: {
      label: "過去データ参照",
      optionKey: "team-competition-season",
      onSelect: async (row: Option) => {
        return {
          formData: {
            key: row.key,
            team: row.team.id,
          },
          formLabel: {
            key: `${row.team.label}`,
            team: row.team.label,
          },
        };
      },
      duplicateCheck: (
        existing: TeamCompetitionSeasonForm,
        incoming: TeamCompetitionSeasonForm,
      ) => existing.team === incoming.team,
      getDisplayData: (formDatas) => {
        return {
          "team-competition-season": formDatas.map((d) => d.key || d.team),
        };
      },
    },
  },
  createConfirmationStep<BaseModel>(baseModel),
];
