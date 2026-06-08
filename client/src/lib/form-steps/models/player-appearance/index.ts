import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { bulk } from "./forms/bulk";
import { single } from "./forms/single";
import { playerAppearance as d_ml } from "./forms/d_ml";
import { playerAppearance as j_m } from "./forms/j_m";

export const playerAppearance: FormStepsConfig<ModelType.PLAYER_APPEARANCE> = {
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
    [From.J_M]: {
      label: "J_M",
      steps: j_m,
    },
    [From.D_ML]: {
      label: "D_ML",
      steps: d_ml,
    },
  },
};
