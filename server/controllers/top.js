import { StatusCodes } from "http-status-codes";
import { Transfer } from "../models/transfer.js";
import { Injury } from "../models/injury.js";
import { formatTransfer, formatInjury } from "../utils/format/index.js";

const getTopPageData = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
  if (isNaN(limit) || limit <= 0) {
    limit = undefined;
  }

  let transferQuery = Transfer.find({}).sort({ doa: -1, _id: -1 });
  let injuryQuery = Injury.find({}).sort({ doa: -1, _id: -1 });

  if (limit !== undefined) {
    transferQuery = transferQuery.limit(limit);
  }
  if (limit !== undefined) {
    injuryQuery = injuryQuery.limit(limit);
  }

  const transfers = await transferQuery
    .populate("from_team")
    .populate("to_team")
    .populate("player");
  const injuries = await injuryQuery.populate("player").populate("team");

  const formattedTransfers = transfers.map(formatTransfer);
  const formattedInjuries = injuries.map(formatInjury);

  res
    .status(StatusCodes.OK)
    .json({ transferData: formattedTransfers, injuryData: formattedInjuries });
};

export { getTopPageData };
