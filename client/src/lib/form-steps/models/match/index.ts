import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./forms/single";
import { match as j_m } from "./forms/j_m";
import { match as d_ml } from "./forms/d_ml";

export const match: FormStepsConfig<ModelType.MATCH> = {
  [InputMode.SINGLE]: {
    [From.NORMAL]: {
      label: "単一データ",
      steps: single,
    },
  },
  [InputMode.MANY]: {
    [From.J_M]: {
      label: "J_Mデータ",
      steps: j_m,
    },
    [From.D_ML]: {
      label: "D_ML",
      steps: d_ml,
    },
  },
};
