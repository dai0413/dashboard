import { Types } from "mongoose";
import BadRequestError from "../../../../errors/bad-request.js";
import { getAppearancePlayerIds, getRegisteredPlayerIds } from "./playerIds.js";

type ResolvePlayerTargetsParams = {
  player?: string | string[];
  season?: string;
};

const resolveSpecifiedPlayerIds = (
  player: string | string[],
): Types.ObjectId[] => {
  const playerIds = (Array.isArray(player) ? player : [player]).filter(
    (id): id is string => typeof id === "string",
  );

  const invalidIds = playerIds.filter((id) => !Types.ObjectId.isValid(id));

  if (invalidIds.length > 0) {
    throw new BadRequestError(`不正なplayerIdです: ${invalidIds.join(",")}`);
  }

  return playerIds.map((id) => new Types.ObjectId(id));
};

type ResolvedPlayerTargets = {
  playerObjectIds: Types.ObjectId[];
  seasonObjectIds: Types.ObjectId[];
};

export const resolvePlayerTargets = async ({
  player,
  season,
}: ResolvePlayerTargetsParams): Promise<ResolvedPlayerTargets> => {
  if (player) {
    return {
      playerObjectIds: resolveSpecifiedPlayerIds(player),
      seasonObjectIds:
        season && Types.ObjectId.isValid(season)
          ? [new Types.ObjectId(season)]
          : [],
    };
  }

  if (!season || !Types.ObjectId.isValid(season)) {
    throw new BadRequestError("seasonを指定してください");
  }

  const seasonObjectIds = [new Types.ObjectId(season)];

  const [registrationPlayerIds, appearancePlayerIds] = await Promise.all([
    getRegisteredPlayerIds(seasonObjectIds),
    getAppearancePlayerIds(seasonObjectIds),
  ]);

  const playerIdSet = new Set([
    ...registrationPlayerIds.map((id) => id.toString()),
    ...appearancePlayerIds.map((id) => id.toString()),
  ]);

  return {
    playerObjectIds: [...playerIdSet].map((id) => new Types.ObjectId(id)),
    seasonObjectIds,
  };
};
