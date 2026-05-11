import { z } from "zod";
import { stageType } from "../enum/stageType.js";
import { getKey } from "../utils/getKey.js";
import { objectId } from "./utils/objectId.js";
import { dateField } from "./utils/dateField.js";
import { CompetitionZodSchema } from "./competition.schema.js";
import { SeasonZodSchema } from "./season.schema.js";

export const CompetitionStageBaseZodSchema = z.object({
  _id: objectId,
  competition: objectId.refine((v) => !!v, {
    message: "competitionは必須です",
  }),
  season: objectId.refine((v) => !!v, {
    message: "seasonは必須です",
  }),
  stage_type: z
    .enum(getKey(stageType()))
    .refine((v) => !!v, {
      message: "stage_typeは必須です",
    })
    .default("none"),
  name: z.string().optional(),
  round_number: z.number().int().positive().optional(),
  leg: z.number().int().positive().optional(),
  order: z.number().int().positive().optional(),
  parent_stage: objectId.optional(),
  notes: z.string().nonempty().optional(),
  createdAt: dateField,
  updatedAt: dateField,
});

export const CompetitionStageZodSchema = CompetitionStageBaseZodSchema.refine(
  (data) => {
    if (data.stage_type === "none") {
      return (
        data.name === undefined &&
        data.round_number === undefined &&
        data.leg === undefined &&
        data.order === undefined
      );
    }
    return true;
  },
  {
    message:
      "stage_typeがnoneのときはname, round_number, leg, orderはundefinedでなければなりません",
  },
);

export const CompetitionStageFormSchema = CompetitionStageBaseZodSchema.omit({
  _id: true,
  competition: true,
  createdAt: true,
  updatedAt: true,
});

export const CompetitionStageResponseSchema =
  CompetitionStageBaseZodSchema.omit({
    competition: true,
    season: true,
    parent_stage: true,
  }).safeExtend({
    competition: CompetitionZodSchema,
    season: SeasonZodSchema,
    parent_stage: z.array(CompetitionStageZodSchema).optional(),
  });

export const CompetitionStagePopulatedSchema =
  CompetitionStageBaseZodSchema.omit({
    competition: true,
    season: true,
    parent_stage: true,
  }).safeExtend({
    competition: CompetitionZodSchema,
    season: SeasonZodSchema,
    parent_stage: z.array(CompetitionStageZodSchema).optional(),
  });
