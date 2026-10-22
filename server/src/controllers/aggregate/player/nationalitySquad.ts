import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getNationalitySquad as aggregate } from "../../../services/index.js";

export const getNationalitySquad = async (req: Request, res: Response) => {
  const result = await aggregate(req);
  res.status(StatusCodes.OK).json(result);
};
