import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
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
import { AxiosInstance } from "axios";

type BaseModel = ModelType.TRANSFER;
const baseModel = ModelType.TRANSFER;

const readTransfer = async (
  label: string,
  api: AxiosInstance,
  team: string,
  from_date: string[],
): Promise<FilterableFieldDefinition[] | undefined> => {
  const res = await readItemsBase<Transfer[]>({
    apiInstance: api,
    backendRoute: API_PATHS.TRANSFER.ROOT,
    params: {
      getAll: true,
      sort: "position_group_order,number",
      to_team: team,
      from_date: from_date,
      isCancelled: "!true",
      form: "完全|期限付き|育成型期限付き|期限付き延長|育成型期限付き延長|復帰|更新",
    },
  });

  if (!res?.data) return undefined;

  const uniqueItems = Array.from(
    new Map(res.data.map((t) => [t.player._id, t])).values(),
  );

  const value = uniqueItems.map((d) => d._id);

  if (!value) return undefined;

  return [
    {
      key: "_id",
      label: label,
      type: "select",
      filterKey: "_id",
      filterable: true,
      value: value,
      valueLabel: [`${label}`],
      operator: "equals",
    },
  ];
};

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

      const previousSeasonStart = new Date(seasonStart);
      previousSeasonStart.setFullYear(previousSeasonStart.getFullYear() - 1);

      const previousSeasonEnd = new Date(seasonEnd);
      previousSeasonEnd.setFullYear(previousSeasonEnd.getFullYear() - 1);

      const thisYear = await readTransfer("今季", api, metaData.team, [
        `>=${seasonStart}`,
        `<=${seasonEnd}`,
      ]);

      const lastYear = await readTransfer("昨季", api, metaData.team, [
        `>=${previousSeasonStart}`,
        `<=${previousSeasonEnd}`,
      ]);

      const first: QuickFilterItemsByKey = {
        transfer: [
          {
            key: "this-year",
            label: "今季",
            filterCondition: thisYear,
            defaultSelect: true,
          },
          {
            key: "last-year",
            label: "昨季",
            filterCondition: lastYear,
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
      "isCancelled",
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
            position: row.position as string[],
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
