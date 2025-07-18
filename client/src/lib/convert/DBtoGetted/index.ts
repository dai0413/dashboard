import {
  GettedModelDataMap,
  ModelType,
  ModelDataMap,
} from "../../../types/models";
import { injury } from "./injury";
import { player } from "./player";
import { transfer } from "./transfer";
import { team } from "./team";

type Converter<T extends ModelType> = {
  single: (data: ModelDataMap[T]) => GettedModelDataMap[T];
  multiple: (data: ModelDataMap[T][]) => GettedModelDataMap[T][];
};

const convertMap: {
  [K in ModelType]: Converter<K>;
} = {
  [ModelType.PLAYER]: {
    single: player,
    multiple: (data) => data.map(player),
  },
  [ModelType.TRANSFER]: {
    single: transfer,
    multiple: (data) => data.map(transfer),
  },
  [ModelType.INJURY]: {
    single: injury,
    multiple: (data) => data.map(injury),
  },
  [ModelType.TEAM]: {
    single: team,
    multiple: (data) => data.map(team),
  },
};

export function convert<T extends ModelType>(
  modelType: T,
  data: ModelDataMap[T]
): GettedModelDataMap[T];

export function convert<T extends ModelType>(
  modelType: T,
  data: ModelDataMap[T][]
): GettedModelDataMap[T][];

// 実装
export function convert<T extends ModelType>(
  modelType: T,
  data: ModelDataMap[T] | ModelDataMap[T][]
): GettedModelDataMap[T] | GettedModelDataMap[T][] {
  const converter = convertMap[modelType];
  return Array.isArray(data)
    ? converter.multiple(data as ModelDataMap[T][])
    : converter.single(data as ModelDataMap[T]);
}
