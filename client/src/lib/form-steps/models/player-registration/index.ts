import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";

export const playerRegistration: FormStepsConfig<ModelType.PLAYER_REGISTRATION> =
  {
    [InputMode.SINGLE]: {
      [From.NORMAL]: {
        label: "単一データ",
        steps: [],
      },
    },
  };
