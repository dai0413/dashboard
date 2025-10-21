import mongoose from "mongoose";
type ParsedQs = Record<string, any>;

export const transfer = (query: ParsedQs): Record<string, any> => {
  let matchStage: Record<string, any> = {};

  if (query.team) {
    matchStage.$or = [
      { from_team: new mongoose.Types.ObjectId(query.team) },
      { to_team: new mongoose.Types.ObjectId(query.team) },
    ];
  }
  if (query.form) {
    const isNegated = query.form.startsWith("!");
    const values = (isNegated ? query.form.slice(1) : query.form).split(",");
    matchStage.form = isNegated ? { $nin: values } : { $in: values };
  }
  if (query.from_date_gte)
    matchStage.from_date = { $gte: new Date(query.from_date_gte) };
  if (query.to_date_before)
    matchStage.to_date = { $lte: new Date(query.to_date_before) };
  return matchStage;
};
