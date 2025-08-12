import {
  FormTypeMap,
  ModelType,
  GettedModelDataMap,
} from "../../../types/models";
import { injury } from "./injury";
import { player } from "./player";
import { transfer } from "./transfer";
import { team } from "./team";
import { country } from "./country";
import { nationalMatchSeries } from "./national-match-series";
import { nationalCallup } from "./national-callup";

type Converter<T extends ModelType> = {
  single: (data: GettedModelDataMap[T]) => FormTypeMap[T];
  multiple: (data: GettedModelDataMap[T][]) => FormTypeMap[T][];
};

const convertMap: {
  [K in ModelType]: Converter<K>;
} = {
  [ModelType.COUNTRY]: {
    single: country,
    multiple: (data) => data.map(country),
  },
  [ModelType.INJURY]: {
    single: injury,
    multiple: (data) => data.map(injury),
  },
  [ModelType.NATIONAL_CALLUP]: {
    single: nationalCallup,
    multiple: (data) => data.map(nationalCallup),
  },
  [ModelType.NATIONAL_MATCH_SERIES]: {
    single: nationalMatchSeries,
    multiple: (data) => data.map(nationalMatchSeries),
  },
  [ModelType.PLAYER]: {
    single: player,
    multiple: (data) => data.map(player),
  },
  [ModelType.TEAM]: {
    single: team,
    multiple: (data) => data.map(team),
  },
  [ModelType.TRANSFER]: {
    single: transfer,
    multiple: (data) => data.map(transfer),
  },
};

export function convertGettedToForm<T extends ModelType>(
  modelType: T,
  data: GettedModelDataMap[T]
): FormTypeMap[T];

export function convertGettedToForm<T extends ModelType>(
  modelType: T,
  data: GettedModelDataMap[T][]
): FormTypeMap[T][];

// 実装
export function convertGettedToForm<T extends ModelType>(
  modelType: T,
  data: GettedModelDataMap[T] | GettedModelDataMap[T][]
): FormTypeMap[T] | FormTypeMap[T][] {
  const converter = convertMap[modelType];
  return Array.isArray(data)
    ? converter.multiple(data as GettedModelDataMap[T][])
    : converter.single(data as GettedModelDataMap[T]);
}
