import { From, InputMode } from "../../../../types/types";
import { single } from "./single";
import { bulk } from "./bulk";
import { d_pc } from "./d_pc";
import { FormStepsConfig } from "../../types";

export const player: FormStepsConfig = {
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
