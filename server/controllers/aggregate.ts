import { Request, Response } from "express";
import { transfer as formatTransfer } from "../utils/format/transfer.js";

import {
  getCurrentPlayersByTeamService,
  getCurrentLoanPlayersByTeamService,
  getNoNumberService,
  getNoCallUpService,
} from "../services/index.js";

import { StatusCodes } from "http-status-codes";

interface CurrentPlayersQuery {
  teamId?: string;
  from_date_from?: string;
  from_date_to?: string;
}

const getCurrentPlayersByTeam = async (
  req: Request<unknown, unknown, unknown, CurrentPlayersQuery>,
  res: Response
) => {
  const { teamId, from_date_from, from_date_to } = req.query;

  const result = await getCurrentPlayersByTeamService(
    teamId ?? null,
    from_date_from ?? null,
    from_date_to ?? null
  );

  const formattedTransfers = result.map(formatTransfer);
  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};

const getCurrentLoanPlayersByTeam = async (req: Request, res: Response) => {
  const teamId = req.params.teamId;
  const result = await getCurrentLoanPlayersByTeamService(teamId);

  const formattedTransfers = result.map(formatTransfer);
  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};

const getNoNumberByCountry = async (req: Request, res: Response) => {
  try {
    const result: ResponseDatas = await getNoNumberService(req);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Error in getNoNumberByCountry:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "サーバーエラー",
      errors: error,
    });
  }
};

interface ResponseDatas {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
}

const getNoCallUp = async (req: Request, res: Response) => {
  try {
    console.log("in server receive page", req.query.page);
    const result: ResponseDatas = await getNoCallUpService(req);
    console.log("in server page", result.page);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Error in getNoCallUp:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "サーバーエラー",
      errors: error,
    });
  }
};

export {
  getCurrentPlayersByTeam,
  getCurrentLoanPlayersByTeam,
  getNoNumberByCountry,
  getNoCallUp,
};
