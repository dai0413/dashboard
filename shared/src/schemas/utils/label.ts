import { z } from "zod";

export const label = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
});
