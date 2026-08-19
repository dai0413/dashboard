import {
  CompetitionFormSchema,
  CompetitionPopulatedSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Country } from "./country";
import z from "zod";

export type Competition = Omit<
  z.infer<typeof CompetitionPopulatedSchema>,
  "country"
> & {
  country?: Country;
};

export type CompetitionForm = Partial<
  Omit<z.infer<typeof CompetitionFormSchema>, "country"> & {
    country: Country["_id"];
  }
>;

export type CompetitionGet = Omit<Competition, "country"> & {
  country?: Label;
};
