import { SeasonPopulatedSchema, SeasonFormSchema } from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Competition } from "./competition";

export type Season = Omit<
  z.infer<typeof SeasonPopulatedSchema>,
  "competition"
> & {
  competition: Competition;
};

export type SeasonForm = Partial<
  Omit<z.infer<typeof SeasonFormSchema>, "competition"> & {
    competition: Competition["_id"];
  }
>;

export type SeasonGet = Omit<Season, "current" | "competition"> & {
  competition: Label;
  current?: string;
};
