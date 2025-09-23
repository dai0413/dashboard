const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const { getNest } = require("../../utils/getNest");
const {
  nationalMatchSeries: { MODEL, POPULATE_PATHS },
} = require("../../modelsConfig");

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

const getAllItems = async (req, res) => {
  const matchStage = {};

  if (req.query.country) {
    try {
      matchStage.country = new mongoose.Types.ObjectId(req.query.country);
    } catch {
      return res.status(400).json({ error: "Invalid country ID" });
    }
  }

  const dat = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ...getNestField(false),
    { $sort: { joined_at: -1, _id: -1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: dat });
};

const createItem = async (req, res) => {
  const nationalMatchSeriesData = {
    ...req.body,
  };

  const nationalMatchSeries = await MODEL.create(nationalMatchSeriesData);

  const pupulatedData = await MODEL.findById(nationalMatchSeries._id).populate(
    getNestField(true)
  );

  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: pupulatedData });
};

const getItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: nationalMatchSeriesId },
  } = req;
  const nationalMatchSeries = await MODEL.findById(
    nationalMatchSeriesId
  ).populate(getNestField(true));
  if (!nationalMatchSeries) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({
    data: {
      ...nationalMatchSeries.toObject(),
    },
  });
};

const updateItem = async (req, res) => {
  const {
    params: { id: nationalMatchSeriesId },
    body,
  } = req;

  const updatedData = { ...body };

  const updated = await MODEL.findByIdAndUpdate(
    { _id: nationalMatchSeriesId },
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
    params: { id: nationalMatchSeriesId },
  } = req;

  const nationalMatchSeries = await MODEL.findOneAndDelete({
    _id: nationalMatchSeriesId,
  });
  if (!nationalMatchSeries) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

const downloadItems = async (req, res) => {
  try {
    const items = await MODEL.find();
    if (items.length === 0) {
      return res.status(404).json({ message: "データがありません" });
    }

    const header = `"_id","name","abbr","country","age_group","joined_at","left_at","urls"\n`;

    const csvContent = items
      .map((item) => {
        return `"${item._id}","${item.name}","${item.abbr}","${item.country}","${item.age_group}","${item.joined_at}","${item.left_at}","${item.urls}"`;
      })
      .join("\n");

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("items.csv");
    res.status(StatusCodes.OK).send("\uFEFF" + header + csvContent); // 先頭にBOMをつけてExcel文字化け防止
  } catch (err) {
    console.error("CSV出力エラー:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "CSV出力に失敗しました" });
  }
};

module.exports = {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  downloadItems,
};
