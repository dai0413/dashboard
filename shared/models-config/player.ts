import z from "zod";
import { PlayerModel, IPlayer } from "../../server/models/player.ts";
import {
  PlayerZodSchema,
  PlayerType,
  PlayerFormSchema,
  PlayerResponseSchema,
} from "../schemas/player.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";
import { createPath } from "../../server/modelsConfig/utils/createPath.ts";

export const player: ControllerConfig<
  IPlayer,
  PlayerType,
  z.infer<typeof PlayerFormSchema>,
  z.infer<typeof PlayerResponseSchema>
> = {
  name: "player",
  SCHEMA: {
    DATA: PlayerZodSchema,
    FORM: PlayerFormSchema,
    RESPONSE: PlayerResponseSchema,
  },
  TYPE: {} as PlayerType,
  MONGO_MODEL: PlayerModel,
  POPULATE_PATHS: [],
  getALL: {
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
    testDataPath: createPath("player"),
  },
};
