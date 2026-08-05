import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPlayerStatistics as aggregatePlayerStatistics } from "../../../services/index.js";

export const getPlayerStatistics = async (req: Request, res: Response) => {
  const result = await aggregatePlayerStatistics(req);
  res.status(StatusCodes.OK).json(result);
};
