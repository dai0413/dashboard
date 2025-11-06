import z from "zod";
import {
  NationalCallUpModel,
  INationalCallUp,
} from "../mongose/national-callup";
import {
  NationalCallUpZodSchema,
  NationalCallUpType,
  NationalCallUpFormSchema,
  NationalCallUpResponseSchema,
  NationalCallUpPopulatedSchema,
} from "../schemas/national-callup.schema";
import { ControllerConfig } from "../types";
import { nationalCallup as convertFun } from "../utils/format/national-callup";

export const nationalCallUp: ControllerConfig<
  INationalCallUp,
  NationalCallUpType,
  z.infer<typeof NationalCallUpFormSchema>,
  z.infer<typeof NationalCallUpResponseSchema>,
  z.infer<typeof NationalCallUpPopulatedSchema>
> = {
  name: "national-callup",
  SCHEMA: {
    DATA: NationalCallUpZodSchema,
    FORM: NationalCallUpFormSchema,
    RESPONSE: NationalCallUpResponseSchema,
    POPULATED: NationalCallUpPopulatedSchema,
  },
  TYPE: {} as NationalCallUpType,
  MONGO_MODEL: NationalCallUpModel,
  POPULATE_PATHS: [
    {
      path: "series",
      collection: "nationalmatchseries",
    },
    { path: "player", collection: "players" },
    { path: "team", collection: "teams" },
  ],
  getAllConfig: {
    query: [
      { field: "player", type: "ObjectId" },
      { field: "series", type: "ObjectId" },
      { field: "series.country", type: "ObjectId", populateAfter: true },
    ],
    sort: {
      series: -1,
      position_group_order: 1,
      number: 1,
      _id: -1,
    },
    project: { position_group_order: 0 },
  },
  bulk: true,
  download: false,
  TEST: {
    sampleData: (deps) => [
      {
        series: deps.nationalMatchSeries._id,
        player: deps.player._id,
        team: deps.team._id,
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
  convertFun: convertFun,
};
