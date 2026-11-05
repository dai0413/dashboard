import { ModelType } from "../../../../types/models";
import { getFields, setDisplayOnTable } from "../../../../lib/model-fields";

export const injury = setDisplayOnTable(getFields(ModelType.INJURY), [
  "doa",
  "team",
  "player",
  "injured_part",
]);
