import { ModelType } from "../../../../types/models";
import { getFields, setDisplayOnTable } from "../../../../lib/model-fields";

export const competition = setDisplayOnTable(getFields(ModelType.SEASON), [
  "competition",
  "name",
  "start_date",
  "end_date",
]);
