import { Form } from "@dai0413/myorg-shared/types/j_m/player-match-event-log";
import { FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { PlayerMatchEventLogForm } from "../../../types/models/player-match-event-log";
import { setMatchTeam } from "../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../types/types";
import { MatchFormatGet } from "../../../types/models/match-format";

const getPlayerMatchEventLogValues = (
  draftData: Form[],
  team?: Label,
  matchId?: string,
  periods?: MatchFormatGet["period"],
): PlayerMatchEventLogForm[] => {
  const data: PlayerMatchEventLogForm[] = draftData.map((d) => {
    const { key, ...rest } = d;

    const period_label = periods?.find((p) => {
      if (p.start == null || p.end == null || !d.time) return false;
      return Number(p.start) < d.time && d.time <= Number(p.end);
    })?.period_label;

    return {
      ...rest,
      match: matchId,
      match_event_type: rest.match_event_type
        ? rest.match_event_type.id
        : undefined,
      player: rest.player ? rest.player.id : undefined,
      team: team ? team?.id : undefined,
      period_label,
    };
  });

  return data;
};

const getPlayerMatchEventLogLabels = (
  draftData: Form[],
  team?: Label,
  matchLabel?: string,
  periods?: MatchFormatGet["period"],
): Record<string, any>[] => {
  const data: Record<string, any>[] = draftData.map((d) => {
    const { key, ...rest } = d;

    const period_label = periods?.find((p) => {
      if (p.start == null || p.end == null || !d.time) return false;
      return Number(p.start) < d.time && d.time <= Number(p.end);
    })?.period_label;

    return {
      ...rest,
      match: matchLabel,
      match_event_type: rest.match_event_type
        ? rest.match_event_type.label
        : undefined,
      player: rest.player ? rest.player.label : undefined,
      team: team ? team?.label : undefined,
      period_label,
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
      createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
      getDraftData: ({ draftData, postedDraftData, metaData }) => {
        const getDataUrl = metaData.getDataUrl;

        if (!getDataUrl) return { value: [], label: [] };

        const {
          _id: matchId,
          home_team,
          away_team,
        } = postedDraftData[getDataUrl].match;
        const { periods } = postedDraftData[getDataUrl];
        const { home, away } = draftData[getDataUrl].playerMatchEventLog;

        const value: PlayerMatchEventLogForm[] = [
          ...getPlayerMatchEventLogValues(home, home_team, matchId, periods),
          ...getPlayerMatchEventLogValues(away, away_team, matchId, periods),
        ];

        const label: Record<string, any>[] = [
          ...getPlayerMatchEventLogLabels(
            home,
            home_team,
            postedDraftData[getDataUrl].matchLabel,
          ),
          ...getPlayerMatchEventLogLabels(
            away,
            away_team,
            postedDraftData[getDataUrl].matchLabel,
          ),
        ];

        return { value, label };
      },
      many: true,
    },
    {
      modelType: ModelType.PLAYER_MATCH_EVENT_LOG,
      stepLabel: "詳細を入力",
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
