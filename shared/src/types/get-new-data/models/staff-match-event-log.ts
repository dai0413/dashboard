import {
  StaffFormSchema,
  MatchEventTypeFormSchema,
  StaffMatchEventLogFormSchema,
  Label,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Staff = Partial<z.infer<typeof StaffFormSchema>>;
type MatchEventType = Partial<z.infer<typeof MatchEventTypeFormSchema>>;

type PreStaffMatchEventLogScrapedSchema = Omit<
  z.infer<typeof StaffMatchEventLogFormSchema>,
  "team" | "staff" | "match" | "match_event_type"
> & {
  staff: Staff;
  match_event_type: MatchEventType;
};

export type Scraped = Partial<PreStaffMatchEventLogScrapedSchema>;
export type Form = Omit<
  z.infer<typeof StaffMatchEventLogFormSchema>,
  "team" | "staff" | "match" | "match_event_type"
> & {
  staff?: Label;
  match_event_type?: Label;
};
