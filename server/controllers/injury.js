const Injury = require("../models/injury");
const Transfer = require("../models/transfer");
const Player = require("../models/player");
const Team = require("../models/team");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllInjury = async (req, res) => {
  const injuries = await Injury.find()
    .populate("player")
    .populate("team")
    .populate("now_team");

  const enrichedInjuries = await Promise.all(
    injuries.map(async (injury) => {
      const latestTransfer = await Transfer.findOne({
        player: injury.player._id,
        to_team: { $ne: null },
      })
        .sort({ from_date: -1 })
        .limit(1);

      const now_team = latestTransfer ? latestTransfer.to_team : null;

      return {
        ...injury.toObject(),
        now_team,
      };
    })
  );

  res.status(StatusCodes.OK).json({ data: enrichedInjuries });
};

const createInjury = async (req, res) => {
  console.log("create injury");
  if (!req.body.team || !req.body.player) {
    throw new BadRequestError();
  }
  const { team, player } = req.body;

  let teamId = null;
  if (team) {
    if (!mongoose.Types.ObjectId.isValid(team)) {
      throw new BadRequestError("team の ID が不正です。");
    }
    const teamObj = await Team.findById(team);
    if (!teamObj) {
      throw new BadRequestError("team が見つかりません。");
    }
    teamId = teamObj._id;
  }

  let playerId = null;
  console.log("player id ", player);
  if (player) {
    if (!mongoose.Types.ObjectId.isValid(player)) {
      throw new BadRequestError("player の ID が不正です。");
    }
    const playerObj = await Player.findById(player);
    if (!playerObj) {
      throw new BadRequestError("player が見つかりません。");
    }
    playerId = playerObj._id;
  }

  const now_teamObj = await Transfer.findOne({
    player: playerId,
    to_team: { $ne: null }, // to_team が null でない
  })
    .sort({ from_date: -1 }) // 最新
    .limit(1);

  const injuryData = {
    ...req.body,
    team: teamId,
    now_team: now_teamObj ? now_teamObj.to_team : null,
    player: playerId,
  };

  const injury = await Injury.create(injuryData);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: injury });
};

const getInjury = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: injuryId },
  } = req;
  const injury = await Injury.findById(injuryId)
    .populate("player")
    .populate("team")
    .populate("now_team");
  if (!injury) {
    throw new NotFoundError();
  }

  const latestTransfer = await Transfer.findOne({
    player: injury.player._id,
    to_team: { $ne: null },
  })
    .sort({ from_date: -1 })
    .limit(1);

  const now_team = latestTransfer ? latestTransfer.to_team : null;

  res.status(StatusCodes.OK).json({
    data: {
      ...injury.toObject(),
      now_team,
    },
  });
};

const updateInjury = async (req, res) => {
  // if (!req.params.id || !req.body.team || !req.body.player) {
  //   throw new BadRequestError();
  // }
  const {
    params: { id: injuryId },
    body,
  } = req;

  const updatedData = { ...body };

  // team
  if ("team" in body && !mongoose.Types.ObjectId.isValid(body.team)) {
    const teamObj = await Team.findOne({ abbr: body.team });
    if (!teamObj) {
      throw new BadRequestError("team が見つかりません。");
    }
    updatedData.team = teamObj._id;
  }

  // player
  if ("player" in body && !mongoose.Types.ObjectId.isValid(body.player)) {
    const playerObj = await Player.findOne({ abbr: body.player });
    if (!playerObj) {
      throw new BadRequestError("player が見つかりません。");
    }
    updatedData.player = playerObj._id;
  }

  const updated = await Injury.findByIdAndUpdate(
    { _id: injuryId },
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updated) {
    throw new NotFoundError();
  }

  // update
  const populated = await Injury.findById(updated._id)
    .populate("player")
    .populate("team")
    .populate("now_team");
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteInjury = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: injuryId },
  } = req;

  const injury = await Injury.findOneAndDelete({ _id: injuryId });
  if (!injury) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

module.exports = {
  getAllInjury,
  createInjury,
  getInjury,
  updateInjury,
  deleteInjury,
};
