import { d_mlStep } from "../../../lib/form-steps/d_ml/d_mlStep";
import { j_mStep } from "../../../lib/form-steps/j_m/j_mStep";
import { sn_mStep } from "../../../lib/form-steps/sn_m/sn_mStep";
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
      steps: j_mStep.steps,
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.J_M,
    },
  },
  {
    model:
      "Match, PlayerAppearance, PlayerMatchEventLog, StaffAppearance, StaffMatchEventLog, RefereeAppearance",
    desc: "D_ML - Match更新  他モデル新規",
    icon: "match",
    startFormArgs: {
      steps: d_mlStep(true).steps,
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_ML,
      updateAndCreate: true,
    },
  },
  {
    model:
      "Match, PlayerAppearance, PlayerMatchEventLog, StaffAppearance, StaffMatchEventLog, RefereeAppearance",
    desc: "D_ML - 全モデル新規",
    icon: "match",
    startFormArgs: {
      steps: d_mlStep(false).steps,
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_ML,
      updateAndCreate: false,
    },
  },
  {
    model:
      "Match, PlayerAppearance, PlayerMatchEventLog, StaffAppearance, StaffMatchEventLog, RefereeAppearance, TeamMatchFormation",
    desc: "SN_M - Match更新  他モデル新規",
    icon: "match",
    startFormArgs: {
      steps: sn_mStep(true).steps,
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.SN_M,
      updateAndCreate: true,
    },
  },
  {
    model:
      "Match, PlayerAppearance, PlayerMatchEventLog, StaffAppearance, StaffMatchEventLog, RefereeAppearance, TeamMatchFormation",
    desc: "SN_M - 全モデル新規",
    icon: "match",
    startFormArgs: {
      steps: sn_mStep(false).steps,
      modelType: ModelType.MATCH,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.SN_M,
      updateAndCreate: false,
    },
  },
];
