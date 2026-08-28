import { API_PATHS, FilterableFieldDefinition } from "@dai0413/myorg-shared";
import {
  FormStep,
  QuickFilterItemsByKey,
  StepType,
} from "../../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { readItemsBase } from "../../../../api";
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
import { combineOnChanges } from "../../../utils/onChange/combine";
import { updateTimeName } from "../../../utils/onChange/updateTimeName";
import { updatePeriodLabelFromMatch } from "../../../utils/onChange/updatePeriodLabelFromMatch";

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
    prepareNext: combineOnChanges(updateTimeName, updatePeriodLabelFromMatch),
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
  ): Promise<FilterableFieldDefinition[] | undefined> => {
    const obj = await readItemsBase<MatchEventType[]>({
      apiInstance: api,
      params: { getAll: true, event_type: "card" },
      backendRoute: API_PATHS.MATCH_EVENT_TYPE.ROOT,
    });

    if (!obj) return;
    const matchEventTypes = convert(ModelType.MATCH_EVENT_TYPE, obj.data);

    const filterCondition: FilterableFieldDefinition[] = [
      {
        key: "_id",
        label: "カード",
        operator: "equals",
        type: "select",
        value: matchEventTypes.map((t) => t._id),
        valueLabel: matchEventTypes.map((t) =>
          createLabel(ModelType.MATCH_EVENT_TYPE, t),
        ),
      },
    ];

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
