import { OptionArray, OptionTable } from "../../../types/form/option";
import { ModelDataOptionConfigMap } from "./optionTable";

export enum OptionType {
  OPERATOR = "operator",
  GENRE = "genre",
  FORM = "form",
  POSITION = "position",
  AREA = "area",
  DISTRICT = "district",
  CONFEDERATION = "confederation",
  SUB_CONFEDERATION = "sub_confederation",
  AGE_GROUP = "age_group",
  LEFT_REASON = "left_reason",
  POSITION_GROUP = "position_group",
  STATUS = "status",
  COMPETITION_TYPE = "competition_type",
  CATEGORY = "category",
  LEVEL = "level",
  CURRENT = "current",
  IS_INJURED = "is_injured",
  STAGE_TYPE = "stage_type",
  DIVISION = "division",
  PERIOD_LABEL = "period_label",
  RESULT = "result",
  REGISTRATION_TYPE = "registration_type",
  EVENT_TYPE = "event_type",
  POSITION_FORMATION = "position_formation",
  SPECIAL_TIME = "special_time",
  PLAY_STATUS = "play_status",
}

export enum CustomOptionType {
  CARD_IDS = "card_ids",
}

export type DefaultOptionMap = {
  [OptionType.OPERATOR]: OptionArray;
  [OptionType.GENRE]: OptionArray;
  [OptionType.FORM]: OptionArray;
  [OptionType.POSITION]: OptionArray;
  [OptionType.AREA]: OptionArray;
  [OptionType.DISTRICT]: OptionArray;
  [OptionType.CONFEDERATION]: OptionArray;
  [OptionType.SUB_CONFEDERATION]: OptionArray;
  [OptionType.AGE_GROUP]: OptionArray;
  [OptionType.LEFT_REASON]: OptionArray;
  [OptionType.POSITION_GROUP]: OptionArray;
  [OptionType.STATUS]: OptionArray;
  [OptionType.COMPETITION_TYPE]: OptionArray;
  [OptionType.CATEGORY]: OptionArray;
  [OptionType.LEVEL]: OptionArray;
  [OptionType.CURRENT]: OptionArray;
  [OptionType.IS_INJURED]: OptionArray;
  [OptionType.STAGE_TYPE]: OptionArray;
  [OptionType.DIVISION]: OptionArray;
  [OptionType.PERIOD_LABEL]: OptionArray;
  [OptionType.RESULT]: OptionArray;
  [OptionType.REGISTRATION_TYPE]: OptionArray;
  [OptionType.EVENT_TYPE]: OptionArray;
  [OptionType.POSITION_FORMATION]: OptionArray;
  [OptionType.SPECIAL_TIME]: OptionArray;
  [OptionType.PLAY_STATUS]: OptionArray;
  [CustomOptionType.CARD_IDS]: OptionTable<any>;
};

export type OptionsMap = DefaultOptionMap & ModelDataOptionConfigMap;
