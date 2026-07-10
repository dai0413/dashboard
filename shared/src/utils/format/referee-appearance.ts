import z from "zod";
import {
  RefereeAppearanceResponseSchema,
  RefereeAppearancePopulatedSchema,
} from "@dai0413/myorg-shared";

const refereeAppearance = (
  refereeAppearance: z.infer<typeof RefereeAppearancePopulatedSchema>,
): z.infer<typeof RefereeAppearanceResponseSchema> => {
  const { referee, referee_name, ...rest } = refereeAppearance;

  const referee_obj = referee
    ? referee
    : referee_name
      ? { name: referee_name }
      : undefined;

  return {
    ...rest,
    referee: referee_obj,
  };
};

export { refereeAppearance };
