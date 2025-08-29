import { OptionArray, OptionTable } from "../../types/option";
import { GettedModelDataMap, ModelType } from "../../types/models";
import { team } from "./team";
import { country } from "./country";
import { nationalMatchSeries } from "./national-match-series";
import { player } from "./player";
import { status } from "./status";
import { positionGroup } from "./positionGroup";
import { leftReason } from "./leftReason";
import { ageGroup } from "./ageGroup";
import { area } from "./area";
import { district } from "./district";
import { confederation } from "./confederation";
import { subConfederation } from "./subConfederation";
import { position } from "./position";
import { form } from "./form";
import { genre } from "./genre";
import { operator } from "./operator";
import { competitionType } from "./competition_type";
import { category } from "./category";
import { level } from "./level";

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
  [ModelType.NATIONAL_MATCH_SERIES]: (data, table) =>
    nationalMatchSeries(data, table ? table : false),
  [ModelType.PLAYER]: (data, table) => player(data, table ? table : false),
  [ModelType.TEAM]: (data, table) => team(data, table ? table : false),
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
