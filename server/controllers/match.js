const Match = require("../models/match");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const mongoose = require("mongoose");

const getAllItems = async (req, res) => {
  const matchStage = {};

  if (req.query.competition) {
    try {
      matchStage.competition = new mongoose.Types.ObjectId(
        req.query.competition
      );
    } catch {
      return res.status(400).json({ erro: "Invalid competition ID" });
    }
  }

  if (req.query.season) {
    try {
      matchStage.season = new mongoose.Types.ObjectId(req.query.season);
    } catch {
      return res.status(400).json({ erro: "Invalid season ID" });
    }
  }

  if (req.query.team) {
    try {
      const teamId = new mongoose.Types.ObjectId(req.query.team);

      // すでに $or がある場合も考慮してマージ
      if (!matchStage.$or) {
        matchStage.$or = [];
      }
      matchStage.$or.push({ home_team: teamId }, { away_team: teamId });
    } catch {
      return res.status(400).json({ error: "Invalid team ID" });
    }
  }
  const dat = await Match.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    {
      $lookup: {
        from: "competitions",
        localField: "competition",
        foreignField: "_id",
        as: "competition",
      },
    },
    {
      $unwind: { path: "$competition", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "competitionstages",
        localField: "competition_stage",
        foreignField: "_id",
        as: "competition_stage",
      },
    },
    {
      $unwind: { path: "$competition_stage", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "seasons",
        localField: "season",
        foreignField: "_id",
        as: "season",
      },
    },
    {
      $unwind: { path: "$season", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "teams",
        localField: "home_team",
        foreignField: "_id",
        as: "home_team",
      },
    },
    {
      $unwind: { path: "$home_team", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "teams",
        localField: "away_team",
        foreignField: "_id",
        as: "away_team",
      },
    },
    {
      $unwind: { path: "$away_team", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "matchformats",
        localField: "match_format",
        foreignField: "_id",
        as: "match_format",
      },
    },
    {
      $unwind: { path: "$match_format", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "stadia",
        localField: "stadium",
        foreignField: "_id",
        as: "stadium",
      },
    },
    {
      $unwind: { path: "$stadium", preserveNullAndEmptyArrays: true },
    },
    { $sort: { _id: 1, order: 1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: dat });
};

const createItem = async (req, res) => {
  const createData = {
    ...req.body,
  };

  const data = await Match.create(createData);
  const populatedData = await Match.findById(data._id)
    .populate("competition")
    .populate("competition_stage")
    .populate("season")
    .populate("home_team")
    .populate("away_team")
    .populate("match_format")
    .populate("stadium");
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: populatedData });
};

const getItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;
  const data = await Match.findById(id)
    .populate("competition")
    .populate("competition_stage")
    .populate("season")
    .populate("home_team")
    .populate("away_team")
    .populate("match_format")
    .populate("stadium");
  if (!data) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({
    data: {
      ...data.toObject(),
    },
  });
};

const updateItem = async (req, res) => {
  const {
    params: { id },
    body,
  } = req;

  const updatedData = { ...body };

  const updated = await Match.findByIdAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new NotFoundError();
  }

  // update
  const populated = await Match.findById(updated._id)
    .populate("competition")
    .populate("competition_stage")
    .populate("season")
    .populate("home_team")
    .populate("away_team")
    .populate("match_format")
    .populate("stadium");
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;

  const team = await Match.findOneAndDelete({ _id: id });
  if (!team) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

const uploadItem = async (req, res) => {
  const rows = [];

  req.decodeStream
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      const toAdd = rows.map((row) => ({
        competition_stage: row.competition_stage,
        home_team: row.home_team,
        away_team: row.away_team,
        match_format: row.match_format ? row.match_format : undefined,
        stadium: row.stadium ? row.stadium : undefined,
        date: row.date ? row.date : undefined,
        audience: row.audience ? row.audience : undefined,
        home_goal: row.home_goal ? row.home_goal : undefined,
        away_goal: row.away_goal ? row.away_goal : undefined,
        home_pk_goal: row.home_pk_goal ? row.home_pk_goal : undefined,
        away_pk_goal: row.away_pk_goal ? row.away_pk_goal : undefined,
        result: row.result ? row.result : undefined,
        match_week: row.match_week ? row.match_week : undefined,
        weather: row.weather ? row.weather : undefined,
        temperature: row.temperature ? row.temperature : undefined,
        humidity: row.humidity ? row.humidity : undefined,
        transferurl: row.transferurl ? row.transferurl : undefined,
        sofaurl: row.sofaurl ? row.sofaurl : undefined,
        urls: row.urls ? row.urls : undefined,
        old_id: row.old_id ? row.old_id : undefined,
      }));

      try {
        const added = await Match.insertMany(toAdd);
        res.status(StatusCodes.OK).json({
          message: `${added.length}件のデータを追加しました`,
          data: added,
        });
      } catch (err) {
        console.error("保存エラー:", err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "保存中にエラーが発生しました" });
      }
    });
};

module.exports = {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
};
