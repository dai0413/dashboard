import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./forms/single";
import { statsL as l_m } from "./forms/l_m";

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
      steps: l_m,
    },
  },
};
