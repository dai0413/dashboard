import { formatTransfer, formatNationalCallup } from "../utils/format/index.js";

import {
  getCurrentPlayersByTeamService,
  getCurrentLoanPlayersByTeamService,
  getNoNumberService,
  getNoCallUpService,
} from "../services/index.js";

import { StatusCodes } from "http-status-codes";

const getCurrentPlayersByTeam = async (req, res) => {
  const teamId = req.params.teamId;
  const from_date_from = req.query.from_date_from;
  const from_date_to = req.query.from_date_to;

  const result = await getCurrentPlayersByTeamService(
    teamId,
    from_date_from,
    from_date_to
  );

  const formattedTransfers = result.map(formatTransfer);
  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};

const getCurrentLoanPlayersByTeam = async (req, res) => {
  const teamId = req.params.teamId;
  const result = await getCurrentLoanPlayersByTeamService(teamId);

  const formattedTransfers = result.map(formatTransfer);
  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};

const getNoNumberByCountry = async (req, res) => {
  const { startDate, endDate } = req.query;

  // competition を配列に正規化
  let competitions = req.query.competition;
  if (competitions) {
    if (typeof competitions === "string") {
      competitions = competitions.split(","); // comp1,comp2 形式
    }
  } else {
    competitions = [];
  }

  const result = await getNoNumberService(competitions, startDate, endDate);

  const formattedTransfers = result.map(formatTransfer);
  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};

const getNoCallUp = async (req, res) => {
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
