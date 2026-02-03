import { Request, Response } from "express";

import { getCurrentLoanPlayersByTeamService } from "../../services/index.js";
import { transfer } from "@dai0413/myorg-shared";
import { StatusCodes } from "http-status-codes";

export const getCurrentLoanPlayersByTeam = async (
  req: Request,
  res: Response,
) => {
  const teamId = req.params.teamId;
  const result = await getCurrentLoanPlayersByTeamService(teamId);

  const convertFun = transfer().convertFun;
  if (!convertFun) console.error("error convert fun");
  const formattedTransfers = convertFun ? result.map(convertFun) : [];

  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};
