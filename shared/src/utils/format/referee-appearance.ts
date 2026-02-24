import z from "zod";
import {
  RefereeAppearanceResponseSchema,
  RefereeAppearancePopulatedSchema,
} from "@dai0413/myorg-shared";

const refereeAppearance = (
  refereeAppearance: z.infer<typeof RefereeAppearancePopulatedSchema>,
): z.infer<typeof RefereeAppearanceResponseSchema> => {
  const { referee, referee_name, ...rest } = refereeAppearance;

  const referee_obj = referee ?? { name: referee_name as string };

  return {
    ...rest,
    referee: referee_obj,
  };
};

export { refereeAppearance };
