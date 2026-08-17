import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./forms/single";
import { match as j_m } from "./forms/j_m";
import { d_mlStep } from "../../d_ml/d_mlStep";

const d_mlSteps = d_mlStep<ModelType.MATCH>(true);

export const match: FormStepsConfig<ModelType.MATCH> = {
  [InputMode.SINGLE]: {
    [From.NORMAL]: {
      label: "単一データ",
      steps: single,
    },
  },
  [InputMode.MANY]: {
    [From.J_M]: {
      label: "J_M",
      steps: j_m,
    },
    [From.D_ML]: {
      label: d_mlSteps.label,
      steps: d_mlSteps.steps,
    },
  },
};
