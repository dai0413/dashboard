import z from "zod";
import {
  PlayerMatchEventLogResponseSchema,
  PlayerMatchEventLogPopulatedSchema,
} from "@dai0413/myorg-shared";

const playerMatchEventLog = (
  playerMatchEventLog: z.infer<typeof PlayerMatchEventLogPopulatedSchema>,
): z.infer<typeof PlayerMatchEventLogResponseSchema> => {
  const { player, player_name, ...rest } = playerMatchEventLog;

  const player_obj = player ?? { name: player_name as string };

  return {
    ...rest,
    player: player_obj,
  };
};

export { playerMatchEventLog };
