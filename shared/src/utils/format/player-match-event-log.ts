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

  const player_obj = player ?? { name: player_name as string };

  const result: Response = rest;

  if (player) result["player"] = player_obj;

  return result;
};

export { playerMatchEventLog };
