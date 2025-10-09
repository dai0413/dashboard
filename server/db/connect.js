import { mongoose } from "mongoose";

export default function connectDB(url) {
  return mongoose.connect(url, {});
}
