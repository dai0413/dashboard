import { TeamFormSchema, TeamPopulatedSchema } from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Country } from "./country";
import z from "zod";

export type Team = Omit<z.infer<typeof TeamPopulatedSchema>, "country"> & {
  country?: Country;
};

export type TeamForm = Partial<
  Omit<z.infer<typeof TeamFormSchema>, "country"> & {
    country: Country["_id"];
  }
>;

export type TeamGet = Omit<Team, "country"> & {
  country?: Label;
};
