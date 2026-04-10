import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./single";

export const nationalMatchSeries: FormStepsConfig<ModelType.NATIONAL_MATCH_SERIES> =
  {
    [InputMode.SINGLE]: {
      [From.NORMAL]: {
        label: "単一データ",
        steps: single,
      },
    },
  };
