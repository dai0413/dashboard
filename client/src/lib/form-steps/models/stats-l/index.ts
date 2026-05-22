import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { getL_Msteps } from "../../core/getL_Msteps";
import { FormStepsConfig } from "../../types";
import { single } from "./forms/single";

export const statsL: FormStepsConfig<ModelType.STATS_L> = {
  [InputMode.SINGLE]: {
    [From.NORMAL]: {
      label: "単一データ",
      steps: single,
    },
  },
  [InputMode.MANY]: {
    [From.L_M]: {
      label: "l_mデータ",
      steps: getL_Msteps(ModelType.STATS_L, true),
    },
  },
};
