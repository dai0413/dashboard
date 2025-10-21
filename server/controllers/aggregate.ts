import { Request, Response } from "express";
import { transfer as formatTransfer } from "../utils/format/transfer.ts";
import { nationalCallup as formatNationalCallup } from "../utils/format/national-callup.ts";

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

interface NoNumberQuery {
  startDate?: string;
  endDate?: string;
  competition?: string | string[];
}

const getNoNumberByCountry = async (
  req: Request<unknown, unknown, unknown, NoNumberQuery>,
  res: Response
) => {
  try {
    const { startDate, endDate } = req.query;
    let { competition } = req.query;

    // competition を配列に正規化
    let competitions: string[] = [];
    if (competition) {
      competitions = Array.isArray(competition)
        ? competition
        : competition.split(",");
    }

    // サービス呼び出し
    const result = await getNoNumberService(
      competitions,
      startDate ?? null,
      endDate ?? null
    );

    // フォーマット処理
    const formattedTransfers = result.map(formatTransfer);

    res.status(StatusCodes.OK).json({ data: formattedTransfers });
  } catch (error) {
    console.error("Error in getNoNumberByCountry:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch data",
      error:
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error,
    });
  }
};

const getNoCallUp = async (req: Request, res: Response) => {
  const countryId = req.params.countryId;

  const result = await getNoCallUpService(countryId);

  const formattedCallUp = result.map(formatNationalCallup);
  res.status(StatusCodes.OK).json({ data: formattedCallUp });
};

export {
  getCurrentPlayersByTeam,
  getCurrentLoanPlayersByTeam,
  getNoNumberByCountry,
  getNoCallUp,
};
