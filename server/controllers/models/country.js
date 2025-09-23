const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const { getNest } = require("../../utils/getNest");
const {
  country: { MODEL, POPULATE_PATHS },
} = require("../../modelsConfig");

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

const getAllItems = async (req, res) => {
  const matchStage = {};

  const dat = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ...getNestField(false),
    { $sort: { _id: 1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: dat });
};

const createItem = async (req, res) => {
  const countryData = {
    ...req.body,
  };

  const country = await MODEL.create(countryData);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: country });
};

const getItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: countryId },
  } = req;
  const country = await MODEL.findById(countryId);
  if (!country) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({
    data: {
      ...country.toObject(),
    },
  });
};

const updateItem = async (req, res) => {
  const {
    params: { id: countryId },
    body,
  } = req;

  const updatedData = { ...body };

  const updated = await MODEL.findByIdAndUpdate(
    { _id: countryId },
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
  const populated = await MODEL.findById(updated._id);
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: countryId },
  } = req;

  const country = await MODEL.findOneAndDelete({ _id: countryId });
  if (!country) {
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
