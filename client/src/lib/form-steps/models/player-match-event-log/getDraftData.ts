import { Label, Select } from "@dai0413/myorg-shared";
import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerMatchEventLog";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/player-match-event-log";
import { DraftData, PostedDraftData } from "../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readDraftData } from "../../utils/getDraftData/readDraftData";
import { readPostedDraftData } from "../../utils/getDraftData/readPostedDraftData";
import { PlayerAppearanceGet } from "../../../../types/models/player-appearance";
import { MatchFormatGet } from "../../../../types/models/match-format";
import { calcPeriodLabel } from "../../utils/onChange/calcPeriodLabel";
import { AxiosInstance } from "axios";
import { buildValueLabel } from "../../utils/resolver/resolveToValue";
import { PlayerMatchEventLogForm } from "../../../../types/models/player-match-event-log";
import { fetchResolved } from "../../utils/resolver/fetchResolved";
import { From } from "../../../../types/types";

const KEYS = ["match", "player", "team", "match_event_type"] as const;

type Input = ResolveInput<{
  match_event_type: Select.MODEL;
}>;

const buildResolveInput = (
  draftData: Scraped[],
  candidatePlayers: PlayerAppearanceGet[],
  match: Label,
  team?: Label,
  periods?: MatchFormatGet["period"],
): Input[] => {
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

const resolve = async (
  api: AxiosInstance,
  data: Scraped[],
  candidatePlayers: PlayerAppearanceGet[],
  match: Label,
  team?: Label,
  periods?: MatchFormatGet["period"],
) => {
  const input = buildResolveInput(data, candidatePlayers, match, team, periods);
  return fetchResolved<"playerMatchEventLog", Input, ResolveOutput>(
    api,
    "playerMatchEventLog",
    input,
  );
};

type GetDraftDataParams = {
  api: AxiosInstance;
  draftData: DraftData;
  postedDraftData: PostedDraftData;
  identifiers: string[];
  from: From.D_M | From.J_M;
};

export const getDraftData = async ({
  api,
  draftData,
  postedDraftData,
  identifiers,
  from,
}: GetDraftDataParams): Promise<{
  value: FormTypeMap[ModelType.PLAYER_MATCH_EVENT_LOG][];
  label: Record<string, any>[];
} | null> => {
  const updatedDraftData = await readDraftData({
    api,
    draftData,
    identifiers,
    readDraftDataKey: ["match", "playerMatchEventLog"],
    from,
  });

  const updatedPostedDraftData = await readPostedDraftData({
    api,
    postedDraftData,
    identifiers,
    readPostedDraftDataKey: ["match", "playerAppearance"],
  });

  const results = await Promise.all(
    identifiers.map(async (identifier) => {
      const newDraftData = updatedDraftData[identifier];

      if (!newDraftData.playerMatchEventLog) return { value: [], label: [] };

      const { home: homePlayerMatchEventLog, away: awayPlayerMatchEventLog } =
        newDraftData.playerMatchEventLog;

      const posted = updatedPostedDraftData[identifier];

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

      const homeResult = buildValueLabel(home, KEYS);
      const awayResult = buildValueLabel(away, KEYS);

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
};
