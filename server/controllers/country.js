const Country = require("../models/country");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllCountrys = async (req, res) => {
  const countries = await Country.find({});
  res.status(StatusCodes.OK).json({ data: countries });
};

const createCountry = async (req, res) => {
  const countryData = {
    ...req.body,
  };

  const country = await Country.create(countryData);
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: country });
};

const getCountry = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: countryId },
  } = req;
  const country = await Country.findById(countryId);
  if (!country) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({
    data: {
      ...country.toObject(),
    },
  });
};

const updateCountry = async (req, res) => {
  const {
    params: { id: countryId },
    body,
  } = req;

  const updatedData = { ...body };

  const updated = await Country.findByIdAndUpdate(
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
  const populated = await Country.findById(updated._id);
  res.status(StatusCodes.OK).json({ message: "編集しました", data: populated });
};

const deleteCountry = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id: countryId },
  } = req;

  const country = await Country.findOneAndDelete({ _id: countryId });
  if (!country) {
    throw new NotFoundError();
  }

  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

module.exports = {
  getAllCountrys,
  createCountry,
  getCountry,
  updateCountry,
  deleteCountry,
};
