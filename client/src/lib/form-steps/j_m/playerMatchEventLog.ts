import { FormStep, StepType } from "../../../types/form";
import { ModelType } from "../../../types/models";
import { PlayerMatchEventLogForm } from "../../../types/models/player-match-event-log";
import { setMatchTeam } from "../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../types/types";
import { MatchFormatGet } from "../../../types/models/match-format";
import { createItemBase } from "../../api";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerMatchEventLog";
import { Select } from "@dai0413/myorg-shared";
import {
  resolveToLabel,
  resolveToValue,
} from "../utils/resolver/resolveToValue";
import { AxiosInstance } from "axios";
import { DraftDataValue } from "../../../types/form/draftData";

type PeriodLabelArg = {
  time?: number;
} & Record<string, any>;

const KEYS = ["match", "player", "team", "match_event_type"] as const;

const calcPeriodLabel = (
  d: PeriodLabelArg,
  periods?: MatchFormatGet["period"],
): string | undefined => {
  const period_label = periods?.find((p) => {
    if (p.start == null || p.end == null || !d.time) return false;
    return Number(p.start) < d.time && d.time <= Number(p.end);
  })?.period_label;

  return period_label;
};

const buildResolveInput = (
  draftData: DraftDataValue["playerMatchEventLog"]["home"],
  match: Label,
  team?: Label,
  periods?: MatchFormatGet["period"],
) => {
  const data = draftData.map((d) => {
    return {
      ...d,
      match,
      team,
      period_label: calcPeriodLabel(d, periods),
    };
  });
  return data;
};

const fetchResolved = async (
  api: AxiosInstance,
  input: ResolveInput<{
    player: Select.MODEL;
    match_event_type: Select.MODEL;
  }>[],
): Promise<ResolveOutput[]> => {
  const res = await createItemBase({
    apiInstance: api,
    // backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    backendRoute: "/resolve-model-data",
    data: { playerMatchEventLog: input },
    returnResponse: true,
  });

  if (!res?.data || !Array.isArray(res.data.playerAppearance)) return [];

  return res.data.playerAppearance;
};

const resolve = async (
  api: AxiosInstance,
  data: DraftDataValue["playerMatchEventLog"]["home"],
  match: Label,
  team?: Label,
  periods?: MatchFormatGet["period"],
) => {
  const input = buildResolveInput(data, match, team, periods);
  return fetchResolved(api, input);
};

const buildValueLabel = (data: ResolveOutput[]) => ({
  value: resolveToValue(data, KEYS),
  label: resolveToLabel(data, KEYS),
});

export const playerMatchEventLog: FormStep<ModelType.PLAYER_MATCH_EVENT_LOG>[] =
  [
    {
      modelType: ModelType.PLAYER_MATCH_EVENT_LOG,
      stepLabel: "選手の出場歴を入力開始",
      type: StepType.FORM,
      fields: [],
      createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
      getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
        const getDataUrl = metaData.getDataUrl;

        if (!getDataUrl) return { value: [], label: [] };

        const {
          _id: matchId,
          home_team,
          away_team,
        } = postedDraftData[getDataUrl].match;
        const { periods } = postedDraftData[getDataUrl];

        const match = {
          id: matchId,
          label: postedDraftData[getDataUrl].matchLabel || "",
        };

        const home = await resolve(
          api,
          draftData[getDataUrl].playerMatchEventLog.home,
          match,
          home_team,
          periods,
        );

        const away = await resolve(
          api,
          draftData[getDataUrl].playerMatchEventLog.away,
          match,
          away_team,
          periods,
        );

        const homeResult = buildValueLabel(home);
        const awayResult = buildValueLabel(away);

        const value: PlayerMatchEventLogForm[] = [
          ...homeResult.value,
          ...awayResult.value,
        ];
        const label: Record<string, any>[] = [
          ...homeResult.label,
          ...awayResult.label,
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
