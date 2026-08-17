import { ModelType } from "../../../types/models";
import { FormMode, From, InputMode } from "../../../types/types";
import { Item } from "../types";

export const matchRelatedItems: Item[] = [
  {
    model:
      "Match, PlayerAppearance, PlayerMatchEventLog, StaffAppearance, RefereeAppearance, TeamMatchFormation",
    desc: "J_M",
    icon: "match",
    startFormArgs: {
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.J_M,
      relatedAll: true,
    },
  },
  {
    model:
      "Match, PlayerAppearance, PlayerMatchEventLog, StaffAppearance, StaffMatchEventLog, RefereeAppearance",
    desc: "D_ML - Match更新  他モデル新規",
    icon: "match",
    startFormArgs: {
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_ML,
      relatedAll: true,
      updateAndCreate: true,
    },
  },
  {
    model:
      "Match, PlayerAppearance, PlayerMatchEventLog, StaffAppearance, StaffMatchEventLog, RefereeAppearance",
    desc: "D_ML - 全モデル新規",
    icon: "match",
    startFormArgs: {
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_ML,
      relatedAll: true,
      updateAndCreate: false,
    },
  },
];
