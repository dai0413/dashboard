import z from "zod";
import {
  TransferZodSchema,
  TransferType,
  TransferFormSchema,
  TransferResponseSchema,
  TransferPopulatedSchema,
} from "../schemas/transfer.schema.js";
import { ControllerConfig } from "../types.js";
import { transfer as convertFun } from "../utils/format/transfer.js";
import { ParsedQs } from "qs";

export function transfer<TDoc = any, TModel = any>(
  mongoModel?: TModel,
  customMatchFn?: (query: ParsedQs) => Record<string, any>
): ControllerConfig<
  TDoc,
  TransferType,
  z.infer<typeof TransferFormSchema>,
  z.infer<typeof TransferResponseSchema>,
  z.infer<typeof TransferPopulatedSchema>
> & { MONGO_MODEL: TModel | null } {
  return {
    name: "transfer",
    SCHEMA: {
      DATA: TransferZodSchema,
      FORM: TransferFormSchema,
      RESPONSE: TransferResponseSchema,
      POPULATED: TransferPopulatedSchema,
    },
    TYPE: {} as TransferType,
    MONGO_MODEL: mongoModel ?? null,
    POPULATE_PATHS: [
      { path: "from_team", collection: "teams" },
      { path: "to_team", collection: "teams" },
      { path: "player", collection: "players" },
    ],
    getAllConfig: {
      query: [
        { field: "player", type: "ObjectId" },
        { field: "from_team", type: "ObjectId" },
        { field: "to_team", type: "ObjectId" },
        { field: "from_date", type: "Date" },
        { field: "to_date", type: "Date" },
        { field: "from_team.age_group", type: "String", populateAfter: true },
        { field: "form", type: "String" },
      ],
      buildCustomMatch: customMatchFn,
      sort: { doa: -1, _id: -1 },
    },
    bulk: true,
    download: false,
    TEST: {
      sampleData: (deps) => [
        {
          doa: new Date("2030/07/22"),
          from_team_name: "original team",
          player: deps.player._id,
          position: ["GK"],
          form: "完全",
          from_date: new Date("2025/07/12"),
        },
        {
          doa: new Date("2030/07/28"),
          to_team: deps.team._id,
          player: deps.player._id,
          position: ["GK"],
          form: "完全",
          from_date: new Date("2025/07/12"),
        },
        {
          doa: new Date("2030/08/01"),
          from_team: deps.team._id,
          player: deps.player._id,
          position: ["GK"],
          form: "完全",
          from_date: new Date("2025/07/12"),
        },
      ],
      updatedData: {
        form: "期限付き",
      },
    },
    convertFun: convertFun,
  };
}
