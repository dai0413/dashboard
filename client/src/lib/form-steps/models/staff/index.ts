import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./single";
import { bulk } from "./bulk";
import { d_sc } from "./d_sc";

export const staff: FormStepsConfig = {
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
    [From.D_SC]: {
      label: "D_SCから複数データ",
      steps: d_sc,
    },
  },
};
