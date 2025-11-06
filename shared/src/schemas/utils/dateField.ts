import { z } from "zod";

export const dateField = z
  .preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date()
  )
  .optional();
