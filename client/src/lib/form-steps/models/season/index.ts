import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { bulk } from "./forms/bulk";
import { single } from "./forms/single";

export const season: FormStepsConfig<ModelType.SEASON> = {
  [InputMode.SINGLE]: {
    [From.NORMAL]: {
      label: "単一データ",
      steps: single,
    },
  },
  [InputMode.MANY]: {
    [From.NORMAL]: {
      label: "多数データ",
      steps: bulk,
    },
  },
};
