import z from "zod";
import {
  PlayerMatchEventLogResponseSchema,
  PlayerMatchEventLogPopulatedSchema,
} from "@dai0413/myorg-shared";

type Response = z.infer<typeof PlayerMatchEventLogResponseSchema>;

const playerMatchEventLog = (
  playerMatchEventLog: z.infer<typeof PlayerMatchEventLogPopulatedSchema>,
): Response => {
  const { player, player_name, ...rest } = playerMatchEventLog;

  const player_obj = player
    ? player
    : player_name
      ? { name: player_name }
      : undefined;

  return {
    ...rest,
    player: player_obj,
  };
};

export { playerMatchEventLog };
