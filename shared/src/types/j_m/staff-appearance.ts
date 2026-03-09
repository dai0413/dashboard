import {
  StaffFormSchema,
  StaffAppearanceFormSchema,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Staff = Partial<z.infer<typeof StaffFormSchema>>;

type PreStaffAppearanceScrapedSchema = Omit<
  z.infer<typeof StaffAppearanceFormSchema>,
  "team" | "staff" | "match" | "position"
> & {
  staff: Staff;
};

export type Scraped = Partial<PreStaffAppearanceScrapedSchema>;
export type Form = z.infer<typeof StaffAppearanceFormSchema>;
