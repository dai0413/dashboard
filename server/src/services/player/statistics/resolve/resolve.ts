import { Types } from "mongoose";
import { resolvePlayerTargets } from "./playerTargets.js";
import { resolvePlayerMatches } from "./matches.js";
import { MatchGroupInfo } from "../types.js";

type Params = {
  player?: string | string[];
  team?: string;
  season?: string;
  match?: string | string[];
  filterCondition: Record<string, any>;
};

type Ids = {
  matchIds: Types.ObjectId[];
  matchGroupMap: Map<string, MatchGroupInfo>;
  seasonObjectIds: Types.ObjectId[];
  playerObjectIds: Types.ObjectId[];
  teamObjectId: Types.ObjectId | undefined;
};

export const resolve = async ({
  player,
  team,
  season,
  match,
  filterCondition,
}: Params): Promise<Ids> => {
  let { playerObjectIds, seasonObjectIds, matchObjectIds } =
    await resolvePlayerTargets({
      player,
      match,
      season,
    });

  let teamObjectId: undefined | Types.ObjectId;

  if (team) {
    teamObjectId = new Types.ObjectId(team as string);
  }

  const { matchIds, matchGroupMap, matchSeasonIds } =
    await resolvePlayerMatches({
      matchObjectIds,
      teamObjectId,
      filterCondition,
      playerObjectIds,
    });

  seasonObjectIds = [
    ...new Map(
      [...seasonObjectIds, ...matchSeasonIds].map((id) => [id.toString(), id]),
    ).values(),
  ];

  return {
    matchIds,
    matchGroupMap,
    seasonObjectIds,
    playerObjectIds,
    teamObjectId,
  };
};
