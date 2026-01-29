import z from "zod";
import {
  PlayerAppearanceResponseSchema,
  PlayerAppearancePopulatedSchema,
} from "@dai0413/myorg-shared";

const playerAppearance = (
  PlayerAppearance: z.infer<typeof PlayerAppearancePopulatedSchema>,
): z.infer<typeof PlayerAppearanceResponseSchema> => {
  const { player, player_name, ...rest } = PlayerAppearance;

  const player_obj = player ?? { name: player_name as string };

  return {
    ...rest,
    player: player_obj,
  };
};

export { playerAppearance };
