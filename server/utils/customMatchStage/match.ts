import mongoose from "mongoose";
type ParsedQs = Record<string, any>;

export const match = (query: ParsedQs): Record<string, any> => {
  let matchStage: Record<string, any> = {};

  if (query.team) {
    matchStage.$or = [
      { home_team: new mongoose.Types.ObjectId(query.team) },
      { away_team: new mongoose.Types.ObjectId(query.team) },
    ];
  }

  return matchStage;
};
