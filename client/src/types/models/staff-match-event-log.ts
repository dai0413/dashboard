import {
  StaffMatchEventLogPopulatedSchema,
  StaffMatchEventLogFormSchema,
} from "@dai0413/myorg-shared";
import { Label } from "../types";
import z from "zod";
import { Match } from "./match";
import { Staff } from "./staff";
import { Team } from "./team";
import { MatchEventType } from "./match-event-type";

export type StaffMatchEventLog = Omit<
  z.infer<typeof StaffMatchEventLogPopulatedSchema>,
  "match" | "team" | "match_event_type" | "staff"
> & {
  match: Match;
  team: Team;
  match_event_type: MatchEventType;
  staff: Staff;
};

export type StaffMatchEventLogForm = Partial<
  Omit<
    z.infer<typeof StaffMatchEventLogFormSchema>,
    "match" | "team" | "match_event_type" | "staff"
  > & {
    match: Match["_id"];
    team: Team["_id"];
    match_event_type: MatchEventType["_id"];
    staff: Staff["_id"];
    staff_name?: string;
  }
>;

export type StaffMatchEventLogGet = Omit<
  StaffMatchEventLog,
  "match" | "team" | "match_event_type" | "staff" | "staff_name"
> & {
  match: Label;
  team: Label;
  match_event_type: Label;
  staff: Label;
};
