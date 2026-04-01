import {
  Label,
  PlayerMatchEventLogPopulatedSchema,
  PlayerMatchEventLogPopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";
import { MatchEventTypeModel } from "src/models/match-event-type.js";
import { resolve } from "../utils/resolve.js";
import { ResolveField } from "../types.js";

type CandidatePlayers = {
  key: string;
} & Record<string, any>;

type ResolveInput = Omit<
  Partial<z.infer<typeof PlayerMatchEventLogPopulatedSchema>>,
  "team" | "match"
> & {
  match: Label;
  team?: Label;
  candidatePlayers?: CandidatePlayers[];
  key?: string;
};
type ResolveOutput = Partial<
  z.infer<typeof PlayerMatchEventLogPopulateLabelSchema>
>;

const resolveFields: ResolveField<ResolveInput>[] = [
  {
    key: "match_event_type",
    model: MatchEventTypeModel,
  },
];

const removeFields: string[] = [];

export const playerMatchEventLog = async (
  data: ResolveInput[],
): Promise<ResolveOutput[]> => {
  const resolvePlayer = async (data: ResolveInput[]) => {
    const resolvedPlayers = data.map((d) => {
      const player = d.candidatePlayers?.find(
        (pa) => d.key && typeof d.key === "string" && pa.key === d.key,
      )?.player;
      return {
        ...d,
        player: player ? player : undefined,
        player_name: player ? undefined : d.player_name,
      };
    });

    return resolvedPlayers;
  };

  const resolvedPlayer = await resolvePlayer(data);
  const resolvedMatchEventType = await resolve<
    ResolveInput,
    ResolveOutput & { key: string }
  >(resolvedPlayer, resolveFields, removeFields);

  return resolvedMatchEventType;
};
