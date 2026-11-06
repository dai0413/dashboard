import { ModelType } from "../../../../types/models";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";

export const competition = convertFieldDefinition({
  getFieldsKey: ModelType.SEASON,
  keys: ["competition", "name", "start_date", "end_date"],
});
