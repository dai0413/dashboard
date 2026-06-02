import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerMatchEventLog";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/player-match-event-log";
import { FormStep, StepType } from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { PlayerMatchEventLogForm } from "../../../../../types/models/player-match-event-log";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../../../types/types";
import { MatchFormatGet } from "../../../../../types/models/match-format";
import { createItemBase } from "../../../../api";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { AxiosInstance } from "axios";
import { PlayerAppearanceGet } from "../../../../../types/models/player-appearance";
import { bulkBase } from "../fields";
import { calcPeriodLabel } from "../../../utils/onChange/calcPeriodLabel";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { readDraftData } from "../../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../../utils/getDraftData/readPostedDraftData";

const KEYS = ["match", "player", "team", "match_event_type"] as const;

const buildResolveInput = (
  draftData: Scraped[],
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
  const res = await createItemBase<{ playerMatchEventLog: ResolveOutput[] }>({
    apiInstance: api,
    backendRoute: API_PATHS.RESOLVE.MODEL_DATA,
    data: { playerMatchEventLog: input },
    returnResponse: true,
  });

  if (!res.success) return [];

  return res.data.playerMatchEventLog;
};

const resolve = async (
  api: AxiosInstance,
  data: Scraped[],
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

type BaseModel = ModelType.PLAYER_MATCH_EVENT_LOG;
const baseModel = ModelType.PLAYER_MATCH_EVENT_LOG;
const matchSelectSteps = getPreMatchSelect<BaseModel>(baseModel, "id");

export const multiModel: FormStep<BaseModel>[] = [
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];

export const playerMatchEventLog: FormStep<BaseModel>[] = [
  ...matchSelectSteps,
  {
    modelType: baseModel,
    stepLabel: "D_M, PLAYER_MATCH_EVENT_LOGモデルデータを取得します",
    type: StepType.FORM,
    many: true,
    createFilterConditions: async (args) => setMatchTeam(args.data, args.api),
    getDraftData: async ({ api, draftData, postedDraftData, metaData }) => {
      if (!api) return { value: [], label: [] };

      const ids: string[] = metaData?.match;

      const updatedDraftData = await readDraftData({
        api,
        draftData,
        matchIds: ids,
        keys: ["match", "playerMatchEventLog"],
      });

      const updatedPostedDraftData = await readPostedDraftData({
        api,
        postedDraftData,
        matchIds: ids,
        keys: ["match", "playerAppearance"],
      });

      const results = await Promise.all(
        ids.map(async (id) => {
          const newDraftData = updatedDraftData[id];

          if (!newDraftData.playerMatchEventLog)
            return { value: [], label: [] };

          const {
            home: homePlayerMatchEventLog,
            away: awayPlayerMatchEventLog,
          } = newDraftData.playerMatchEventLog;

          const posted = updatedPostedDraftData[id];

          if (!posted.match) return { value: [], label: [] };

          const { _id: matchId, home_team, away_team } = posted.match;

          const match = {
            id: matchId,
            label: posted.matchLabel || "",
          };

          const periods = posted.periods;

          const home = await resolve(
            api,
            homePlayerMatchEventLog,
            posted.playerAppearance?.home || [],
            match,
            home_team,
            periods,
          );

          const away = await resolve(
            api,
            awayPlayerMatchEventLog,
            posted.playerAppearance?.away || [],
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

          return {
            value,
            label,
          };
        }),
      );

      return {
        value: results.flatMap((r) => r.value),
        label: results.flatMap((r) => r.label),
      };
    },
  },
  bulkBase,
  createConfirmationStep<BaseModel>(baseModel),
];
