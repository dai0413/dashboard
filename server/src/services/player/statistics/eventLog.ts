import { Types } from "mongoose";
import { PlayerMatchEventLogModel } from "../../../models/player-match-event-log.js";

type MatchEventLogAggregate = {
  _id: Types.ObjectId;
  goals: number;
  assists: number;
};

type Params = {
  playerObjectIds: Types.ObjectId[];
  teamObjectId?: Types.ObjectId;
  matchIds: Types.ObjectId[];
  goalId: Types.ObjectId;
  assistId: Types.ObjectId;
};

export const getPlayerMatchEventLogStatistics = ({
  playerObjectIds,
  teamObjectId,
  matchIds,
  goalId,
  assistId,
}: Params): Promise<MatchEventLogAggregate[]> => {
  return PlayerMatchEventLogModel.aggregate<MatchEventLogAggregate>([
    {
      $match: {
        player: { $in: playerObjectIds },
        ...(teamObjectId && { team: teamObjectId }),
        ...(matchIds.length > 0 && { match: { $in: matchIds } }),
      },
    },
    {
      $group: {
        _id: "$player",
        goals: {
          $sum: { $cond: [{ $eq: ["$match_event_type", goalId] }, 1, 0] },
        },
        assists: {
          $sum: {
            $cond: [{ $eq: ["$match_event_type", assistId] }, 1, 0],
          },
        },
      },
    },
  ]);
};
