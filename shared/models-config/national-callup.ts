import z from "zod";
import {
  NationalCallUpModel,
  INationalCallUp,
} from "../../server/models/national-callup.ts";
import {
  NationalCallUpZodSchema,
  NationalCallUpType,
  NationalCallUpFormSchema,
  NationalCallUpResponseSchema,
} from "../schemas/national-callup.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const nationalCallUp: ControllerConfig<
  INationalCallUp,
  NationalCallUpType,
  z.infer<typeof NationalCallUpFormSchema>,
  z.infer<typeof NationalCallUpResponseSchema>
> = {
  name: "national-callup",
  SCHEMA: {
    DATA: NationalCallUpZodSchema,
    FORM: NationalCallUpFormSchema,
    RESPONSE: NationalCallUpResponseSchema,
  },
  TYPE: {} as NationalCallUpType,
  MONGO_MODEL: NationalCallUpModel,
  POPULATE_PATHS: [
    { path: "series", collection: "nationalmatchseries" },
    { path: "player", collection: "players" },
    { path: "team", collection: "teams" },
  ],
  getALL: {
    query: [{ field: "country", type: "ObjectId" }],
    sort: { _id: 1 },
  },
  bulk: true,
  download: false,
  TEST: {
    sampleData: [
      {
        series: "688ea1a826c9a7f800b7f716",
        player: "68516bd288294f93ffd0d3ae",
        team: "685fe9e1bdafffc53f4719f9",
        is_captain: false,
        is_overage: false,
        is_backup: false,
        is_training_partner: false,
        is_additional_call: false,
        status: "joined",
      },
    ],
    updatedData: {
      is_captain: true,
    },
  },
};
