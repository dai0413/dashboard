import { Types } from "mongoose";

export type MatchGroupInfo = {
  season?: Types.ObjectId;
  competition?: Types.ObjectId;
};
