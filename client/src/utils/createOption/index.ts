import { OptionArray, OptionTable } from "../../types/option";
import { GettedModelDataMap, ModelType } from "../../types/models";
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
} from "./Enum";
import { operator } from "@myorg/shared";

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
}

type OptionMap = {
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
};

type GettedModelDataArrayMap = {
  [K in keyof GettedModelDataMap]: GettedModelDataMap[K][];
};

export type OptionsMap = OptionMap & GettedModelDataArrayMap;

type Converter<T extends keyof OptionsMap> = (
  data: OptionsMap[T],
  table?: boolean
) => OptionArray | OptionTable;

const convertMap: Partial<{ [K in keyof OptionsMap]: Converter<K> }> = {
  [ModelType.COUNTRY]: (data, table) => country(data, table ? table : false),
  //   [ModelType.INJURY]:,
  //   [ModelType.NATIONAL_CALLUP]: ,
  [ModelType.MATCH_FORMAT]: (data, table) =>
    matchFormat(data, table ? table : false),
  [ModelType.NATIONAL_MATCH_SERIES]: (data, table) =>
    nationalMatchSeries(data, table ? table : false),
  [ModelType.PLAYER]: (data, table) => player(data, table ? table : false),
  [ModelType.SEASON]: (data, table) => season(data, table ? table : false),
  [ModelType.STADIUM]: (data, table) => stadium(data, table ? table : false),
  [ModelType.TEAM]: (data, table) => team(data, table ? table : false),
  [ModelType.COMPETITION_STAGE]: (data, table) =>
    competitionStage(data, table ? table : false),
  [ModelType.COMPETITION]: (data, table) =>
    competition(data, table ? table : false),
  //   [ModelType.TRANSFER]: ,
  [OptionType.STATUS]: () => status(),
  [OptionType.POSITION_GROUP]: () => positionGroup(),
  [OptionType.LEFT_REASON]: () => leftReason(),
  [OptionType.AGE_GROUP]: () => ageGroup(),
  [OptionType.AREA]: () => area(),
  [OptionType.DISTRICT]: () => district(),
  [OptionType.CONFEDERATION]: () => confederation(),
  [OptionType.SUB_CONFEDERATION]: () => subConfederation(),
  [OptionType.POSITION]: () => position(),
  [OptionType.FORM]: () => form(),
  [OptionType.GENRE]: () => genre(),
  [OptionType.OPERATOR]: () => operator(),
  [OptionType.COMPETITION_TYPE]: () => competitionType(),
  [OptionType.CATEGORY]: () => category(),
  [OptionType.LEVEL]: () => level(),
  [OptionType.CURRENT]: () => [
    { key: "true", label: "最新" },
    { key: "false", label: "" },
  ],
  [OptionType.IS_INJURED]: () => [
    { key: "true", label: "負傷中" },
    { key: "false", label: "復帰済み" },
  ],
  [OptionType.STAGE_TYPE]: () => stageType(),
  [OptionType.DIVISION]: () => division(),
  [OptionType.PERIOD_LABEL]: () => periodLabel(),
  [OptionType.RESULT]: () => result(),
  [OptionType.REGISTRATION_TYPE]: () => registrationType(),
};

// 実装
export function convert<T extends keyof OptionsMap>(
  type: T,
  data: OptionsMap[T],
  table?: boolean
): OptionArray | OptionTable {
  const converter = convertMap[type];
  if (!converter) {
    // throw new Error(`No converter found for ${String(type)}`);
    return [];
  }
  return converter(data, table);
}
