import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { PlayerMatchEventLogForm } from "../../../../../types/models/player-match-event-log";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../../../types/types";
import { MatchFormatGet } from "../../../../../types/models/match-format";
import { createItemBase } from "../../../../api";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerMatchEventLog";
import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { AxiosInstance } from "axios";
import { DraftDataValue } from "../../../../../types/form/draftData";
import { PlayerAppearanceGet } from "../../../../../types/models/player-appearance";
import { getFields } from "../fields";
import { combineValidations } from "../../../utils/validate/combine";
import { validatePlayerRequiredForEvent } from "../validations/player";
import { validateExclusiveSpecialTime } from "../../../utils/validate/special_time";

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
  candidatePlayers: PlayerAppearanceGet[],
  match: Label,
  team?: Label,
  periods?: MatchFormatGet["period"],
): ResolveInput<{
  match_event_type: Select.MODEL;
}>[] => {
  const data = draftData.map((d) => {
    const targetPlayer = candidatePlayers?.find(
      (pa) =>
        pa.player?.label === d.player?.name || pa.number === d.player?.number,
    )?.player;

    const player: Label | undefined = targetPlayer?.id
      ? targetPlayer
      : undefined;

    return {
      ...d,
      match,
      team,
      player,
      player_name: player ? undefined : d.player_name,
      period_label: calcPeriodLabel(d, periods),
    };
  });

  return data;
};

const fetchResolved = async (
  api: AxiosInstance,
  input: ResolveInput<{
    match_event_type: Select.MODEL;
  }>[],
): Promise<ResolveOutput[]> => {
  const res = await createItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { playerMatchEventLog: input },
    returnResponse: true,
  });

  if (!res?.data || !Array.isArray(res.data.playerMatchEventLog)) return [];

  return res.data.playerMatchEventLog;
};

const resolve = async (
  api: AxiosInstance,
  data: DraftDataValue["playerMatchEventLog"]["home"],
  candidatePlayers: PlayerAppearanceGet[],
  match: Label,
  team?: Label,
  periods?: MatchFormatGet["period"],
) => {
  const input = buildResolveInput(data, candidatePlayers, match, team, periods);
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

        const { home: homePlayers, away: awayPlayers } =
          postedDraftData[getDataUrl].playerAppearance;

        const home = await resolve(
          api,
          draftData[getDataUrl].playerMatchEventLog.home,
          homePlayers,
          match,
          home_team,
          periods,
        );

        const away = await resolve(
          api,
          draftData[getDataUrl].playerMatchEventLog.away,
          awayPlayers,
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
      fields: getFields([
        "match",
        "team",
        "match_event_type",
        "player",
        "player_name",
        "time",
        "add_time",
        "special_time",
        "order",
      ]),
      validate: combineValidations(
        validatePlayerRequiredForEvent,
        validateExclusiveSpecialTime,
      ),
      many: true,
    },
  ];
