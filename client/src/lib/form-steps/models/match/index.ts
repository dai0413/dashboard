import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { getJ_Msteps } from "../../core/getJ_Msteps";
import { FormStepsConfig } from "../../types";
import { single } from "./forms/single";

export const match: FormStepsConfig<ModelType.MATCH> = {
  [InputMode.SINGLE]: {
    [From.NORMAL]: {
      label: "単一データ",
      steps: single,
    },
  },
  [InputMode.MANY]: {
    [From.J_M]: {
      label: "J_データ",
      steps: getJ_Msteps(ModelType.MATCH, true),
    },
  },
};
