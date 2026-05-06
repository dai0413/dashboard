import { PlayerFormSchema } from "@dai0413/myorg-shared";
import { z } from "zod";

export type Scraped = Partial<z.infer<typeof PlayerFormSchema>>;
export type Form = Scraped;
