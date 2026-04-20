import { From, InputMode } from "../../../../types/types";
import { single } from "./forms/single";
import { bulk } from "./forms/bulk";
import { d_pc } from "./forms/d_pc";
import { FormStepsConfig } from "../../types";
import { ModelType } from "../../../../types/models";

export const player: FormStepsConfig<ModelType.PLAYER> = {
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
    [From.D_PC]: {
      label: "D_PCから複数データ",
      steps: d_pc,
    },
  },
};
