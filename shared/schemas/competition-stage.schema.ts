import { z } from "zod";
import { stage_type } from "../enum/stage_type.ts";
import { objectId } from "./utils/objectId.ts";
import { dateField } from "./utils/dateField.ts";
import { CompetitionZodSchema } from "./competition.schema.ts";
import { SeasonZodSchema } from "./season.schema.ts";

export const CompetitionStageZodSchema = z
  .object({
    _id: objectId,
    competition: objectId.refine((v) => !!v, {
      message: "competitionは必須です",
    }),
    season: objectId.refine((v) => !!v, {
      message: "seasonは必須です",
    }),
    stage_type: z
      .enum(stage_type)
      .refine((v) => !!v, {
        message: "stage_typeは必須です",
      })
      .default("none"),
    name: z.string().optional(),
    round_number: z.number().optional(),
    leg: z.number().optional(),
    order: z.number().optional(),
    parent_stage: objectId.optional(),
    notes: z.string().nonempty().optional(),
    createdAt: dateField,
    updatedAt: dateField,
  })
  .refine(
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
    }
  );

export type CompetitionStageType = z.infer<typeof CompetitionStageZodSchema>;

export const CompetitionStageFormSchema = CompetitionStageZodSchema.omit({
  _id: true,
  competition: true,
  createdAt: true,
  updatedAt: true,
});

export const CompetitionStageResponseSchema = CompetitionStageZodSchema.omit({
  competition: true,
  season: true,
  parent_stage: true,
}).safeExtend({
  competition: CompetitionZodSchema,
  season: SeasonZodSchema,
  parent_stage: z.array(CompetitionStageZodSchema).optional(),
});

export const CompetitionStagePopulatedSchema = CompetitionStageZodSchema.omit({
  competition: true,
  season: true,
  parent_stage: true,
}).safeExtend({
  competition: CompetitionZodSchema,
  season: SeasonZodSchema,
  parent_stage: z.array(CompetitionStageZodSchema).optional(),
});
