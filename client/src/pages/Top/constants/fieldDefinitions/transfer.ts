import { ModelType } from "../../../../types/models";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";

export const transfer = convertFieldDefinition({
  getFieldsKey: ModelType.TRANSFER,
  keys: ["doa", "from_team", "to_team", "player"],
});
