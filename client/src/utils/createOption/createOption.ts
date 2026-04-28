import { OptionArray } from "../../types/form/option";
import { ModelType } from "../../types/models";
import {
  competition,
  season,
  team,
  country,
  nationalMatchSeries,
  player,
  competitionStage,
  stadium,
  matchFormat,
  match,
  staff,
  matchEventType,
  formation,
} from "./Model";
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
import { ModelDataOptionConfigMap } from "./types/optionTable";
import { CustomOptionType, DefaultOptionMap, OptionType } from "./types/base";

type Converter<T extends keyof ModelDataOptionConfigMap> = (
  data: ModelDataOptionConfigMap[T]["input"],
  table?: boolean,
) => OptionArray | ModelDataOptionConfigMap[T]["option"];

const convertMap: Partial<{
  [K in keyof ModelDataOptionConfigMap]: Converter<K>;
}> = {
  [ModelType.COUNTRY]: (data, table) => country(data, table ? table : false),
  [ModelType.MATCH]: (data, table) => match(data, table ? table : false),
  [ModelType.MATCH_FORMAT]: (data, table) =>
    matchFormat(data, table ? table : false),
  [ModelType.MATCH_EVENT_TYPE]: (data, table) =>
    matchEventType(data, table ? table : false),
  [ModelType.NATIONAL_MATCH_SERIES]: (data, table) =>
    nationalMatchSeries(data, table ? table : false),
  [ModelType.PLAYER]: (data, table) => player(data, table ? table : false),
  [ModelType.SEASON]: (data, table) => season(data, table ? table : false),
  [ModelType.STADIUM]: (data, table) => stadium(data, table ? table : false),
  [ModelType.STAFF]: (data, table) => staff(data, table ? table : false),
  [ModelType.TEAM]: (data, table) => team(data, table ? table : false),
  [ModelType.COMPETITION_STAGE]: (data, table) =>
    competitionStage(data, table ? table : false),
  [ModelType.COMPETITION]: (data, table) =>
    competition(data, table ? table : false),
  [ModelType.FORMATION]: (data, table) =>
    formation(data, table ? table : false),
};

const defaultOptions: Partial<{ [K in keyof DefaultOptionMap]: OptionArray }> =
  {
    [OptionType.STATUS]: status(),
    [OptionType.POSITION_GROUP]: positionGroup(),
    [OptionType.LEFT_REASON]: leftReason(),
    [OptionType.AGE_GROUP]: ageGroup(),
    [OptionType.AREA]: area(),
    [OptionType.DISTRICT]: district(),
    [OptionType.CONFEDERATION]: confederation(),
    [OptionType.SUB_CONFEDERATION]: subConfederation(),
    [OptionType.POSITION]: position(),
    [OptionType.FORM]: form(),
    [OptionType.GENRE]: genre(),
    [OptionType.OPERATOR]: operator(),
    [OptionType.COMPETITION_TYPE]: competitionType(),
    [OptionType.CATEGORY]: category(),
    [OptionType.LEVEL]: level(),
    [OptionType.CURRENT]: [
      { key: "true", label: "最新" },
      { key: "false", label: "" },
    ],
    [OptionType.IS_INJURED]: [
      { key: "true", label: "負傷中" },
      { key: "false", label: "復帰済み" },
    ],
    [OptionType.STAGE_TYPE]: stageType(),
    [OptionType.DIVISION]: division(),
    [OptionType.PERIOD_LABEL]: periodLabel(),
    [OptionType.RESULT]: result(),
    [OptionType.REGISTRATION_TYPE]: registrationType(),
    [OptionType.EVENT_TYPE]: event_type(),
    [OptionType.POSITION_FORMATION]: position_formation(),
    [OptionType.SPECIAL_TIME]: special_time(),
    [OptionType.PLAY_STATUS]: play_status(),
    [CustomOptionType.CARD_IDS]: [],
  };

// 実装
export function convertToOption<T extends keyof ModelDataOptionConfigMap>(
  type: T,
  data: ModelDataOptionConfigMap[T]["input"],
  table?: boolean,
): OptionArray | ModelDataOptionConfigMap[T]["option"] {
  const converter = convertMap[type];
  if (!converter) {
    console.error(`No converter found for ${String(type)}`);
    return [];
  }
  return converter(data, table);
}

export function getDefaultOptions<T extends keyof DefaultOptionMap>(
  key: T,
): OptionArray {
  const options = defaultOptions[key];

  if (!options) {
    console.error(`No options found for ${String(key)}`);
    return [];
  }
  return options;
}
