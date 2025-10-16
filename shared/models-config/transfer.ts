import z from "zod";
import { TransferModel, ITransfer } from "../../server/models/transfer.ts";
import {
  TransferZodSchema,
  TransferType,
  TransferFormSchema,
  TransferResponseSchema,
} from "../schemas/transfer.schema.ts";
import { ControllerConfig } from "../../server/modelsConfig/types/type.ts";

export const transfer: ControllerConfig<
  ITransfer,
  TransferType,
  z.infer<typeof TransferFormSchema>,
  z.infer<typeof TransferResponseSchema>
> = {
  name: "transfer",
  SCHEMA: {
    DATA: TransferZodSchema,
    FORM: TransferFormSchema,
    RESPONSE: TransferResponseSchema,
  },
  TYPE: {} as TransferType,
  MONGO_MODEL: TransferModel,
  POPULATE_PATHS: [
    { path: "from_team", collection: "teams" },
    { path: "to_team", collection: "teams" },
    { path: "player", collection: "players" },
  ],
  getALL: {
    query: [
      { field: "player", type: "ObjectId" },
      { field: "from_team", type: "ObjectId" },
      { field: "to_team", type: "ObjectId" },
    ],
    sort: { doa: -1, _id: -1 },
  },
  bulk: false,
  download: false,
  TEST: {
    sampleData: [
      {
        doa: new Date("2030/07/22"),
        from_team_name: "original team",
        player: "68516bd288294f93ffd0b562",
        position: ["GK"],
        form: "完全",
        from_date: new Date("2025/07/12"),
      },
    ],
    updatedData: {
      form: "期限付き移籍",
    },
  },
};

// getAll: {
//   buildCustomMatch: (req) => {
//     const matchStage = {};
//     if (req.query.team) {
//       matchStage.$or = [
//         { from_team: new mongoose.Types.ObjectId(req.query.team) },
//         { to_team: new mongoose.Types.ObjectId(req.query.team) },
//       ];
//     }
//     if (req.query.form) {
//       const isNegated = req.query.form.startsWith("!");
//       const values = (
//         isNegated ? req.query.form.slice(1) : req.query.form
//       ).split(",");
//       matchStage.form = isNegated ? { $nin: values } : { $in: values };
//     }
//     if (req.query.from_date_gte)
//       matchStage.from_date = { $gte: new Date(req.query.from_date_gte) };
//     if (req.query.to_date_before)
//       matchStage.to_date = { $lte: new Date(req.query.to_date_before) };
//     return matchStage;
//   },
// },
