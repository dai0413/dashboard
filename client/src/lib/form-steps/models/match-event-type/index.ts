import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./single";
import { bulk } from "./bulk";
import { ModelType } from "../../../../types/models";

export const matchEventType: FormStepsConfig<ModelType.MATCH_EVENT_TYPE> = {
  [InputMode.SINGLE]: {
    [From.NORMAL]: {
      label: "単一データ",
      steps: single,
    },
  },

  [InputMode.MANY]: {
    [From.NORMAL]: {
      label: "複数データ",
      steps: bulk,
    },
  },
};
