import { z } from "zod";
import { dateField } from "./utils/dateField.js";
import { objectId } from "./utils/objectId.js";
import { MatchBaseZodSchema } from "./match.schema.js";
import { TeamZodSchema } from "./team.schema.js";
import { label } from "./utils/label.js";

export const StatsLZodSchema = z.object({
  _id: objectId,
  match: objectId.refine((v) => !!v, { message: "matchは必須です" }),
  team: objectId.refine((v) => !!v, { message: "teamは必須です" }),
  xgFor: z.number().min(0).optional(),
  shootFor: z.number().int().min(0).optional(),
  onTargetFor: z.number().int().min(0).optional(),
  pkShootFor: z.number().int().min(0).optional(),
  passFor: z.number().int().min(0).optional(),
  crossFor: z.number().int().min(0).optional(),
  directFkFor: z.number().int().min(0).optional(),
  indirectFkFor: z.number().int().min(0).optional(),
  cornerKickFor: z.number().int().min(0).optional(),
  throwInFor: z.number().int().min(0).optional(),
  dribbleFor: z.number().int().min(0).optional(),
  tackleFor: z.number().int().min(0).optional(),
  clearFor: z.number().int().min(0).optional(),
  interceptFor: z.number().int().min(0).optional(),
  offsideFor: z.number().int().min(0).optional(),
  yellowCardFor: z.number().int().min(0).optional(),
  redCardFor: z.number().int().min(0).optional(),
  entryAtk3rdFor: z.number().int().min(0).optional(),
  entryPenaltyAreaFor: z.number().int().min(0).optional(),
  distanceFor: z.number().int().min(0).optional(),
  sprintFor: z.number().int().min(0).optional(),
  attackCountFor: z.number().int().min(0).optional(),
  chanceCreationRateFor: z.number().min(0).optional(),
  shootSuccessRateFor: z.number().min(0).optional(),
  passSuccessRateFor: z.number().min(0).optional(),
  crossSuccessRateFor: z.number().min(0).optional(),
  throwInSuccessRateFor: z.number().min(0).optional(),
  dribbleSuccessRateFor: z.number().min(0).optional(),
  tackleSuccessRateFor: z.number().min(0).optional(),

  possession: z.number().min(0).optional(),
  acc_time: z.number().min(0).optional(),

  xgAgainst: z.number().min(0).optional(),
  shootAgainst: z.number().int().min(0).optional(),
  onTargetAgainst: z.number().int().min(0).optional(),
  pkShootAgainst: z.number().int().min(0).optional(),
  passAgainst: z.number().int().min(0).optional(),
  crossAgainst: z.number().int().min(0).optional(),
  directFkAgainst: z.number().int().min(0).optional(),
  indirectFkAgainst: z.number().int().min(0).optional(),
  cornerKickAgainst: z.number().int().min(0).optional(),
  throwInAgainst: z.number().int().min(0).optional(),
  dribbleAgainst: z.number().int().min(0).optional(),
  tackleAgainst: z.number().int().min(0).optional(),
  clearAgainst: z.number().int().min(0).optional(),
  interceptAgainst: z.number().int().min(0).optional(),
  offsideAgainst: z.number().int().min(0).optional(),
  yellowCardAgainst: z.number().int().min(0).optional(),
  redCardAgainst: z.number().int().min(0).optional(),
  entryAtk3rdAgainst: z.number().int().min(0).optional(),
  entryPenaltyAreaAgainst: z.number().int().min(0).optional(),
  distanceAgainst: z.number().int().min(0).optional(),
  sprintAgainst: z.number().int().min(0).optional(),
  attackCountAgainst: z.number().int().min(0).optional(),
  chanceCreationRateAgainst: z.number().min(0).optional(),
  shootSuccessRateAgainst: z.number().min(0).optional(),
  passSuccessRateAgainst: z.number().min(0).optional(),
  crossSuccessRateAgainst: z.number().min(0).optional(),
  throwInSuccessRateAgainst: z.number().min(0).optional(),
  dribbleSuccessRateAgainst: z.number().min(0).optional(),
  tackleSuccessRateAgainst: z.number().min(0).optional(),

  createdAt: dateField,
  updatedAt: dateField,
});

export const StatsLFormSchema = StatsLZodSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const StatsLResponseSchema = StatsLZodSchema.omit({
  match: true,
  team: true,
}).safeExtend({
  match: MatchBaseZodSchema,
  team: TeamZodSchema,
});
export const StatsLPopulatedSchema = StatsLZodSchema.omit({
  match: true,
  team: true,
}).safeExtend({
  match: MatchBaseZodSchema,
  team: TeamZodSchema,
});

export const StatsLPopulateLabelSchema = StatsLZodSchema.omit({
  match: true,
  team: true,
}).safeExtend({
  match: label,
  team: label,
});
