import { API_PATHS } from "@dai0413/myorg-shared";
import {
  DataSource,
  FormStep,
  QuickFilterItemsByKey,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { NationalCallupForm } from "../../../../../types/models/national-callup";
import { NationalCallup } from "../../../../../utils/createOption/types/model/national-callup";
import { readItemBase, readItemsBase } from "../../../../api";
import { createConfirmationStep } from "../../../confirmationStep";
import { combineOnChanges } from "../../../utils/onChange/combine";
import { toManyOnChange } from "../../../utils/onChange/toManyOnChange";
import { getFields } from "../fields";
import { updateDatesFromSeries } from "../onChanges/updateDatesFromSeries";
import { updateDatesFromStatus } from "../onChanges/updateDatesFromStatus";
import { updateTeamFromTransfer } from "../onChanges/updateTeamFromTransfer";
import { teamCheck } from "../validations/teamCheck";
import { NationalMatchSeries } from "../../../../../types/models/national-match-series";
import { convert } from "../../../../convert/CreateLabel";

type BaseModel = ModelType.NATIONAL_CALLUP;
const baseModel = ModelType.NATIONAL_CALLUP;

export const bulk: FormStep<ModelType.NATIONAL_CALLUP>[] = [
  {
    stepLabel: "代表試合シリーズを選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["series", "position_group"]),
    dataSource: DataSource.BULK_COMMON,
    onChange: updateDatesFromSeries,
    createQuickFilterItems: async ({ metaData, api }) => {
      if (!api || !metaData) return {};

      const item = await readItemBase<NationalMatchSeries>({
        apiInstance: api,
        backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.DETAIL(metaData.series),
      });

      if (!item || !item.joined_at || !item.team) return {};

      const res = await readItemsBase<NationalMatchSeries[]>({
        apiInstance: api,
        backendRoute: API_PATHS.NATIONAL_MATCH_SERIES.ROOT,
        params: {
          team: item?.team._id,
          joined_at: `<${item.joined_at}`,
          sort: "-joined_at",
          limit: 1,
        },
      });

      if (!res?.data) return {};

      const value = res.data.map((d) => d._id);
      const valueLabel = convert(ModelType.NATIONAL_MATCH_SERIES, res.data);

      const first: QuickFilterItemsByKey = {
        "national-callup": [
          {
            key: "series",
            label: "前回",
            filterCondition: [
              {
                key: "series",
                label: "前回",
                type: "select",
                filterKey: "series",
                filterable: true,
                value: value,
                valueLabel: valueLabel,
                operator: "equals",
              },
            ],
            defaultSelect: true,
          },
        ],
      };

      return first;
    },
  },
  {
    stepLabel: "選手を選択",
    type: StepType.FORM,
    modelType: baseModel,
    many: true,
    fields: getFields([
      "position_group",
      "player",
      "team",
      "team_name",
      "number",
      "is_captain",
      "is_overage",
      "is_backup",
      "is_training_partner",
      "is_additional_call",
      "joined_at",
      "left_at",
      "status",
      "left_reason",
    ]),
    fieldCopy: {
      label: "過去データ参照",
      optionKey: "national-callup",
      onSelect: async (row: NationalCallup) => {
        return {
          formData: {
            key: row.key,
            player: row.player.id,
            team: row.team.id,
            team_name: row.team_name,
            position_group: row.position_group,
          },
          formLabel: {
            key: `${row.player.label}`,
            player: row.player.label,
            team: row.team.label,
            team_name: row.team_name,
            position_group: row.position_group,
          },
        };
      },
      duplicateCheck: (
        existing: NationalCallupForm,
        incoming: NationalCallupForm,
      ) => existing.player === incoming.player,
      getDisplayData: (formDatas) => {
        return {
          "national-callup": formDatas.map((d) => d.key || d.player),
        };
      },
    },
    validate: (formData) => teamCheck(formData, "team", "team_name"),
    autoFill: toManyOnChange(
      combineOnChanges(updateTeamFromTransfer, updateDatesFromStatus),
    ),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
