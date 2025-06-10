import {
  FormTypeMap,
  ModelType,
  GettedModelDataMap,
} from "../../../types/models";
import { injury } from "./injury";
import { player } from "./player";
import { transfer } from "./transfer";

type Converter<T extends ModelType> = {
  single: (data: GettedModelDataMap[T]) => FormTypeMap[T];
  multiple: (data: GettedModelDataMap[T][]) => FormTypeMap[T][];
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
