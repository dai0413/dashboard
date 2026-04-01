import {
  MatchPopulatedSchema,
  MatchPopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";

export type ResolveInput = Partial<z.infer<typeof MatchPopulatedSchema>>;
export type ResolveOutput = Partial<z.infer<typeof MatchPopulateLabelSchema>>;
