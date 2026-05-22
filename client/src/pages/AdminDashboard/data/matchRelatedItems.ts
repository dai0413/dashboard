import { ModelType } from "../../../types/models";
import { FormMode, From, InputMode } from "../../../types/types";
import { Item } from "../types";

export const matchRelatedItems: Item[] = [
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
  {
    model: "Match",
    desc: "D_ML",
    icon: "match",
    startFormArgs: {
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_ML,
    },
  },
  {
    model: "Match",
    desc: "L_M",
    icon: "match",
    startFormArgs: {
      modelType: ModelType.STATS_L,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.L_M,
    },
  },
];
