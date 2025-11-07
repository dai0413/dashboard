// import mongoose from "mongoose";
// import z from "zod";
// import { ParsedQs } from "qs";
// import { TeamResponseSchema } from "../../../shared/dist/schemas/team.schema.ts";
// import { PlayerResponseSchema } from "../../../shared/dist/schemas/player.schema.ts";
// import { CountryResponseSchema } from "../../../shared/dist/schemas/country.schema.ts";
// import { NationalMatchSeriesResponseSchema } from "../../../shared/dist/schemas/national-match-series.schema.ts";
// import { CompetitionResponseSchema } from "../../../shared/dist/schemas/competition.schema.ts";
// import { SeasonResponseSchema } from "../../../shared/dist/schemas/season.schema.ts";
// import { CompetitionStageResponseSchema } from "../../../shared/dist/schemas/competition-stage.schema.ts";
// export type PopulatePath = {
//   path: string;
//   collection?: string;
//   matchBefore?: boolean;
// };

// export type GetAllQuery = {
//   query?: {
//     field: string;
//     type: "ObjectId" | "String" | "Number" | "Date" | "Boolean";
//     populateAfter?: boolean;
//   }[];
//   buildCustomMatch?: (query: ParsedQs) => Record<string, any>;
// };

// export interface DependencyRefs {
//   team: z.infer<typeof TeamResponseSchema>;
//   player: z.infer<typeof PlayerResponseSchema>;
//   country: z.infer<typeof CountryResponseSchema>;
//   nationalMatchSeries: z.infer<typeof NationalMatchSeriesResponseSchema>;
//   competition: z.infer<typeof CompetitionResponseSchema>;
//   season: z.infer<typeof SeasonResponseSchema>;
//   competitionStage: z.infer<typeof CompetitionStageResponseSchema>;
// }

// export interface ControllerConfig<
//   TDoc,
//   TData,
//   TForm = TData,
//   TResponse = TData,
//   TPopulated = TData
// > {
//   name: string;
//   SCHEMA: {
//     DATA: z.ZodType<TData>;
//     FORM: z.ZodType<TForm>;
//     POPULATED: z.ZodType<TPopulated>;
//     RESPONSE: z.ZodType<TResponse>;
//   };
//   TYPE: TData;
//   MONGO_MODEL: mongoose.Model<TDoc>;
//   POPULATE_PATHS: PopulatePath[];
//   getAllConfig?: GetAllQuery & { sort?: Record<string, 1 | -1> } & {
//     project?: Record<string, 0 | 1>;
//   };
//   bulk?: boolean;
//   download?: boolean;
//   TEST: {
//     sampleData: TForm[] | ((deps: DependencyRefs) => TForm[]);
//     updatedData: Partial<TForm>;
//     testDataPath?: string;
//   };
//   convertFun?: (data: TPopulated) => TResponse;
// }
