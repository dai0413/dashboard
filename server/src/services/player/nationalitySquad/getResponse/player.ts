import { player } from "@dai0413/myorg-shared/models-config";
import { PlayerModel } from "../../../../models/player.js";
import z from "zod";
import { getResponseData } from "../../../../utils/getResponseData.js";
import { NationalitySquadResult } from "../types.js";

const {
  SCHEMA: playerSchema,
  POPULATE_PATHS: playerPopulatePaths,
  convertFun: playerConvertFun,
} = player();
type Response = z.infer<typeof playerSchema.RESPONSE>;
type Populated = z.infer<typeof playerSchema.POPULATED>;

export const getPlayerResponse = async (result: NationalitySquadResult[]) => {
  const populated = await PlayerModel.populate<Populated>(
    result.map((item) => item.player),
    playerPopulatePaths,
  );

  const response: Response[] = populated.map((item) => {
    return getResponseData({
      populated: item,
      SCHEMA: playerSchema,
      convertFun: playerConvertFun,
    });
  });

  return response;
};
