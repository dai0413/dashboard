const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const mongoose = require("mongoose");
const config = require("../modelsConfig");

// --- ヘルパー: query から matchStage を作る ---
const buildMatchStage = (query) => {
  let matchStage = {};

  // 単純条件
  if (getAllConfig?.query) {
    getAllConfig.query.forEach(({ field, type }) => {
      if (query[field]) {
        if (type === "ObjectId") {
          try {
            matchStage[field] = new mongoose.Types.ObjectId(query[field]);
          } catch {
            throw new BadRequestError(`Invalid ObjectId for ${field}`);
          }
        } else if (type === "number") {
          matchStage[field] = Number(query[field]);
        } else if (type === "boolean") {
          matchStage[field] = query[field] === "true";
        } else {
          matchStage[field] = query[field];
        }
      }
    });
  }

  // カスタム条件
  if (getAllConfig?.buildCustomMatch) {
    const customStage = getAllConfig.buildCustomMatch(query);
    matchStage = { ...matchStage, ...customStage };
  }

  return matchStage;
};

const crudFactory = (modelKey) => {
  const {
    MODEL,
    POPULATE_PATHS,
    getAll: getAllConfig,
    create: createConfig,
  } = config;

  // --- GET all ---
  const getAllItems = async (req, res) => {
    try {
      const matchStage = buildMatchStage(req.query);

      const data = await MODEL.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        ...getNest(POPULATE_PATHS),
        { $sort: getAllConfig?.sort || { _id: 1 } },
      ]);

      res.status(StatusCodes.OK).json({ data });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // --- CREATE ---
  const createItem = async (req, res) => {
    let populatedData;
    if (createConfig?.bulk && Array.isArray(req.body)) {
      const docs = await MODEL.insertMany(req.body);
      const ids = docs.map((doc) => doc._id);
      populatedData = await MODEL.find({ _id: { $in: ids } }).populate(
        POPULATE_PATHS
      );
    } else {
      const data = await MODEL.create(req.body);
      populatedData = await MODEL.findById(data._id).populate(POPULATE_PATHS);
    }
    res
      .status(StatusCodes.CREATED)
      .json({ message: "追加しました", data: populatedData });
  };

  // --- GET by id ---
  const getItem = async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID");
    }
    const data = await MODEL.findById(id).populate(POPULATE_PATHS);
    if (!data) throw new NotFoundError(`${modelKey} データが見つかりません`);
    res.status(StatusCodes.OK).json({ data });
  };

  // --- UPDATE ---
  const updateItem = async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("正しいIDを入力してください");
    }
    const updated = await MODEL.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundError(`${modelKey} データが見つかりません`);
    const populated = await MODEL.findById(updated._id).populate(
      POPULATE_PATHS
    );
    res
      .status(StatusCodes.OK)
      .json({ message: "編集しました", data: populated });
  };

  // --- DELETE ---
  const deleteItem = async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("正しいIDを入力してください");
    }
    const deleted = await MODEL.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError(`${modelKey} データが見つかりません`);
    res.status(StatusCodes.OK).json({ message: "削除しました" });
  };

  return { getAllItems, createItem, getItem, updateItem, deleteItem };
};

module.exports = { crudFactory };
