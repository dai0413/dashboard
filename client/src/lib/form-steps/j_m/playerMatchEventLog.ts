import { Form } from "@dai0413/myorg-shared/types/j_m/player-match-event-log";
import { FormStep, StepType } from "../../../types/form";
import { FormTypeMap, ModelType } from "../../../types/models";
import { PlayerMatchEventLogForm } from "../../../types/models/player-match-event-log";
import { setMatchTeam } from "../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../types/types";

const getPlayerMatchEventLogValues = (
  draftData: Form[],
  team?: Label,
  matchId?: string,
): PlayerMatchEventLogForm[] => {
  const data: PlayerMatchEventLogForm[] = draftData.map((d) => {
    const { key, ...rest } = d;
    return {
      ...rest,
      match: matchId,
      match_event_type: rest.match_event_type
        ? rest.match_event_type.id
        : undefined,
      player: rest.player ? rest.player.id : undefined,
      team: team ? team?.id : undefined,
    };
  });

  return data;
};

const getPlayerMatchEventLogLabels = (
  draftData: Form[],
  team?: Label,
  matchLabel?: string,
): Record<string, any>[] => {
  const data: Record<string, any>[] = draftData.map((d) => {
    const { key, ...rest } = d;
    return {
      ...rest,
      match: matchLabel,
      match_event_type: rest.match_event_type
        ? rest.match_event_type.label
        : undefined,
      player: rest.player ? rest.player.label : undefined,
      team: team ? team?.label : undefined,
    };
  });

  return data;
};

export const playerMatchEventLog: FormStep<ModelType.PLAYER_MATCH_EVENT_LOG>[] =
  [
    {
      modelType: ModelType.PLAYER_MATCH_EVENT_LOG,
      stepLabel: "選手の出場歴を入力開始",
      type: StepType.FORM,
      fields: [],
      createFilterConditions: async (
        data: FormTypeMap[ModelType.PLAYER_MATCH_EVENT_LOG],
        api,
      ) => setMatchTeam(data, api),
      getDraftData: (draftData, postedDraftData, scrapingUrl) => {
        if (!scrapingUrl) return { value: [], label: [] };

        const {
          _id: matchId,
          home_team,
          away_team,
        } = postedDraftData[scrapingUrl].match;
        const { home, away } = draftData[scrapingUrl].playerMatchEventLog;

        const value: PlayerMatchEventLogForm[] = [
          ...getPlayerMatchEventLogValues(home, home_team, matchId),
          ...getPlayerMatchEventLogValues(away, away_team, matchId),
        ];

        const label: Record<string, any>[] = [
          ...getPlayerMatchEventLogLabels(
            home,
            home_team,
            postedDraftData[scrapingUrl].matchLabel,
          ),
          ...getPlayerMatchEventLogLabels(
            away,
            away_team,
            postedDraftData[scrapingUrl].matchLabel,
          ),
        ];

        return { value, label };
      },
      many: true,
    },
    {
      modelType: ModelType.PLAYER_MATCH_EVENT_LOG,
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
          key: "match_event_type",
          label: "イベントタイプ",
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
          key: "time",
          label: "試合全体のうちの時間(後半 20 分は 65 と入力)",
          fieldType: "input",
          valueType: "number",
        },
        {
          key: "add_time",
          label: "追加タイム",
          fieldType: "input",
          valueType: "number",
        },
        {
          key: "special_time",
          label: "特別時間",
          fieldType: "select",
          valueType: "option",
        },
        {
          key: "order",
          label: "PKなど順番",
          fieldType: "input",
          valueType: "number",
        },
      ],
      validate: (data) => {
        if (
          data.match_event_type !== "オウンゴール" &&
          !data.player &&
          !data.player_name
        ) {
          return {
            success: false,
            message: "選手を選択・または入力してください",
          };
        }

        if (data.special_time) {
          if (data.time) {
            return {
              success: false,
              message:
                "特別時間(special_time)を入力する場合はtimeを入力できません",
            };
          }

          if (data.add_time) {
            return {
              success: false,
              message:
                "特別時間(special_time)を入力する場合はadd_timeを入力できません",
            };
          }
        }
        return {
          success: true,
        };
      },
      many: true,
    },
  ];
