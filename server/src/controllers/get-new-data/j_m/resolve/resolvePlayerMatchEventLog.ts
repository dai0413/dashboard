import {
  Form,
  Scraped,
} from "@dai0413/myorg-shared/types/j_m/player-match-event-log";
import { Form as PlayerAppearanceForm } from "@dai0413/myorg-shared/types/j_m/player-appearance";
import { MatchEventTypeModel } from "src/models/match-event-type.js";
import { resolve } from "./resolve.js";
import { ResolveField } from "../types.js";

const resolveFields: ResolveField<Scraped>[] = [
  {
    key: "match_event_type",
    model: MatchEventTypeModel,
  },
];

const removeFields: string[] = [];

export const resolvePlayerMatchEventLog = async (
  data: { home: Scraped[]; away: Scraped[] },
  playerAppearance: {
    home: Partial<PlayerAppearanceForm>[];
    away: Partial<PlayerAppearanceForm>[];
  },
): Promise<{ home: Partial<Form>[]; away: Partial<Form>[] }> => {
  const resolvePlayer = async (
    data: Scraped[],
    playerAppearance: Partial<PlayerAppearanceForm>[],
  ) => {
    const resolved = await resolve<Scraped, Form & { key: string }>(
      data,
      resolveFields,
      removeFields,
    );

    const resolvedPlayer = resolved.map((d) => {
      const player = playerAppearance.find(
        (pa) => d.key && typeof d.key === "string" && pa.key === d.key,
      )?.player;
      return {
        ...d,
        player: player ? player : undefined,
        player_name: player ? undefined : d.player_name,
      };
    });

    return resolvedPlayer;
  };

  const home = await resolvePlayer(data.home, playerAppearance.home);
  const away = await resolvePlayer(data.away, playerAppearance.away);

  return { home, away };
};
