const NationalMatchSeries = require("../models/national-match-series");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllNationalMatchSeries = async (req, res) => {
  const country = req.query.country ? req.query.country : null;

  const condition = {};

  if (country) condition.country = country;

  const nationalMatchSeries = await NationalMatchSeries.find(condition)
    .populate("country")
    .sort({ joined_at: -1, _id: -1 });
  res.status(StatusCodes.OK).json({ data: nationalMatchSeries });
};

const createNationalMatchSeries = async (req, res) => {
  const nationalMatchSeriesData = {
    ...req.body,
  };

  const nationalMatchSeries = await NationalMatchSeries.create(
    nationalMatchSeriesData
  );

  const pupulatedData = await NationalMatchSeries.findById(
    nationalMatchSeries._id
  ).populate("country");

  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: pupulatedData });
};

const getNationalMatchSeries = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: nationalMatchSeriesId },
  } = req;
  const nationalMatchSeries = await NationalMatchSeries.findById(
    nationalMatchSeriesId
  ).populate("country");
  if (!nationalMatchSeries) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({
    data: {
      ...nationalMatchSeries.toObject(),
    },
  });
};

const updateNationalMatchSeries = async (req, res) => {
  const {
    params: { id: nationalMatchSeriesId },
    body,
  } = req;

  const updatedData = { ...body };

  const updated = await NationalMatchSeries.findByIdAndUpdate(
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
  const populated = await NationalMatchSeries.findById(updated._id).populate(
    "country"
  );
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteNationalMatchSeries = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: nationalMatchSeriesId },
  } = req;

  const nationalMatchSeries = await NationalMatchSeries.findOneAndDelete({
    _id: nationalMatchSeriesId,
  });
  if (!nationalMatchSeries) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

const downloadItems = async (req, res) => {
  try {
    const items = await NationalMatchSeries.find();
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
  getAllNationalMatchSeries,
  createNationalMatchSeries,
  getNationalMatchSeries,
  updateNationalMatchSeries,
  deleteNationalMatchSeries,
  downloadItems,
};
