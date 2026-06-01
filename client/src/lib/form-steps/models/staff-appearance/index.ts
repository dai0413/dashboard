import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./forms/single";
import { staffAppearance as d_ml } from "./forms/d_ml";

export const staffAppearance: FormStepsConfig<ModelType.STAFF_APPEARANCE> = {
  [InputMode.SINGLE]: {
    [From.NORMAL]: {
      label: "単一データ",
      steps: single,
    },
  },
  [InputMode.MANY]: {
    [From.D_ML]: {
      label: "D_ML",
      steps: d_ml,
    },
  },
};
