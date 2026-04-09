import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import {
  FormStep,
  FormUpdatePair,
  QuickFilterItemsByKey,
  StepType,
} from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readItemBase, readItemsBase } from "../../../api";
import { MatchFormatGet } from "../../../../types/models/match-format";
import { setMatchTeam } from "../../utils/createFilterConditions/setMatchTeam";
import { convert } from "../../../convert/DBtoGetted";
import { convert as createLabel } from "../../../convert/CreateLabel";
import { AxiosInstance } from "axios";
import { QuickFilterItem } from "../../../../types/table";
import { MatchEventType } from "../../../../types/models/match-event-type";

export const single: FormStep<ModelType.STAFF_MATCH_EVENT_LOG>[] = [
  {
    stepLabel: "試合選択",
    type: StepType.FORM,
    modelType: ModelType.STAFF_MATCH_EVENT_LOG,
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    createQuickFilterItems: async (args) =>
      readMatchEventType(args.data, args.api),
  },
  {
    stepLabel: "イベントタイプ選択",
    type: StepType.FORM,
    modelType: ModelType.STAFF_MATCH_EVENT_LOG,
    fields: [
      {
        key: "match_event_type",
        label: "イベントタイプ",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "チーム選択",
    type: StepType.FORM,
    modelType: ModelType.STAFF_MATCH_EVENT_LOG,
    fields: [
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
    ],
  },
  {
    stepLabel: "スタッフ選択",
    type: StepType.FORM,
    modelType: ModelType.STAFF_MATCH_EVENT_LOG,
    fields: [
      {
        key: "staff",
        label: "スタッフ",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "staff_name",
        label: "登録外スタッフ",
        fieldType: "input",
        valueType: "text",
      },
    ],
    validate: (data) => {
      if (
        data.match_event_type !== "オウンゴール" &&
        !data.staff &&
        !data.staff_name
      ) {
        return {
          success: false,
          message: "スタッフを選択・または入力してください",
        };
      }
      return {
        success: true,
      };
    },
  },
  {
    stepLabel: "時間を入力",
    type: StepType.FORM,
    modelType: ModelType.STAFF_MATCH_EVENT_LOG,
    fields: [
      {
        key: "time",
        label: "試合全体のうちの時間(後半 20 分は 65 と入力)",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "add_time",
        label: "追加タイム",
        fieldType: "input",
        valueType: "number",
      },
      {
        key: "special_time",
        label: "特別時間",
        fieldType: "select",
        valueType: "option",
      },
    ],
    onChange: async (
      data: FormTypeMap[ModelType.STAFF_MATCH_EVENT_LOG],
      api,
    ) => {
      let obj: FormUpdatePair = [];

      const time = data.time;
      const add_time = data.add_time;
      if (time == null) return [];

      const time_name = add_time ? `${time}+${add_time}` : `${time}`;
      obj.push({ key: "time_name", value: time_name });

      const resData = await readItemBase({
        apiInstance: api,
        backendRoute: API_PATHS.MATCH.DETAIL(data.match),
        returnResponse: true,
      });

      if (!resData) {
        console.error("試合が見つかりません");
        return [];
      }

      if (!resData.data.match_format) {
        console.error("試合フォーマットが見つかりません");
        return [];
      }

      const match_format: MatchFormatGet = resData.data.match_format;

      const periods = match_format?.period;

      const period_label = periods?.find((p) => {
        if (p.start == null || p.end == null) return false;
        return Number(p.start) < time && time <= Number(p.end);
      })?.period_label;

      if (period_label) {
        obj.push({ key: "period_label", value: period_label });
      }

      return obj;
    },
  },
];

const readMatchEventType = async (
  data?: FormTypeMap[ModelType.STAFF_MATCH_EVENT_LOG],
  api?: AxiosInstance | undefined,
): Promise<QuickFilterItemsByKey | null> => {
  if (!api || !data) return null;
  const read = async (
    api: AxiosInstance,
  ): Promise<FilterableFieldDefinition | undefined> => {
    const resBody = await readItemsBase({
      apiInstance: api,
      params: { getAll: true, event_type: "card" },
      backendRoute: API_PATHS.MATCH_EVENT_TYPE.ROOT,
      returnResponse: true,
    });

    if (!resBody) return;
    const data: MatchEventType[] = resBody.data;
    const matchEventTypes = convert(ModelType.MATCH_EVENT_TYPE, data);

    const filterCondition: FilterableFieldDefinition = {
      key: "_id",
      label: "カード",
      operator: "equals",
      type: "select",
      value: matchEventTypes.map((t) => t._id),
      valueLabel: matchEventTypes.map((t) =>
        createLabel(ModelType.MATCH_EVENT_TYPE, t),
      ),
    };

    return filterCondition;
  };

  const matchEventTypes = await read(api);
  const quickFilterItem: QuickFilterItem = {
    key: "card",
    label: "カード",
    filterCondition: matchEventTypes,
    defaultSelect: true,
  };

  const matchEventObj: QuickFilterItemsByKey | null = quickFilterItem
    ? {
        "match-event-type": [quickFilterItem],
      }
    : null;

  return matchEventObj;
};
