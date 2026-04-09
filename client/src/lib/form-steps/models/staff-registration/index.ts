import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";

export const staffRegistration: FormStepsConfig = {
  [InputMode.SINGLE]: {
    [From.NORMAL]: {
      label: "単一データ",
      steps: [],
    },
  },
};
