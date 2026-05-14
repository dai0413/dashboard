import { Base } from "../../../types/form/option";
import { ModelDataOption } from "./optionTable";
import { CardIdOption } from "../custom/cardId";

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
  [OptionType.OPERATOR]: Base;
  [OptionType.GENRE]: Base;
  [OptionType.FORM]: Base;
  [OptionType.POSITION]: Base;
  [OptionType.AREA]: Base;
  [OptionType.DISTRICT]: Base;
  [OptionType.CONFEDERATION]: Base;
  [OptionType.SUB_CONFEDERATION]: Base;
  [OptionType.AGE_GROUP]: Base;
  [OptionType.LEFT_REASON]: Base;
  [OptionType.POSITION_GROUP]: Base;
  [OptionType.STATUS]: Base;
  [OptionType.COMPETITION_TYPE]: Base;
  [OptionType.CATEGORY]: Base;
  [OptionType.LEVEL]: Base;
  [OptionType.CURRENT]: Base;
  [OptionType.IS_INJURED]: Base;
  [OptionType.STAGE_TYPE]: Base;
  [OptionType.DIVISION]: Base;
  [OptionType.PERIOD_LABEL]: Base;
  [OptionType.RESULT]: Base;
  [OptionType.REGISTRATION_TYPE]: Base;
  [OptionType.EVENT_TYPE]: Base;
  [OptionType.POSITION_FORMATION]: Base;
  [OptionType.SPECIAL_TIME]: Base;
  [OptionType.PLAY_STATUS]: Base;
  [CustomOptionType.CARD_IDS]: CardIdOption;
};

export type OptionsMap = {
  // preset
  [K in keyof DefaultOptionMap]: DefaultOptionMap[K];
} & {
  // model
  // [K in ModelType]: Base;
} & {
  [K in keyof ModelDataOption]: ModelDataOption[K];
};
