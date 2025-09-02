import { Label } from "../types";
import { Competition } from "./competition";

export type Season = {
  _id: string;
  competition: Competition;
  name: string;
  start_date?: Date | null;
  end_date?: Date | null;
  current?: boolean | null;
  note?: String | null;
};

type SeasonPost = Omit<Season, "_id" | "competition"> & {
  competition: Competition["_id"] | null;
};

export type SeasonForm = Partial<SeasonPost>;

export type SeasonGet = Omit<Season, "current" | "competition"> & {
  competition: Label;
  current: string | null;
};
