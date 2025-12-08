import {
  MatchEventTypePopulatedSchema,
  MatchEventTypeFormSchema,
} from "@dai0413/myorg-shared";
import z from "zod";

export type MatchEventType = z.infer<typeof MatchEventTypePopulatedSchema>;

export type MatchEventTypeForm = Partial<
  z.infer<typeof MatchEventTypeFormSchema>
>;

export type MatchEventTypeGet = MatchEventType;
