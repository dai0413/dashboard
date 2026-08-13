import { Types } from "mongoose";
import { PlayerAppearanceModel } from "../../../models/player-appearance.js";

type AppearanceAggregate = {
  _id: Types.ObjectId;
  starts: number;
  subs: number;
  bench: number;
  minutes: number;
  positions: string[];
};

type Params = {
  playerObjectIds: Types.ObjectId[];
  teamObjectId?: Types.ObjectId;
  matchIds: Types.ObjectId[];
};

export const getPlayerAppearanceStatistics = ({
  playerObjectIds,
  teamObjectId,
  matchIds,
}: Params): Promise<AppearanceAggregate[]> => {
  return PlayerAppearanceModel.aggregate<AppearanceAggregate>([
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
        starts: {
          $sum: {
            $cond: [{ $eq: ["$play_status", "start"] }, 1, 0],
          },
        },
        subs: {
          $sum: {
            $cond: [{ $eq: ["$play_status", "sub"] }, 1, 0],
          },
        },
        bench: {
          $sum: {
            $cond: [{ $eq: ["$play_status", "bench"] }, 1, 0],
          },
        },
        minutes: {
          $sum: "$time",
        },
        positions: {
          $push: "$position",
        },
      },
    },
  ]);
};
