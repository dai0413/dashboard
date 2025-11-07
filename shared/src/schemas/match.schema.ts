import { z } from "zod";
import { objectId } from "./utils/objectId.js";
import { dateField } from "./utils/dateField.js";
import { result } from "../enum/result.js";
import { TeamZodSchema } from "./team.schema.js";
import { CompetitionZodSchema } from "./competition.schema.js";
import { CompetitionStageZodSchema } from "./competition-stage.schema.js";
import { SeasonZodSchema } from "./season.schema.js";
import { MatchFormatZodSchema } from "./match-format.schema.js";
import { StadiumZodSchema } from "./stadium.schema.js";

export const MatchZodSchema = z
  .object({
    _id: objectId,
    competition: objectId.refine((v) => !!v, {
      message: "competitionは必須です",
    }),
    competition_stage: objectId.refine((v) => !!v, {
      message: "competition_stageは必須です",
    }),
    season: objectId.refine((v) => !!v, {
      message: "seasonは必須です",
    }),
    home_team: objectId.refine((v) => !!v, {
      message: "home_teamは必須です",
    }),
    away_team: objectId.refine((v) => !!v, {
      message: "away_teamは必須です",
    }),
    match_format: objectId.optional(),
    stadium: objectId.optional(),
    stadium_name: z.string().nonempty().optional(),
    play_time: z.number().optional(),
    date: dateField,
    audience: z.number().optional(),
    home_goal: z.number().optional(),
    away_goal: z.number().optional(),
    home_pk_goal: z.number().optional(),
    away_pk_goal: z.number().optional(),
    result: z.enum(result).optional(),
    match_week: z.number().optional(),
    weather: z.string().nonempty().optional(),
    temperature: z.number().optional(),
    humidity: z.number().optional(),
    transferurl: z.string().nonempty().optional(),
    sofaurl: z.string().nonempty().optional(),
    urls: z.array(z.string().nonempty()).optional(),
    old_id: z.string().optional(),
    createdAt: dateField,
    updatedAt: dateField,
  })
  .refine(
    (data) => {
      // PKが両方入力されている場合はPKゴールで判定
      if (data.home_pk_goal != null && data.away_pk_goal != null) {
        if (data.home_pk_goal > data.away_pk_goal)
          return data.result === "home";
        if (data.home_pk_goal < data.away_pk_goal)
          return data.result === "away";
        return data.result === "draw";
      } else if (data.home_goal != null && data.away_goal != null) {
        // 通常ゴールで判定
        if (data.home_goal > data.away_goal) return data.result === "home";
        if (data.home_goal < data.away_goal) return data.result === "away";
        return data.result === "draw";
      }
      return true; // ゴール情報がまだない場合はチェックしない
    },
    {
      message: "resultがgoalまたはPK結果と一致していません",
    }
  );

export type MatchType = z.infer<typeof MatchZodSchema>;

export const MatchFormSchema = MatchZodSchema.omit({
  _id: true,
  competition: true,
  season: true,
  play_time: true,
  result: true,
  createdAt: true,
  updatedAt: true,
});

export const MatchResponseSchema = MatchZodSchema.omit({
  competition: true,
  competition_stage: true,
  season: true,
  home_team: true,
  away_team: true,
  match_format: true,
  stadium: true,
}).safeExtend({
  competition: CompetitionZodSchema,
  competition_stage: CompetitionStageZodSchema,
  season: SeasonZodSchema,
  home_team: TeamZodSchema,
  away_team: TeamZodSchema,
  match_format: MatchFormatZodSchema.optional(),
  stadium: StadiumZodSchema.extend({ _id: objectId.optional() }).optional(),
});

export const MatchPopulatedSchema = MatchZodSchema.omit({
  competition: true,
  competition_stage: true,
  season: true,
  home_team: true,
  away_team: true,
  match_format: true,
  stadium: true,
}).safeExtend({
  competition: CompetitionZodSchema,
  competition_stage: CompetitionStageZodSchema,
  season: SeasonZodSchema,
  home_team: TeamZodSchema,
  away_team: TeamZodSchema,
  match_format: MatchFormatZodSchema.optional(),
  stadium: StadiumZodSchema.extend({ _id: objectId.optional() }).optional(),
});
