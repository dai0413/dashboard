// import z from "zod";
// import {
//   TeamCompetitionSeasonModel,
//   ITeamCompetitionSeason,
// } from "../mongose/team-competition-season";
// import {
//   TeamCompetitionSeasonZodSchema,
//   TeamCompetitionSeasonType,
//   TeamCompetitionSeasonFormSchema,
//   TeamCompetitionSeasonResponseSchema,
//   TeamCompetitionSeasonPopulatedSchema,
// } from "../schemas/team-competition-season.schema";
// import { ControllerConfig } from "../types";

// export const teamCompetitionSeason: ControllerConfig<
//   ITeamCompetitionSeason,
//   TeamCompetitionSeasonType,
//   z.infer<typeof TeamCompetitionSeasonFormSchema>,
//   z.infer<typeof TeamCompetitionSeasonResponseSchema>,
//   z.infer<typeof TeamCompetitionSeasonPopulatedSchema>
// > = {
//   name: "team-competition-season",
//   SCHEMA: {
//     DATA: TeamCompetitionSeasonZodSchema,
//     FORM: TeamCompetitionSeasonFormSchema,
//     RESPONSE: TeamCompetitionSeasonResponseSchema,
//     POPULATED: TeamCompetitionSeasonPopulatedSchema,
//   },
//   TYPE: {} as TeamCompetitionSeasonType,
//   MONGO_MODEL: TeamCompetitionSeasonModel,
//   POPULATE_PATHS: [
//     { path: "team", collection: "teams" },
//     { path: "season", collection: "seasons" },
//     { path: "competition", collection: "competitions" },
//   ],
//   getAllConfig: {
//     query: [
//       { field: "team", type: "ObjectId" },
//       {
//         field: "competition",
//         type: "ObjectId",
//       },
//       {
//         field: "season",
//         type: "ObjectId",
//       },
//       {
//         field: "competition.category",
//         type: "String",
//         populateAfter: true,
//       },
//       {
//         field: "competition.level",
//         type: "String",
//         populateAfter: true,
//       },
//     ],
//     sort: { "season.start_date": -1, _id: -1 },
//   },
//   bulk: false,
//   download: false,
//   TEST: {
//     sampleData: (deps) => [
//       {
//         team: deps.team._id,
//         season: deps.season._id,
//       },
//       {
//         team: deps.team._id,
//         season: deps.season._id,
//       },
//       {
//         team: deps.team._id,
//         season: deps.season._id,
//       },
//     ],
//     updatedData: {
//       note: "memo",
//     },
//   },
// };
