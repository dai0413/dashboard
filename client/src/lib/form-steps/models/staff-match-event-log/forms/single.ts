import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import {
  FormStep,
  FormUpdatePair,
  QuickFilterItemsByKey,
  StepType,
} from "../../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { readItemBase, readItemsBase } from "../../../../api";
import { MatchFormatGet } from "../../../../../types/models/match-format";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { convert } from "../../../../convert/DBtoGetted";
import { convert as createLabel } from "../../../../convert/CreateLabel";
import { AxiosInstance } from "axios";
import { QuickFilterItem } from "../../../../../types/table";
import { MatchEventType } from "../../../../../types/models/match-event-type";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { validateStaffRequiredForEvent } from "../validations/staff";
import { validateExclusiveSpecialTime } from "../../../utils/validate/special_time";

type BaseModel = ModelType.STAFF_MATCH_EVENT_LOG;
const baseModel = ModelType.STAFF_MATCH_EVENT_LOG;

export const single: FormStep<ModelType.STAFF_MATCH_EVENT_LOG>[] = [
  {
    stepLabel: "試合選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match"]),
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    createQuickFilterItems: async (args) =>
      readMatchEventType(args.data, args.api),
  },
  {
    stepLabel: "イベントタイプ選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match_event_type"]),
  },
  {
    stepLabel: "チーム選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
  },
  {
    stepLabel: "スタッフ選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["staff", "staff_name"]),
    validate: validateStaffRequiredForEvent,
  },
  {
    stepLabel: "時間を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["time", "add_time", "special_time"]),
    validate: validateExclusiveSpecialTime,
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
  createConfirmationStep<BaseModel>(baseModel),
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
