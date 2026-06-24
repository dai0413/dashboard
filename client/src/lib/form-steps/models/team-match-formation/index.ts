import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./forms/single";
import { bulk } from "./forms/bulk";

export const teamMatchFormation: FormStepsConfig<ModelType.TEAM_MATCH_FORMATION> =
  {
    [InputMode.SINGLE]: {
      [From.NORMAL]: {
        label: "単一データ",
        steps: single,
      },
    },
    [InputMode.MANY]: {
      [From.NORMAL]: {
        label: "多数データ",
        steps: bulk,
      },
    },
  };
