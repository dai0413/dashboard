import { ModelType } from "../../../../types/models";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";

export const injury = convertFieldDefinition({
  getFieldsKey: ModelType.INJURY,
  keys: ["doa", "team", "player", "injured_part"],
});
