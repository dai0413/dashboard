import { API_PATHS } from "@dai0413/myorg-shared";
import {
  FormStep,
  DataSource,
  StepType,
  QuickFilterItemsByKey,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { Transfer, TransferForm } from "../../../../../types/models/transfer";
import { Transfer as TransferOption } from "../../../../../utils/createOption/types/model/transfer";
import { readItemsBase } from "../../../../api";
import { createConfirmationStep } from "../../../confirmationStep";
import { toManyOnChange } from "../../../utils/onChange/toManyOnChange";
import { getFields } from "../fields";
import { setTeam } from "../onChange/setTeam";
import { teamCheck } from "../validate/teamCheck";
import { getSeasonDates } from "../../../../../utils/date/getSeasonDates";
import { convert } from "../../../../convert/CreateLabel";
import { JOIN_TRANSFER_TYPES } from "../../../../../constants/transfer";

type BaseModel = ModelType.TRANSFER;
const baseModel = ModelType.TRANSFER;

export const bulk: FormStep<ModelType.TRANSFER>[] = [
  {
    stepLabel: "共通要素を入力",
    type: StepType.FORM,
    modelType: baseModel,
    dataSource: DataSource.BULK_COMMON,
    fields: getFields(["doa", "from_date", "form", "URL"], {
      from_date: { required: false },
    }),
    createQuickFilterItems: async ({ metaData, api }) => {
      if (!api || !metaData || !metaData.team) return {};

      const { seasonStart, seasonEnd } = getSeasonDates();

      const res = await readItemsBase<Transfer[]>({
        apiInstance: api,
        backendRoute: API_PATHS.TRANSFER.ROOT,
        params: {
          to_team: metaData.team,
          form: JOIN_TRANSFER_TYPES,
          from_date: [`>=${seasonStart}`, `<=${seasonEnd}`],
          sort: "position_group_order,number",
          getAll: true,
        },
      });

      if (!res?.data) return {};

      const value = res.data.map((d) => d._id);
      const valueLabel = convert(ModelType.TRANSFER, res.data);

      const first: QuickFilterItemsByKey = {
        transfer: [
          {
            key: "player",
            label: "選手",
            filterCondition: {
              key: "_id",
              label: "選手",
              type: "select",
              filterKey: "_id",
              filterable: true,
              value: value,
              valueLabel: valueLabel,
              operator: "equals",
            },
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
    fields: getFields([
      "player",
      "from_team",
      "from_team_name",
      "to_team",
      "to_team_name",
      "doa",
      "from_date",
      "to_date",
      "form",
      "number",
      "position",
      "URL",
    ]),
    many: true,
    validate: (formData) => teamCheck(formData),
    autoFill: toManyOnChange(setTeam),
    fieldCopy: {
      label: "チーム所属",
      optionKey: "transfer",
      onSelect: async (row: TransferOption) => {
        return {
          formData: {
            key: row.key,
            player: row.player.id,
            to_team: row.to_team?.id,
            position: row.position,
          },
          formLabel: {
            key: row.player.label,
            player: row.player.label,
            to_team: row.to_team?.label,
            position: row.position,
          },
        };
      },
      duplicateCheck: (existing: TransferForm, incoming: TransferForm) =>
        existing.player === incoming.player,
      getDisplayData: (formDatas) => {
        return {
          transfer: formDatas.map((d) => d.key || d.player),
        };
      },
    },
  },
  createConfirmationStep<BaseModel>(baseModel),
];
