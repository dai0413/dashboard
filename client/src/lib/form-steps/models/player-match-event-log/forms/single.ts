import { API_PATHS } from "@dai0413/myorg-shared";
import { FormStep, FormUpdatePair, StepType } from "../../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { readItemBase } from "../../../../api";
import { MatchFormatGet } from "../../../../../types/models/match-format";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { playerInMatch } from "../../../utils/createQuickFilterItems/player/playerInMatch";
import { createConfirmationStep } from "../../../confirmationStep";
import { getFields } from "../fields";
import { validatePlayerRequiredForEvent } from "../validations/player";
import { validateExclusiveSpecialTime } from "../validations/special_time";

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
    onChange: async (
      data: FormTypeMap[ModelType.PLAYER_MATCH_EVENT_LOG],
      api,
    ) => {
      let obj: FormUpdatePair = [];

      const time = data.time;
      const add_time = data.add_time;
      if (time == null) return [];

      const time_name = add_time ? `${time}+${add_time}` : `${time}`;
      obj.push({ key: "time_name", value: time_name });

      const resData = await readItemBase({
        apiInstance: api,
        backendRoute: API_PATHS.MATCH.DETAIL(data.match),
        returnResponse: true,
      });

      if (!resData) {
        console.error("試合が見つかりません");
        return [];
      }

      if (!resData.data.match_format) {
        console.error("試合フォーマットが見つかりません");
        return [];
      }

      const match_format: MatchFormatGet = resData.data.match_format;

      const periods = match_format?.period;

      const period_label = periods?.find((p) => {
        if (p.start == null || p.end == null) return false;
        return Number(p.start) < time && time <= Number(p.end);
      })?.period_label;

      if (period_label) {
        obj.push({ key: "period_label", value: period_label });
      }

      return obj;
    },
    validate: validateExclusiveSpecialTime,
  },
  createConfirmationStep<BaseModel>(baseModel),
];
