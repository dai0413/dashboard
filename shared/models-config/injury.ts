import z from "zod";
import { InjuryModel, IInjury } from "../../server/models/injury.ts";
import {
  InjuryZodSchema,
  InjuryType,
  InjuryFormSchema,
  InjuryResponseSchema,
  InjuryPopulatedSchema,
} from "../schemas/injury.schema.ts";
import {
  ControllerConfig,
  DependencyRefs,
} from "../../server/modelsConfig/types/type.ts";
import { injury as convertFun } from "../../server/utils/format/injury.ts";

export const injury: ControllerConfig<
  IInjury,
  InjuryType,
  z.infer<typeof InjuryFormSchema>,
  z.infer<typeof InjuryResponseSchema>,
  z.infer<typeof InjuryPopulatedSchema>
> = {
  name: "injury",
  SCHEMA: {
    DATA: InjuryZodSchema,
    FORM: InjuryFormSchema,
    RESPONSE: InjuryResponseSchema,
    POPULATED: InjuryPopulatedSchema,
  },
  TYPE: {} as InjuryType,
  MONGO_MODEL: InjuryModel,
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
    sort: { _id: 1 },
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
