const Injury = require("../models/injury");
const Transfer = require("../models/transfer");
const Player = require("../models/player");
const Team = require("../models/team");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { formatInjury } = require("../utils/format");

const getAllInjury = async (req, res) => {
  let limit = parseInt(req.query.limit, 10);
  const player = req.query.player ? req.query.player : null;
  const now_team = req.query.now_team ? req.query.now_team : null;

  if (isNaN(limit) || limit <= 0) {
    limit = undefined;
  }

  const condition = {};
  if (player) {
    condition.player = player;
  }
  let query = Injury.find(condition).sort({ doa: -1, _id: -1 });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const injuries = await query.populate("player").populate("team");

  let enrichedDocs = injuries;

  if (req.query.latest) {
    enrichedDocs = await Promise.all(
      injuries.map(async (injuryDoc) => {
        const latest = injuryDoc.player
          ? await Transfer.findOne({
              player: injuryDoc.player._id,
              $or: [
                { to_team: { $ne: null } },
                { to_team_name: { $ne: null } },
              ],
            })
              .sort({ from_date: -1, _id: -1 })
              .exec()
          : null;

        if (latest?.to_team) {
          injuryDoc.now_team = latest.to_team;
        } else if (latest?.to_team_name) {
          injuryDoc.now_team = latest.to_team_name;
        } else {
          injuryDoc.now_team = null;
        }

        return injuryDoc;
      })
    );

    // injuryDoc.now_team を populate
    await Transfer.populate(enrichedDocs, { path: "now_team" });
  }

  const filteredDocs = now_team
    ? enrichedDocs.filter((doc) => doc.now_team?._id?.toString() === now_team)
    : enrichedDocs;

  const formatted = filteredDocs.map(formatInjury);

  res.status(StatusCodes.OK).json({ data: formatted });
};

const createInjury = async (req, res) => {
  const { team, team_name, player } = req.body;
  let injuryData = { ...req.body };

  if (!team && !team_name) {
    throw new BadRequestError("チームを選択または入力してください");
  }

  if (!player) {
    throw new BadRequestError("選手を選択してください");
  }

  if (team && team_name)
    throw new BadRequestError("チームを選択または入力してください");

  if (team) {
    if (!mongoose.Types.ObjectId.isValid(team)) {
      throw new BadRequestError("team の ID が不正です。");
    }
    const teamObj = await Team.findById(team);
    if (!teamObj) {
      throw new BadRequestError("team が見つかりません。");
    }
    injuryData.team = teamObj._id;
  } else if (team_name) {
    injuryData.team_name = team_name;
  }

  if (player) {
    if (!mongoose.Types.ObjectId.isValid(player)) {
      throw new BadRequestError("player の ID が不正です。");
    }
    const playerObj = await Player.findById(player);
    if (!playerObj) {
      throw new BadRequestError("player が見つかりません。");
    }
    injuryData.player = playerObj._id;
  }

  const now_teamObj = await Transfer.findOne({
    player: injuryData.player,
    to_team: { $ne: null }, // to_team が null でない
  })
    .sort({ from_date: -1, _id: -1 }) // 最新
    .limit(1);

  injuryData.now_team = now_teamObj ? now_teamObj.to_team : null;

  const injury = await Injury.create(injuryData);

  const populatedInjury = await Injury.findById(injury._id)
    .populate("player")
    .populate("team")
    .populate("now_team");
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: formatInjury(populatedInjury) });
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
    .populate("team");
  if (!injury) {
    throw new NotFoundError();
  }

  if (req.query.latest) {
    const latest = injury.player
      ? await Transfer.find({
          player: injury.player._id,
          to_team: { $ne: null },
        }).sort({ from_date: -1, _id: -1 })
      : // .limit(1)
        null;
    console.log("latest transfers", latest);
    const now_team = latest.to_team
      ? await Team.findById(latest.to_team)
      : null;

    res.status(StatusCodes.OK).json({
      data: {
        ...injury.toObject(),
        now_team: now_team,
      },
    });
  }

  res.status(StatusCodes.OK).json({
    data: {
      ...injury.toObject(),
    },
  });
};

const updateInjury = async (req, res) => {
  const {
    params: { id: injuryId },
  } = req;

  const updatedData = { ...req.body };

  const { team, team_name, player } = req.body;

  if (team && team_name)
    throw new BadRequestError("チームを選択または入力してください");

  // team
  if (team && !mongoose.Types.ObjectId.isValid(team)) {
    const teamObj = await Team.findOne({ abbr: team });
    if (!teamObj) {
      throw new BadRequestError("team が見つかりません。");
    }
    updatedData.team = teamObj._id;
  }

  // player
  if (player && !mongoose.Types.ObjectId.isValid(player)) {
    const playerObj = await Player.findOne({ abbr: player });
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
