import {
  StaffFormSchema,
  TeamFormSchema,
  StaffAppearanceFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Team = Partial<z.infer<typeof TeamFormSchema>>;
type Staff = Partial<z.infer<typeof StaffFormSchema>>;

type PreStaffAppearanceFormSchema = Omit<
  z.infer<typeof StaffAppearanceFormSchema>,
  "team" | "staff" | "match" | "position"
> & {
  team: Team;
  staff: Staff;
};

export type Scraped = Partial<PreStaffAppearanceFormSchema>;
export type Form = z.infer<typeof StaffAppearanceFormSchema>;
