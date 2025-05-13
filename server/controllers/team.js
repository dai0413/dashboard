const Team = require("../models/team");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllTeams = async (req, res) => {
  const teams = await Team.find({});
  res.status(StatusCodes.OK).json({ data: teams });
};

module.exports = { getAllTeams };
