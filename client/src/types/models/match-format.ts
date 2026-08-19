import {
  MatchFormatFormSchema,
  MatchFormatZodSchema,
} from "@dai0413/myorg-shared";
import z from "zod";

export type MatchFormat = z.infer<typeof MatchFormatZodSchema>;

export type MatchFormatForm = Partial<z.infer<typeof MatchFormatFormSchema>>;

export type MatchFormatGet = MatchFormat;
