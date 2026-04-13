import { ModelType } from "../../../types/models";
import { FormMode, From, InputMode } from "../../../types/types";
import { Items } from "../types";

export const matchRelatedItems: Items[] = [
  {
    model: "Match",
    desc: "J_M",
    icon: "match",
    startFormArgs: {
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.J_M,
    },
  },
];
