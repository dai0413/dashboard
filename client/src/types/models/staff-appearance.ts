import {
  StaffAppearancePopulatedSchema,
  StaffAppearanceFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Match } from "./match";
import { Staff } from "./staff";
import { Team } from "./team";

export type StaffAppearance = Omit<
  z.infer<typeof StaffAppearancePopulatedSchema>,
  "match" | "staff" | "team"
> & {
  match: Match;
  staff: Staff;
  team: Team;
};

export type StaffAppearanceForm = Partial<
  Omit<
    z.infer<typeof StaffAppearanceFormSchema>,
    "match" | "staff" | "team"
  > & {
    match: Match["_id"];
    staff: Staff["_id"];
    team: Team["_id"];
  }
>;

export type StaffAppearanceGet = Omit<
  StaffAppearance,
  "match" | "staff" | "team"
> & {
  match: Label;
  staff: Label;
  team: Label;
};
