import { getFields, setDisplayOnTable } from "../../../../lib/model-fields";
import { ModelType } from "../../../../types/models";

export const transfer = setDisplayOnTable(getFields(ModelType.TRANSFER), [
  "doa",
  "from_team",
  "to_team",
  "player",
]);
