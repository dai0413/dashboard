import z from "zod";
import { PlayerModel, IPlayer } from "../mongose/player";
import {
  PlayerZodSchema,
  PlayerType,
  PlayerFormSchema,
  PlayerResponseSchema,
  PlayerPopulatedSchema,
} from "../schemas/player.schema";
import { ControllerConfig } from "../types";
// import { createPath } from "../utils/createPath";

export const player: ControllerConfig<
  IPlayer,
  PlayerType,
  z.infer<typeof PlayerFormSchema>,
  z.infer<typeof PlayerResponseSchema>,
  z.infer<typeof PlayerPopulatedSchema>
> = {
  name: "player",
  SCHEMA: {
    DATA: PlayerZodSchema,
    FORM: PlayerFormSchema,
    RESPONSE: PlayerResponseSchema,
    POPULATED: PlayerPopulatedSchema,
  },
  TYPE: {} as PlayerType,
  MONGO_MODEL: PlayerModel,
  POPULATE_PATHS: [],
  getAllConfig: {
    query: [{ field: "country", type: "ObjectId" }],
    sort: { _id: 1 },
  },
  bulk: true,
  download: true,
  TEST: {
    sampleData: [
      {
        name: "test_name",
        en_name: "test",
      },
      {
        name: "test_name_2",
        en_name: "test_2",
        dob: new Date("2025/08/01"),
      },
      {
        name: "test_name_3",
        en_name: "test_3",
        dob: new Date("2025/08/01"),
        pob: "東京都",
      },
    ],
    updatedData: {
      name: "updated_name",
    },
    // testDataPath: createPath("player"),
  },
};
