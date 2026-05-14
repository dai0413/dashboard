import { OptionObj } from "../../../types/form/option";
import { ModelDataOption, ModelOptionKey } from "../types/model";
import { GettedModelDataMap, ModelType } from "../../../types/models";
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
} from "../model";

type Converter<T extends ModelOptionKey> = (
  data: GettedModelDataMap[T][],
) => OptionObj<ModelDataOption[T]>;

const convertMap: Partial<{
  [K in ModelOptionKey]: Converter<K>;
}> = {
  [ModelType.COUNTRY]: (data) => country(data),
  [ModelType.MATCH]: (data) => match(data),
  [ModelType.MATCH_FORMAT]: (data) => matchFormat(data),
  [ModelType.MATCH_EVENT_TYPE]: (data) => matchEventType(data),
  [ModelType.NATIONAL_MATCH_SERIES]: (data) => nationalMatchSeries(data),
  [ModelType.PLAYER]: (data) => player(data),
  [ModelType.SEASON]: (data) => season(data),
  [ModelType.STADIUM]: (data) => stadium(data),
  [ModelType.STAFF]: (data) => staff(data),
  [ModelType.TEAM]: (data) => team(data),
  [ModelType.COMPETITION_STAGE]: (data) => competitionStage(data),
  [ModelType.COMPETITION]: (data) => competition(data),
  [ModelType.FORMATION]: (data) => formation(data),
};

export function convertToOption<T extends ModelOptionKey>(
  type: T,
  data: GettedModelDataMap[T][],
): OptionObj<ModelDataOption[T]> {
  if (!(type in convertMap)) return { data: [] };

  const converter = convertMap[type];
  if (!converter) {
    console.error(`No converter found for ${String(type)}`);
    return { data: [] };
  }
  return converter(data);
}
