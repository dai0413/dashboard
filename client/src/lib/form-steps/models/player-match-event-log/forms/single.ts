import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { playerInMatch } from "../../../utils/createQuickFilterItems/player/playerInMatch";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { validatePlayerRequiredForEvent } from "../validations/player";
import { validateExclusiveSpecialTime } from "../../../utils/validate/special_time";
import { combineOnChanges } from "../../../utils/onChange/combine";
import { updateTimeName } from "../../../utils/onChange/updateTimeName";
import { updatePeriodLabelFromMatch } from "../../../utils/onChange/updatePeriodLabelFromMatch";

type BaseModel = ModelType.PLAYER_MATCH_EVENT_LOG;
const baseModel = ModelType.PLAYER_MATCH_EVENT_LOG;

export const single: FormStep<ModelType.PLAYER_MATCH_EVENT_LOG>[] = [
  {
    stepLabel: "試合選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match"]),
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
  },
  {
    stepLabel: "イベントタイプ選択",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["match_event_type"]),
  },
  {
    stepLabel:
      "チーム選択(オウンゴールについては失点した選手,　チームは得点したチームにする)",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["team"]),
    createQuickFilterItems: (args) => playerInMatch(args.data, args.api),
  },
  {
    stepLabel:
      "選手選択(オウンゴールについては失点した選手,　チームは得点したチームにする)",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["player", "player_name"]),
    validate: validatePlayerRequiredForEvent,
  },
  {
    stepLabel: "時間・PK順番を入力",
    type: StepType.FORM,
    modelType: baseModel,
    fields: getFields(["time", "add_time", "special_time", "order"]),
    prepareNext: combineOnChanges(updateTimeName, updatePeriodLabelFromMatch),
    validate: validateExclusiveSpecialTime,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
