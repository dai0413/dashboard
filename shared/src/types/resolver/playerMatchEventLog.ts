import {
  Label,
  PlayerMatchEventLogPopulatedSchema,
  PlayerMatchEventLogPopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";

type CandidatePlayers = {
  key: string;
} & Record<string, any>;

export type ResolveInput = Omit<
  Partial<z.infer<typeof PlayerMatchEventLogPopulatedSchema>>,
  "team" | "match"
> & {
  match: Label;
  team?: Label;
  candidatePlayers?: CandidatePlayers[];
  key?: string;
};
export type ResolveOutput = Partial<
  z.infer<typeof PlayerMatchEventLogPopulateLabelSchema>
>;
