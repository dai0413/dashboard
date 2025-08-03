const NationalMatchSeries = require("../models/national-match-series");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllNationalMatchSeries = async (req, res) => {
  const nationalMatchSeries = await NationalMatchSeries.find({});
  res.status(StatusCodes.OK).json({ data: nationalMatchSeries });
};

const createNationalMatchSeries = async (req, res) => {
  const nationalMatchSeriesData = {
    ...req.body,
  };

  const nationalMatchSeries = await NationalMatchSeries.create(
    nationalMatchSeriesData
  );
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: nationalMatchSeries });
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
  );
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
  const populated = await NationalMatchSeries.findById(updated._id);
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

module.exports = {
  getAllNationalMatchSeries,
  createNationalMatchSeries,
  getNationalMatchSeries,
  updateNationalMatchSeries,
  deleteNationalMatchSeries,
};
