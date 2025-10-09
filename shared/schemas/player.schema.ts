import { z } from "zod";

export const PlayerSchema = z.object({
  name: z.string().nonempty(),
  en_name: z.string().optional(),
  dob: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
  pob: z.string().optional(),
  createdAt: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
  updatedAt: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
});

export type Player = z.infer<typeof PlayerSchema>;
