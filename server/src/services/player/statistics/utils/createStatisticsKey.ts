import { Types } from "mongoose";

export const createStatisticsKey = (
  playerId: Types.ObjectId | string,
  groupId?: Types.ObjectId | string,
) =>
  groupId
    ? `${playerId.toString()}-${groupId.toString()}`
    : playerId.toString();
