import {
  StaffFormSchema,
  TeamFormSchema,
  CompetitionFormSchema,
  StaffRegistrationHistoryFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Staff = Partial<z.infer<typeof StaffFormSchema>>;
type Team = Partial<z.infer<typeof TeamFormSchema>>;
type Competition = Partial<z.infer<typeof CompetitionFormSchema>>;

type PreStaffRegistrationHistory = Omit<
  z.infer<typeof StaffRegistrationHistoryFormSchema>,
  "staff" | "team"
> & {
  staff: Staff;
  team: Team;
  competition: Competition;
};

export type Scraped = Partial<PreStaffRegistrationHistory>;
export type Form = z.infer<typeof StaffRegistrationHistoryFormSchema>;
