import { ModelType } from "../../../../types/models";
import { From, InputMode } from "../../../../types/types";
import { FormStepsConfig } from "../../types";
import { single } from "./single";

export const playerMatchEventLog: FormStepsConfig<ModelType.PLAYER_MATCH_EVENT_LOG> =
  {
    [InputMode.SINGLE]: {
      [From.NORMAL]: {
        label: "単一データ",
        steps: single,
      },
    },
  };
