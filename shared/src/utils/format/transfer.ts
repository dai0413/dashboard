import z from "zod";

import {
  TransferResponseSchema,
  TransferPopulatedSchema,
} from "../../schemas/transfer.schema.js";

const transfer = (
  data: z.infer<typeof TransferPopulatedSchema>
): z.infer<typeof TransferResponseSchema> => {
  const { from_team, to_team, from_team_name, to_team_name, ...rest } = data;

  const from_team_obj = from_team
    ? from_team
    : from_team_name
    ? { team: from_team_name }
    : undefined;

  const to_team_obj = to_team
    ? to_team
    : to_team_name
    ? { team: to_team_name }
    : undefined;

  return {
    ...rest,
    from_team: from_team_obj,
    to_team: to_team_obj,
  };
};

export { transfer };
