import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../../errors/index.js";

import { getNest } from "../../utils/getNest.js";

import { team } from "../../modelsConfig/index.js";
const { MODEL, POPULATE_PATHS, bulk } = team;

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

const getAllItems = async (req, res) => {
  const matchStage = {};

  const data = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ...getNestField(false),
    { $sort: { _id: 1, order: 1 } },
  ]);

  res.status(StatusCodes.OK).json({ data });
};

const createItem = async (req, res) => {
  let populatedData;
  if (bulk && Array.isArray(req.body)) {
    const docs = await MODEL.insertMany(req.body);

    const ids = docs.map((doc) => doc._id);
    populatedData = await MODEL.find({ _id: { $in: ids } }).populate(
      getNestField(true)
    );
  } else {
    const data = await MODEL.create(req.body);
    populatedData = await MODEL.findById(data._id).populate(getNestField(true));
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "追加しました", data: populatedData });
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
  res.status(StatusCodes.OK).json({ data });
};

const updateItem = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError();
  }
  const {
    params: { id },
  } = req;

  const updated = await MODEL.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new NotFoundError();
  }

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

  const data = await MODEL.findOneAndDelete({ _id: id });
  if (!data) {
    throw new NotFoundError();
  }
  res.status(StatusCodes.OK).json({ message: "削除しました" });
};

const downloadItem = async (req, res) => {
  try {
    const teams = await MODEL.find();
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

export {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  downloadItem,
};
