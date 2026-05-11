import { Request, Response } from "express";

import { getCurrentLoanPlayersByTeamService } from "../../services/index.js";
import { transfer } from "@dai0413/myorg-shared/models-config";
import { StatusCodes } from "http-status-codes";

export const getCurrentLoanPlayersByTeam = async (
  req: Request,
  res: Response,
) => {
  const teamId = req.params.teamId;
  if (typeof teamId !== "string") return res.status(StatusCodes.BAD_REQUEST);
  const result = await getCurrentLoanPlayersByTeamService(teamId);

  const convertFun = transfer().convertFun;
  if (!convertFun) console.error("error convert fun");
  const formattedTransfers = convertFun ? result.map(convertFun) : [];

  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};
