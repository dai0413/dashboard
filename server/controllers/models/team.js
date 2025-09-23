const Team = require("../models/team");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllTeams = async (req, res) => {
  const teams = await Team.find({}).populate("country");

  res.status(StatusCodes.OK).json({ data: teams });
};

const createTeam = async (req, res) => {
  const teamData = {
    ...req.body,
  };

  const team = await Team.create(teamData);
  const populatedData = await Team.findById(team._id).populate("country");
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: populatedData });
};

const getTeam = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: teamId },
  } = req;
  const team = await Team.findById(teamId).populate("country");
  if (!team) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({
    data: {
      ...team.toObject(),
    },
  });
};

const updateTeam = async (req, res) => {
  // if (!req.params.id || !req.body.team || !req.body.team) {
  //   throw new BadRequestError();
  // }
  const {
    params: { id: teamId },
    body,
  } = req;

  const updatedData = { ...body };

  const updated = await Team.findByIdAndUpdate({ _id: teamId }, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new NotFoundError();
  }

  // update
  const populated = await Team.findById(updated._id).populate("country");
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteTeam = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: teamId },
  } = req;

  const team = await Team.findOneAndDelete({ _id: teamId });
  if (!team) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

const downloadTeam = async (req, res) => {
  try {
    const teams = await Team.find();
    if (teams.length === 0) {
      return res.status(404).json({ message: "データがありません" });
    }

    const header = `"id","team","abbr","enTeam","country","genre","jdataid","labalph","transferurl","sofaurl"\n`;

    const csvContent = teams
      .map((team) => {
        return `"${team._id}","${team.team}","${team.abbr}","${team.enTeam}","${team.country}","${team.genre}","${team.jdataid}","${team.labalph}","${team.transferurl},"${team.sofaurl}""`;
      })
      .join("\n");

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("teams.csv");
    res.status(StatusCodes.OK).send("\uFEFF" + header + csvContent); // 先頭にBOMをつけてExcel文字化け防止
  } catch (err) {
    console.error("CSV出力エラー:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "CSV出力に失敗しました" });
  }
};

module.exports = {
  getAllTeams,
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
  downloadTeam,
};
