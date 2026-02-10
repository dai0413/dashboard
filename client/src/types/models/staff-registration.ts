import {
  StaffRegistrationPopulatedSchema,
  StaffRegistrationFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Season } from "./season";
import { Competition } from "./competition";
import { Staff } from "./staff";
import { Team } from "./team";

export type StaffRegistration = Omit<
  z.infer<typeof StaffRegistrationPopulatedSchema>,
  "season" | "competition" | "staff" | "team"
> & {
  season: Season;
  competition: Competition;
  staff: Staff;
  team: Team;
};

export type StaffRegistrationForm = Partial<
  Omit<
    z.infer<typeof StaffRegistrationFormSchema>,
    "season" | "competition" | "staff" | "team" | "date"
  > & {
    season: Season["_id"];
    staff: Staff["_id"];
    team: Team["_id"];
    date: string;
  }
>;

export type StaffRegistrationGet = Omit<
  StaffRegistration,
  "season" | "competition" | "staff" | "team"
> & {
  season: Label;
  competition: Label;
  staff: Label;
  team: Label;
};
