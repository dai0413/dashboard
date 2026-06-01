import { API_PATHS, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerMatchEventLog";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/player-match-event-log";
import {
  DraftData,
  FormStep,
  PostedDraftData,
  StepType,
} from "../../../../../types/form";
import { ModelType } from "../../../../../types/models";
import { PlayerMatchEventLogForm } from "../../../../../types/models/player-match-event-log";
import { setMatchTeam } from "../../../utils/createFilterConditions/setMatchTeam";
import { Label } from "../../../../../types/types";
import { MatchFormatGet } from "../../../../../types/models/match-format";
import { createItemBase, readItemBase, readItemsBase } from "../../../../api";
import {
  resolveToLabel,
  resolveToValue,
} from "../../../utils/resolver/resolveToValue";
import { AxiosInstance } from "axios";
import {
  PlayerAppearance,
  PlayerAppearanceGet,
} from "../../../../../types/models/player-appearance";
import { bulkBase } from "../fields";
import { calcPeriodLabel } from "../../../utils/onChange/calcPeriodLabel";
import { createConfirmationStep } from "../../../confirmationStep";
import { getPreMatchSelect } from "../../../d_ml/preMatchSelectStep";
import { Match } from "../../../../../types/models/match";
import { convert } from "../../../../convert/DBtoGetted";
import { convert as createLabel } from "../../../../convert/CreateLabel";

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

      const readDraftData = async (
        matchId: string,
      ): Promise<DraftData[any]> => {
        const readMatch = async () =>
          createItemBase<DraftData[any]["match"]>({
            apiInstance: api,
            backendRoute: API_PATHS.GET_NEW_DATA.D_M.MATCH,
            data: { id: matchId },
          });

        const readPlayerMatchEventLog = async () =>
          createItemBase<DraftData[any]["playerMatchEventLog"]>({
            apiInstance: api,
            backendRoute: API_PATHS.GET_NEW_DATA.D_M.PLAYER_MATCH_EVENT_LOG,
            data: { id: matchId },
          });

        const [resMatch, resPlayerMatchEventLog] = await Promise.all([
          readMatch(),
          readPlayerMatchEventLog(),
        ]);

        if (!resMatch.success || !resPlayerMatchEventLog.success) return {};

        const results: DraftData[any] = {
          match: resMatch.data,
          playerMatchEventLog: resPlayerMatchEventLog.data,
        };

        return results;
      };

      const readPostedDraftData = async (
        matchId: string,
      ): Promise<PostedDraftData[any]> => {
        const readMatch = async () =>
          readItemBase<Match>({
            apiInstance: api,
            backendRoute: API_PATHS.MATCH.DETAIL(matchId),
          });

        const readPlayerAppearance = async () =>
          readItemsBase<PlayerAppearance[]>({
            apiInstance: api,
            backendRoute: API_PATHS.PLAYER_APPEARANCE.ROOT,
            params: { match: matchId, getAll: true },
          });

        const [resMatch, resPlayerAppearance] = await Promise.all([
          readMatch(),
          readPlayerAppearance(),
        ]);

        if (!resMatch) return {};

        const match = convert(ModelType.MATCH, resMatch);

        if (!match) return {};
        let results: PostedDraftData[any] = {
          match: convert(ModelType.MATCH, resMatch),
          matchLabel: createLabel(ModelType.MATCH, resMatch),
        };

        const homeId = match.home_team.id;
        const awayId = match.away_team.id;

        if (resPlayerAppearance?.data) {
          const players = convert(
            ModelType.PLAYER_APPEARANCE,
            resPlayerAppearance.data,
          );

          const homePlayerAppearance = players.filter(
            (d) => d.team.id === homeId,
          );
          const awayPlayerAppearance = players.filter(
            (d) => d.team.id === awayId,
          );

          results.playerAppearance = {
            home: homePlayerAppearance,
            away: awayPlayerAppearance,
          };
        }

        return results;
      };

      const results = await Promise.all(
        ids.map(async (id) => {
          const newDraftData =
            id in draftData && draftData[id].playerMatchEventLog
              ? draftData[id]
              : await readDraftData(id);

          if (!newDraftData.playerMatchEventLog)
            return { value: [], label: [] };

          const {
            home: homePlayerMatchEventLog,
            away: awayPlayerMatchEventLog,
          } = newDraftData.playerMatchEventLog;

          const posted =
            id in postedDraftData && postedDraftData[id].match
              ? postedDraftData[id]
              : await readPostedDraftData(id);

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
