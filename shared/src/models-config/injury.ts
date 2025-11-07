import z from "zod";
import {
  InjuryZodSchema,
  InjuryType,
  InjuryFormSchema,
  InjuryResponseSchema,
  InjuryPopulatedSchema,
} from "../schemas/injury.schema.js";

import { injury as convertFun } from "../utils/format/injury.js";
import { ControllerConfig, DependencyRefs } from "../types.js";

export function injury<TDoc = any, TModel = any>(
  mongoModel?: TModel
): ControllerConfig<
  TDoc,
  InjuryType,
  z.infer<typeof InjuryFormSchema>,
  z.infer<typeof InjuryResponseSchema>,
  z.infer<typeof InjuryPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "injury",
    SCHEMA: {
      DATA: InjuryZodSchema,
      FORM: InjuryFormSchema,
      RESPONSE: InjuryResponseSchema,
      POPULATED: InjuryPopulatedSchema,
    },
    TYPE: {} as InjuryType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "player", collection: "players" },
      { path: "now_team", collection: "teams" },
      { path: "team", collection: "teams" },
    ],
    getAllConfig: {
      query: [
        { field: "player", type: "ObjectId" },
        { field: "team", type: "ObjectId" },
        { field: "now_team", type: "ObjectId" },
        { field: "doa", type: "Date" },
        { field: "limit", type: "Number" },
      ],
      sort: { doa: -1, _id: 1 },
    },
    bulk: false,
    download: false,
    TEST: {
      sampleData: (deps: DependencyRefs) => [
        {
          doa: new Date("2030/07/22"),
          team: deps.team._id,
          player: deps.player._id,
          doi: new Date("2025/07/12"),
          injured_part: ["膝"],
          ttp: ["1d"],
          is_injured: true,
        },
      ],
      updatedData: {
        is_injured: false,
      },
    },
    convertFun: convertFun,
  };
}
