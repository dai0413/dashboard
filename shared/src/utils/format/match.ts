// import z from "zod";
// import {
//   MatchResponseSchema,
//   MatchPopulatedSchema,
// } from "../../schemas/match.schema";

// const match = (
//   match: z.infer<typeof MatchPopulatedSchema>
// ): z.infer<typeof MatchResponseSchema> => {
//   const { stadium, stadium_name, ...rest } = match;

//   return {
//     ...rest,
//     stadium: stadium_name
//       ? {
//           name: stadium_name,
//         }
//       : stadium,
//   };
// };

// export { match };
