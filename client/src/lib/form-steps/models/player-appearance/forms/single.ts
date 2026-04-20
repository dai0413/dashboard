import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { createConfirmationStep } from "../../../confirmationStep";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { playerInMatch } from "../../../utils/createQuickFilterItems/player/playerInMatch";
import { getFields } from "../fields";
import { validatePlayerEitherOne } from "../validations/name";

type BaseModel = ModelType.PLAYER_APPEARANCE;
const baseModel = ModelType.PLAYER_APPEARANCE;

export const single: FormStep<ModelType.PLAYER_APPEARANCE>[] = [
  {
    stepLabel: "試合選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match"]),
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
  },
  {
    stepLabel: "チーム選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
    createQuickFilterItems: (args) => playerInMatch(args.data, args.api),
  },
  {
    stepLabel: "選手選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["player", "player_name"]),
    validate: validatePlayerEitherOne,
  },
  {
    stepLabel: "背番号・ステータス・ポジション・プレイ時間を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["number", "play_status", "position", "time"]),
  },
  createConfirmationStep<BaseModel>(baseModel),
];
