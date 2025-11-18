import z from "zod";
import { ParsedQs } from "qs";
import { operator } from "./enum/operator.js";
import { TeamResponseSchema } from "./schemas/team.schema.js";
import { PlayerResponseSchema } from "./schemas/player.schema.js";
import { CountryResponseSchema } from "./schemas/country.schema.js";
import { NationalMatchSeriesResponseSchema } from "./schemas/national-match-series.schema.js";
import { CompetitionResponseSchema } from "./schemas/competition.schema.js";
import { SeasonResponseSchema } from "./schemas/season.schema.js";
import { CompetitionStageResponseSchema } from "./schemas/competition-stage.schema.js";

const operatorOptions = operator();
export type FilterOperator = (typeof operatorOptions)[number]["key"];

export interface SendingFilter {
  field: string;
  operator: FilterOperator;
  value?: string | number | boolean | Date | string[];
  logic: "AND" | "OR";
  editByAdmin?: boolean;
}

// 共通の基本型
export type BaseField = {
  key: string;
  label: string;
  type: "string" | "number" | "Date" | "select" | "checkbox" | "datetime-local";
};

// フィルター用
export type FilterField = {
  filterable?: boolean;
  value?: (string | number | Date | boolean)[];
  valueLabel?: (string | number | Date | boolean)[];
  operator?: FilterOperator;
  logic?: "AND" | "OR";
};

// ソート用
export type SortField = {
  sortable: boolean;
  asc?: boolean | null;
};

export type FilterableFieldDefinition = BaseField & FilterField;
export type SortableFieldDefinition = BaseField & SortField;

export type PopulatePath = {
  path: string;
  collection?: string;
  matchBefore?: boolean;
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
  team: z.infer<typeof TeamResponseSchema>;
  player: z.infer<typeof PlayerResponseSchema>;
  country: z.infer<typeof CountryResponseSchema>;
  nationalMatchSeries: z.infer<typeof NationalMatchSeriesResponseSchema>;
  competition: z.infer<typeof CompetitionResponseSchema>;
  season: z.infer<typeof SeasonResponseSchema>;
  competitionStage: z.infer<typeof CompetitionStageResponseSchema>;
}

export interface ControllerConfig<
  _TDoc,
  TData,
  TForm = TData,
  TResponse = TData,
  TPopulated = TData
> {
  name: string;
  SCHEMA: {
    DATA: z.ZodType<TData>;
    FORM: z.ZodType<TForm>;
    POPULATED: z.ZodType<TPopulated>;
    RESPONSE: z.ZodType<TResponse>;
  };
  TYPE: TData;
  MONGO_MODEL: any | null;
  POPULATE_PATHS: PopulatePath[];
  getAllConfig?: GetAllQuery & { sort?: Record<string, 1 | -1> } & {
    project?: Record<string, 0 | 1>;
  };
  bulk?: boolean;
  download?: boolean;
  TEST: {
    sampleData: TForm[] | ((deps: DependencyRefs) => TForm[]);
    updatedData: Partial<TForm>;
    testDataPath?: string;
  };
  convertFun?: (data: TPopulated) => TResponse;
}
