const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const mongoose = require("mongoose");
const { getNest } = require("../../utils/getNest");
const {
  teamCompetitionSeason: { MODEL, POPULATE_PATHS },
} = require("../../modelsConfig");

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

const getAllItems = async (req, res) => {
  const matchStage = {};

  if (req.query.team) {
    try {
      matchStage.team = new mongoose.Types.ObjectId(req.query.team);
    } catch {
      return res.status(400).json({ error: "Invalid team ID" });
    }
  }

  if (req.query.competition) {
    try {
      matchStage.competition = new mongoose.Types.ObjectId(
        req.query.competition
      );
    } catch {
      return res.status(400).json({ error: "Invalid competition ID" });
    }
  }

  if (req.query.season) {
    try {
      matchStage.season = new mongoose.Types.ObjectId(req.query.season);
    } catch {
      return res.status(400).json({ error: "Invalid season ID" });
    }
  }

  const dat = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ...getNestField(false),
    { $sort: { "season.start_date": -1, _id: -1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: dat });
};

const createItem = async (req, res) => {
  const createData = req.body;

  let created;

  if (Array.isArray(createData)) {
    if (createData.length === 0) {
      throw new BadRequestError("データを送信してください");
    }

    const insertedDocs = await MODEL.insertMany(createData);

    // モデルから populate をかけ直す
    created = await MODEL.populate(insertedDocs, getNestField(true));
  } else {
    const data = await MODEL.create(createData);
    created = await MODEL.findById(data._id).populate(getNestField(true));
  }

  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: created });
};

const getItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;
  const data = await MODEL.findById(id).populate(getNestField(true));
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

  const updated = await MODEL.findByIdAndUpdate({ _id: id }, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new NotFoundError();
  }

  // update
  const populated = await MODEL.findById(updated._id).populate(
    getNestField(true)
  );
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;

  const team = await MODEL.findOneAndDelete({ _id: id });
  if (!team) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

module.exports = {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
};
