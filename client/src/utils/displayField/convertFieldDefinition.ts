import { UIFieldDefinition } from "../../types/field";
import { GettedModelDataMap, ModelType } from "../../types/models";

export const convertFieldDefinition = <T extends ModelType>(
  keys: string[],
  fieldDefinition?: UIFieldDefinition<GettedModelDataMap[T]>[],
): UIFieldDefinition<GettedModelDataMap[T]>[] => {
  if (!fieldDefinition) return [];

  const orderMap = new Map(keys.map((key, index) => [key, index]));

  return fieldDefinition
    .map((f) => ({
      ...f,
      displayOnTable: orderMap.has(f.key),
    }))
    .sort((a, b) => {
      const aOrder = orderMap.get(a.key);
      const bOrder = orderMap.get(b.key);

      if (aOrder !== undefined && bOrder !== undefined) {
        return aOrder - bOrder;
      }
      if (aOrder !== undefined) return -1;
      if (bOrder !== undefined) return 1;

      return 0;
    });
};
