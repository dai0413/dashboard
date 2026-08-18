import { Types } from "mongoose";
import { MatchModel } from "../../../models/match.js";
import { PlayerAppearanceModel } from "../../../models/player-appearance.js";
import { PlayerRegistrationModel } from "../../../models/player-registration.js";

export const getRegisteredPlayerIds = async (
  seasonId: string,
): Promise<Types.ObjectId[]> => {
  return PlayerRegistrationModel.distinct("player", {
    season: seasonId,
  });
};

export const getAppearancePlayerIds = async (
  seasonId: string,
): Promise<Types.ObjectId[]> => {
  const matchIds = await MatchModel.distinct("_id", {
    season: seasonId,
  });

  const playerIds = await PlayerAppearanceModel.distinct("player", {
    match: { $in: matchIds },
  });

  return playerIds;
};
