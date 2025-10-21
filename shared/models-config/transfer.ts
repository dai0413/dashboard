import z from "zod";
import { TransferModel, ITransfer } from "../../server/models/transfer.ts";
import {
  TransferZodSchema,
  TransferType,
  TransferFormSchema,
  TransferResponseSchema,
  TransferPopulatedSchema,
} from "../schemas/transfer.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";
import { transfer as convertFun } from "../../server/utils/format/transfer.ts";
import { transfer as customMatch } from "../../server/modelsConfig/utils/customMatch/transfer.ts";

export const transfer: ControllerConfig<
  ITransfer,
  TransferType,
  z.infer<typeof TransferFormSchema>,
  z.infer<typeof TransferResponseSchema>,
  z.infer<typeof TransferPopulatedSchema>
> = {
  name: "transfer",
  SCHEMA: {
    DATA: TransferZodSchema,
    FORM: TransferFormSchema,
    RESPONSE: TransferResponseSchema,
    POPULATED: TransferPopulatedSchema,
  },
  TYPE: {} as TransferType,
  MONGO_MODEL: TransferModel,
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
    ],
    buildCustomMatch: customMatch,
    sort: { doa: -1, _id: -1 },
  },
  bulk: false,
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
