import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./forms/single";
import { staffMatchEventLog as d_ml } from "./forms/d_ml";

export const staffMatchEventLog: FormStepsConfig<ModelType.STAFF_MATCH_EVENT_LOG> =
  {
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
