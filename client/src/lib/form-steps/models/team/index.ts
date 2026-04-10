import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./single";

export const team: FormStepsConfig<ModelType.TEAM> = {
  [InputMode.SINGLE]: {
    [From.NORMAL]: {
      label: "単一データ",
      steps: single,
    },
  },
};
