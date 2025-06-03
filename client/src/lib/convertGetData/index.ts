import { ConvertedDataMap, ModelType, RawDataMap } from "../../types/models";
import { transformInjury } from "./injury";
import { transformPlayer } from "./player";
import { transformTransfer } from "./transfer";

type Converter<T extends ModelType> = {
  single: (data: RawDataMap[T]) => ConvertedDataMap[T];
  multiple: (data: RawDataMap[T][]) => ConvertedDataMap[T][];
};

const convertMap: {
  [K in ModelType]: Converter<K>;
} = {
  [ModelType.PLAYER]: {
    single: transformPlayer,
    multiple: (data) => data.map(transformPlayer),
  },
  [ModelType.TRANSFER]: {
    single: transformTransfer,
    multiple: (data) => data.map(transformTransfer),
  },
  [ModelType.INJURY]: {
    single: transformInjury,
    multiple: (data) => data.map(transformInjury),
  },
};

export function convert<T extends ModelType>(
  modelType: T,
  data: RawDataMap[T]
): ConvertedDataMap[T];

export function convert<T extends ModelType>(
  modelType: T,
  data: RawDataMap[T][]
): ConvertedDataMap[T][];

// 実装
export function convert<T extends ModelType>(
  modelType: T,
  data: RawDataMap[T] | RawDataMap[T][]
): ConvertedDataMap[T] | ConvertedDataMap[T][] {
  const converter = convertMap[modelType];
  return Array.isArray(data)
    ? converter.multiple(data as RawDataMap[T][])
    : converter.single(data as RawDataMap[T]);
}
