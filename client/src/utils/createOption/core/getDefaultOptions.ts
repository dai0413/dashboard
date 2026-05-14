import {
  status,
  positionGroup,
  leftReason,
  ageGroup,
  area,
  district,
  confederation,
  subConfederation,
  position,
  form,
  genre,
  competitionType,
  category,
  level,
  stageType,
  division,
  periodLabel,
  result,
  registrationType,
  operator,
  event_type,
  position_formation,
  special_time,
  play_status,
} from "@dai0413/myorg-shared";
import { OptionObj } from "../../../types/form/option";
import { DefaultOptionMap, OptionType } from "../types/preset";

const defaultOptions: Partial<
  {
    [K in keyof DefaultOptionMap]: OptionObj<DefaultOptionMap[K]>;
  } & { [K in keyof DefaultOptionMap]: OptionObj<DefaultOptionMap[K]> }
> = {
  [OptionType.STATUS]: { data: status() },
  [OptionType.POSITION_GROUP]: { data: positionGroup() },
  [OptionType.LEFT_REASON]: { data: leftReason() },
  [OptionType.AGE_GROUP]: { data: ageGroup() },
  [OptionType.AREA]: { data: area() },
  [OptionType.DISTRICT]: { data: district() },
  [OptionType.CONFEDERATION]: { data: confederation() },
  [OptionType.SUB_CONFEDERATION]: { data: subConfederation() },
  [OptionType.POSITION]: { data: position() },
  [OptionType.FORM]: { data: form() },
  [OptionType.GENRE]: { data: genre() },
  [OptionType.OPERATOR]: { data: operator() },
  [OptionType.COMPETITION_TYPE]: { data: competitionType() },
  [OptionType.CATEGORY]: { data: category() },
  [OptionType.LEVEL]: { data: level() },
  [OptionType.CURRENT]: {
    data: [
      { key: "true", label: "最新" },
      { key: "false", label: "" },
    ],
  },
  [OptionType.IS_INJURED]: {
    data: [
      { key: "true", label: "負傷中" },
      { key: "false", label: "復帰済み" },
    ],
  },
  [OptionType.STAGE_TYPE]: { data: stageType() },
  [OptionType.DIVISION]: { data: division() },
  [OptionType.PERIOD_LABEL]: { data: periodLabel() },
  [OptionType.RESULT]: { data: result() },
  [OptionType.REGISTRATION_TYPE]: { data: registrationType() },
  [OptionType.EVENT_TYPE]: { data: event_type() },
  [OptionType.POSITION_FORMATION]: { data: position_formation() },
  [OptionType.SPECIAL_TIME]: { data: special_time() },
  [OptionType.PLAY_STATUS]: { data: play_status() },
};

export function getDefaultOptions<T extends OptionType>(
  key: T,
): OptionObj<DefaultOptionMap[T]> {
  const options = defaultOptions[key];

  if (!options) {
    console.error(`No options found for ${String(key)}`);
    return { data: [] };
  }

  return options;
}
