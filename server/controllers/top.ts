import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TransferModel } from "../models/transfer.ts";
import { InjuryModel } from "../models/injury.ts";
import { transfer as formatTransfer } from "../utils/format/transfer.ts";
import { injury as formatInjury } from "../utils/format/injury.ts";
import {
  TransferPopulatedSchema,
  TransferResponseSchema,
} from "../../shared/schemas/transfer.schema.ts";
import {
  InjuryPopulatedSchema,
  InjuryResponseSchema,
} from "../../shared/schemas/injury.schema.ts";

const getTopPageData = async (req: Request, res: Response) => {
  let limit: number | undefined = req.query.limit
    ? parseInt(req.query.limit as string, 10)
    : 5;
  if (isNaN(limit) || limit <= 0) {
    limit = undefined;
  }

  let transferQuery = TransferModel.find({}).sort({ doa: -1, _id: -1 });
  let injuryQuery = InjuryModel.find({}).sort({ doa: -1, _id: -1 });

  if (limit !== undefined) {
    transferQuery = transferQuery.limit(limit);
  }
  if (limit !== undefined) {
    injuryQuery = injuryQuery.limit(limit);
  }

  const populatedTransfer = await transferQuery
    .populate("from_team")
    .populate("to_team")
    .populate("player");
  const parsedTransfer = TransferPopulatedSchema.parse(populatedTransfer);
  const responseTransfer = TransferResponseSchema.parse(
    formatTransfer(parsedTransfer)
  );

  const populatedInjuries = await injuryQuery
    .populate("player")
    .populate("team");
  const parsedInjuries = InjuryPopulatedSchema.parse(populatedInjuries);
  const responseInjuries = InjuryResponseSchema.parse(
    formatInjury(parsedInjuries)
  );

  res
    .status(StatusCodes.OK)
    .json({ transferData: responseTransfer, injuryData: responseInjuries });
};

export { getTopPageData };
