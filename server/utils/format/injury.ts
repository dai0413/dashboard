// import z from "zod";
// import {
//   InjuryResponseSchema,
//   InjuryPopulatedSchema,
// } from "../../../shared/dist/schemas/injury.schema.ts";

// const injury = (
//   injuryDoc: z.infer<typeof InjuryPopulatedSchema>
// ): z.infer<typeof InjuryResponseSchema> => {
//   const { team, team_name, ...rest } = injuryDoc;

//   return {
//     ...rest,
//     team: team_name
//       ? {
//           team: team_name,
//         }
//       : team,
//   };
// };

// export { injury };
