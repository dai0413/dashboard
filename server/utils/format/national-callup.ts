import z from "zod";
import {
  NationalCallUpResponseSchema,
  NationalCallUpPopulatedSchema,
} from "@myorg/shared";

const nationalCallup = (
  nationalCallup: z.infer<typeof NationalCallUpPopulatedSchema>
): z.infer<typeof NationalCallUpResponseSchema> => {
  const { team, team_name, ...rest } = nationalCallup;

  const team_obj = team ?? { team: team_name as string };

  return {
    ...rest,
    team: team_obj,
  };
};

export { nationalCallup };
