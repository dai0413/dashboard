import { mongoose } from "mongoose";

const parseObjectId = (val) => {
  return val ? new mongoose.Types.ObjectId(val) : null;
};

export { parseObjectId };
