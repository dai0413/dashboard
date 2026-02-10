import {
  StaffRegistrationHistoryPopulatedSchema,
  StaffRegistrationHistoryFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Season } from "./season";
import { Competition } from "./competition";
import { Staff } from "./staff";
import { Team } from "./team";

export type StaffRegistrationHistory = Omit<
  z.infer<typeof StaffRegistrationHistoryPopulatedSchema>,
  "season" | "competition" | "staff" | "team"
> & {
  season: Season;
  competition: Competition;
  staff: Staff;
  team: Team;
};

export type StaffRegistrationHistoryForm = Partial<
  Omit<
    z.infer<typeof StaffRegistrationHistoryFormSchema>,
    "season" | "competition" | "staff" | "team" | "date"
  > & {
    season: Season["_id"];
    staff: Staff["_id"];
    team: Team["_id"];
    date: string;
  }
>;

export type StaffRegistrationHistoryGet = Omit<
  StaffRegistrationHistory,
  "season" | "competition" | "staff" | "team"
> & {
  season: Label;
  competition: Label;
  staff: Label;
  team: Label;
};
