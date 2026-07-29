import { UIFieldDefinition } from "../../../../../types/field";
import { GettedModelDataMap, ModelType } from "../../../../../types/models";
import { ColumnType } from "../../../../../types/table";

export const playerField: UIFieldDefinition<
  GettedModelDataMap[ModelType.TRANSFER]
> = {
  label: "選手",
  key: "player",
  filterKey: "player",
  field: "player",
  getValueType: ColumnType.FIELD,
  type: "string",
  displayOnTable: true,
};
