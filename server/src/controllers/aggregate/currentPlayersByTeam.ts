import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { transfer } from "@dai0413/myorg-shared/models-config";
import { getCurrentPlayersByTeamService } from "../../services/index.js";

interface CurrentPlayersQuery {
  teamId?: string;
  from_date_from?: string;
  from_date_to?: string;
}

export const getCurrentPlayersByTeam = async (
  req: Request<unknown, unknown, unknown, CurrentPlayersQuery>,
  res: Response,
) => {
  const { teamId, from_date_from, from_date_to } = req.query;

  const result = await getCurrentPlayersByTeamService(
    teamId ?? null,
    from_date_from ?? null,
    from_date_to ?? null,
  );

  const convertFun = transfer().convertFun;
  if (!convertFun) console.error("error convert fun");
  const formattedTransfers = convertFun ? result.map(convertFun) : [];

  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};
