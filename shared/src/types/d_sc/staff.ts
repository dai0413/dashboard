import { StaffFormSchema } from "@dai0413/myorg-shared";
import { z } from "zod";

export type Scraped = Partial<z.infer<typeof StaffFormSchema>>;
export type Form = Scraped;
