import { Form } from "@dai0413/myorg-shared/types/j_m/player-appearance";
import { FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { PlayerAppearanceForm } from "../../../types/models/player-appearance";
import { setMatchTeam } from "../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../types/types";

const calcTime = (
  d: { start_time?: number; end_time?: number },
  play_time?: number,
): number | undefined => {
  let time: number | undefined;

  if (typeof d.start_time === "number") {
    if (typeof d.end_time === "number") {
      time = d.end_time - d.start_time;
    } else if (typeof play_time === "number") {
      time = play_time - d.start_time;
    }
  }
  return time;
};

const getPlayerAppearanceValues = (
  draftData: Form[],
  play_time?: number,
  team?: Label,
  matchId?: string,
): PlayerAppearanceForm[] => {
  const data: PlayerAppearanceForm[] = draftData.map((d) => {
    return {
      ...d,
      match: matchId,
      player: d.player ? d.player.id : undefined,
      team: team ? team?.id : undefined,
      time: calcTime(d, play_time),
    };
  });

  return data;
};

const getPlayerAppearanceLabels = (
  draftData: Form[],
  play_time?: number,
  team?: Label,
  matchLabel?: string,
): Record<string, any>[] => {
  const data: Record<string, any>[] = draftData.map((d) => {
    return {
      ...d,
      match: matchLabel,
      player: d.player ? d.player.label : undefined,
      team: team ? team?.label : undefined,
      time: calcTime(d, play_time),
    };
  });

  return data;
};

export const playerAppearance: FormStep<ModelType.PLAYER_APPEARANCE>[] = [
  {
    modelType: ModelType.PLAYER_APPEARANCE,
    stepLabel: "選手の出場歴を入力開始",
    type: StepType.FORM,
    fields: [],
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: ({ draftData, postedDraftData, metaData }) => {
      const getDataUrl = metaData.getDataUrl;
      if (!getDataUrl) return { value: [], label: [] };

      const {
        _id: matchId,
        home_team,
        away_team,
        play_time,
      } = postedDraftData[getDataUrl].match;
      const { home, away } = draftData[getDataUrl].playerAppearance;

      const value: PlayerAppearanceForm[] = [
        ...getPlayerAppearanceValues(home, play_time, home_team, matchId),
        ...getPlayerAppearanceValues(away, play_time, away_team, matchId),
      ];

      const label: Record<string, any>[] = [
        ...getPlayerAppearanceLabels(
          home,
          play_time,
          home_team,
          postedDraftData[getDataUrl].matchLabel,
        ),
        ...getPlayerAppearanceLabels(
          away,
          play_time,
          away_team,
          postedDraftData[getDataUrl].matchLabel,
        ),
      ];

      return { value, label };
    },
    many: true,
  },
  {
    modelType: ModelType.PLAYER_APPEARANCE,
    stepLabel: "背番号・ステータス・ポジション・プレイ時間を入力",
    type: StepType.FORM,
    fields: [
      {
        key: "match",
        label: "試合",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "team",
        label: "チーム",
        fieldType: "table",
        valueType: "option",
        required: true,
      },
      {
        key: "player",
        label: "選手",
        fieldType: "table",
        valueType: "option",
      },
      {
        key: "player_name",
        label: "登録外選手",
        fieldType: "input",
        valueType: "text",
      },
      {
        key: "number",
        label: "背番号",
        fieldType: "input",
        valueType: "number",
      },

      {
        key: "play_status",
        label: "ステータス",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "position",
        label: "ポジション",
        fieldType: "select",
        valueType: "option",
      },
      {
        key: "time",
        label: "プレイ時間",
        fieldType: "input",
        valueType: "number",
      },
    ],
    validate: (data) => {
      if (!data.player && !data.player_name) {
        return {
          success: false,
          message: "選手を選択・または入力してください",
        };
      }
      return {
        success: true,
      };
    },
    many: true,
  },
];
