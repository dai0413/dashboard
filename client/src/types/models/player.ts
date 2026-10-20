import { PlayerFormSchema, PlayerPopulatedSchema } from "@dai0413/myorg-shared";
import { Label } from "../types";
import { Country } from "./country";
import z from "zod";

export type Player = Omit<
  z.infer<typeof PlayerPopulatedSchema>,
  "citizenship"
> & {
  citizenship?: Country[];
};

export type PlayerForm = Partial<
  Omit<z.infer<typeof PlayerFormSchema>, "citizenship" | "dob"> & {
    citizenship: Country["_id"][];
    dob: string;
  }
>;

export type PlayerGet = Omit<Player, "citizenship"> & {
  citizenship?: Label[];
};
