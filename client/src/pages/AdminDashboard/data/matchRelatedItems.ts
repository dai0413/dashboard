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
    desc: "D_ML",
    icon: "match",
    startFormArgs: {
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_ML,
      relatedAll: true,
    },
  },
  {
    model: "StatsL, TeamMatchFormation",
    desc: "L_M",
    icon: "match",
    startFormArgs: {
      modelType: ModelType.STATS_L,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.L_M,
      relatedAll: true,
    },
  },
];
