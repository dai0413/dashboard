import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./forms/single";
import { bulk } from "./forms/bulk";
import { ModelType } from "../../../../types/models";

export const transfer: FormStepsConfig<ModelType.TRANSFER> = {
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
