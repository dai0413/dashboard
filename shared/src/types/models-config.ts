import z from "zod";
import { ParsedQs } from "qs";
import { TeamResponseSchema } from "../schemas/team.schema.js";
import { PlayerResponseSchema } from "../schemas/player.schema.js";
import { CountryResponseSchema } from "../schemas/country.schema.js";
import { NationalMatchSeriesResponseSchema } from "../schemas/national-match-series.schema.js";
import { CompetitionResponseSchema } from "../schemas/competition.schema.js";
import { SeasonResponseSchema } from "../schemas/season.schema.js";
import { CompetitionStageResponseSchema } from "../schemas/competition-stage.schema.js";
import { MatchResponseSchema } from "../schemas/match.schema.js";
import { StaffResponseSchema } from "../schemas/staff.schema.js";
import { MatchEventTypeResponseSchema } from "../schemas/match-event-type.schema.js";
import { FormationResponseSchema } from "../schemas/formation.schema.js";
import { RefereeResponseSchema } from "../schemas/referee.schema.js";

export type PopulatePath = {
  path: string;
  collection?: string;
  matchBefore?: boolean;
  isArray?: boolean;
};

type GetAllQuery = {
  query?: {
    field: string;
    type: "ObjectId" | "String" | "Number" | "Date" | "Boolean";
    populateAfter?: boolean;
  }[];
  buildCustomMatch?: (query: ParsedQs) => Record<string, any>;
};

export interface DependencyRefs {
  team: z.infer<typeof TeamResponseSchema>[];
  player: z.infer<typeof PlayerResponseSchema>[];
  country: z.infer<typeof CountryResponseSchema>[];
  nationalMatchSeries: z.infer<typeof NationalMatchSeriesResponseSchema>[];
  competition: z.infer<typeof CompetitionResponseSchema>[];
  season: z.infer<typeof SeasonResponseSchema>[];
  competitionStage: z.infer<typeof CompetitionStageResponseSchema>[];
  match: z.infer<typeof MatchResponseSchema>[];
  staff: z.infer<typeof StaffResponseSchema>[];
  matchEventType: z.infer<typeof MatchEventTypeResponseSchema>[];
  formation: z.infer<typeof FormationResponseSchema>[];
  referee: z.infer<typeof RefereeResponseSchema>[];
}

export interface ControllerConfig<
  TDataSchema extends z.ZodTypeAny,
  TFormSchema extends z.ZodTypeAny = TDataSchema,
  TResponseSchema extends z.ZodTypeAny = TDataSchema,
  TPopulatedSchema extends z.ZodTypeAny = TDataSchema,
> {
  name: string;
  collection_name: string;

  SCHEMA: {
    DATA: TDataSchema;
    FORM: TFormSchema;
    POPULATED: TPopulatedSchema;
    RESPONSE: TResponseSchema;
  };

  MONGO_MODEL: any | null;
  POPULATE_PATHS: PopulatePath[];

  convertFun?: (data: z.infer<TPopulatedSchema>) => z.infer<TResponseSchema>;

  getAllConfig?: GetAllQuery & {
    sort?: Record<string, 1 | -1>;
  } & {
    project?: Record<string, 0 | 1>;
  };
  bulk?: boolean;
  download?: boolean;

  TEST: {
    sampleData:
      | z.infer<TFormSchema>[]
      | ((deps: DependencyRefs) => z.infer<TFormSchema>[]);
    updatedData:
      | Partial<z.infer<TFormSchema>>
      | ((deps: DependencyRefs) => Partial<z.infer<TFormSchema>>);
  };
}
