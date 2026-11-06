import { FieldValueMap, UIFieldDefinition } from "../../types/field";
import { ModelType } from "../../types/models";
import { getDataFields } from "../data-field";

type ConvertFieldDefinitionParams<T extends object> = {
  keys: string[];
  fieldDefinition: UIFieldDefinition<T>[];
  getFieldsKey?: never;
};

type ConvertFieldDefinitionByKeyParams<K extends ModelType> = {
  keys: string[];
  getFieldsKey: K;
  fieldDefinition?: never;
};

export function convertFieldDefinition<K extends ModelType>(
  params: ConvertFieldDefinitionByKeyParams<K>,
): UIFieldDefinition<FieldValueMap[K]>[];

export function convertFieldDefinition<T extends object>(
  params: ConvertFieldDefinitionParams<T>,
): UIFieldDefinition<T>[];

export function convertFieldDefinition(
  params:
    | ConvertFieldDefinitionByKeyParams<ModelType>
    | ConvertFieldDefinitionParams<object>,
): UIFieldDefinition<object>[] {
  const { keys } = params;

  const fieldDefinition: UIFieldDefinition<object>[] =
    params.fieldDefinition ??
    (getDataFields(params.getFieldsKey) as UIFieldDefinition<object>[]);

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
}
