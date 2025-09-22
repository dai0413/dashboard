const { formatTransfer, formatNationalCallup } = require("../utils/format");

const {
  getCurrentPlayersByTeamService,
  getCurrentLoanPlayersByTeamService,
  getNoNumberService,
  getNoCallUpService,
} = require("../services");
const { StatusCodes } = require("http-status-codes");

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
  const countryId = req.params.countryId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const result = await getNoNumberService(countryId, startDate, endDate);

  const formattedTransfers = result.map(formatTransfer);
  res.status(StatusCodes.OK).json({ data: formattedTransfers });
};

const getNoCallUp = async (req, res) => {
  const countryId = req.params.countryId;

  const result = await getNoCallUpService(countryId);

  const formattedCallUp = result.map(formatNationalCallup);
  res.status(StatusCodes.OK).json({ data: formattedCallUp });
};

module.exports = {
  getCurrentPlayersByTeam,
  getCurrentLoanPlayersByTeam,
  getNoNumberByCountry,
  getNoCallUp,
};
