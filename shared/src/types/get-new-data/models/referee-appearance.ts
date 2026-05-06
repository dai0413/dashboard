import {
  RefereeFormSchema,
  RefereeAppearanceFormSchema,
  Label,
} from "@dai0413/myorg-shared";
import { z } from "zod";

type Referee = Partial<z.infer<typeof RefereeFormSchema>>;

type PreRefereeAppearanceScrapedSchema = Omit<
  z.infer<typeof RefereeAppearanceFormSchema>,
  "referee" | "match"
> & {
  referee: Referee;
};

export type Scraped = Partial<PreRefereeAppearanceScrapedSchema>;
export type Form = Omit<
  z.infer<typeof RefereeAppearanceFormSchema>,
  "match" | "referee"
> & {
  referee?: Label;
};
