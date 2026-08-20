import { Types } from "mongoose";
import { MatchModel } from "../../../../models/match.js";
import { PlayerAppearanceModel } from "../../../../models/player-appearance.js";
import { PlayerRegistrationModel } from "../../../../models/player-registration.js";

export const getRegisteredPlayerIds = async (
  seasonIds: Types.ObjectId[],
): Promise<Types.ObjectId[]> => {
  const playerIds = await PlayerRegistrationModel.distinct("player", {
    season: { $in: seasonIds },
  });

  return playerIds;
};

export const getAppearancePlayerIds = async (
  seasonIds: Types.ObjectId[],
): Promise<Types.ObjectId[]> => {
  const matchIds = await MatchModel.distinct("_id", {
    season: { $in: seasonIds },
  });

  const playerIds = await PlayerAppearanceModel.distinct("player", {
    match: { $in: matchIds },
  });

  return playerIds;
};
