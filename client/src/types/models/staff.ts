import { StaffPopulatedSchema, StaffFormSchema } from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Player } from "./player";
import { Country } from "./country";

export type Staff = Omit<
  z.infer<typeof StaffPopulatedSchema>,
  "player" | "citizenship"
> & {
  player?: Player;
  citizenship?: Country[];
};

export type StaffForm = Partial<
  Omit<z.infer<typeof StaffFormSchema>, "player" | "dob" | "citizenship"> & {
    player?: Player["_id"];
    citizenship?: Country["_id"][];
    dob?: string;
  }
>;

export type StaffGet = Omit<Staff, "player" | "citizenship"> & {
  player?: Label;
  citizenship?: Label[];
};
