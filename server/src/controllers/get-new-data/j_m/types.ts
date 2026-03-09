import { Model } from "mongoose";

export type ResolveField<Scraped> = {
  key: keyof Scraped;
  model: Model<any>;
  delete?: keyof Scraped;
};
