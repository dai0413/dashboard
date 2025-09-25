const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const mongoose = require("mongoose");
const { formatMatch } = require("../../utils/format");
const { getNest } = require("../../utils/getNest");
const { parseObjectId } = require("../../csvImport/utils/parseObjectId");
const { parseDate } = require("../../csvImport/utils/parseDate");
const {
  match: { MODEL, POPULATE_PATHS },
} = require("../../modelsConfig");
const csv = require("csv-parser");

const getNestField = (usePopulate) => getNest(usePopulate, POPULATE_PATHS);

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
  const data = await MODEL.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    ...getNestField(false),
    { $sort: { _id: 1, order: 1 } },
  ]);

  res.status(StatusCodes.OK).json({ data: data.map(formatMatch) });
};

const createItem = async (req, res) => {
  const createData = {
    ...req.body,
  };

  const data = await MODEL.create(createData);
  const populatedData = await MODEL.findById(data._id).populate(
    getNestField(true)
  );
  res
    .status(StatusCodes.CREATED)
    .json({ message: "追加しました", data: formatMatch(populatedData) });
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
    data: formatMatch(data),
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
  res
    .status(StatusCodes.OK)
    .json({ message: "編集しました", data: formatMatch(populated) });
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

const uploadItem = async (req, res) => {
  const rows = [];

  req.decodedStream
    .pipe(
      csv({
        mapHeaders: ({ header }) => header.replace(/'/g, "").trim(),
      })
    )
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      const toAdd = rows.map((row) => ({
        competition_stage: parseObjectId(row.competition_stage),
        home_team: parseObjectId(row.home_team),
        away_team: parseObjectId(row.away_team),
        match_format: row.match_format
          ? parseObjectId(row.match_format)
          : undefined,
        stadium: row.stadium ? parseObjectId(row.stadium) : undefined,
        stadium_name: row.stadium_name ? row.stadium_name : undefined,
        date: row.date ? parseDate(row.date) : undefined,
        audience: row.audience ? row.audience : undefined,
        home_goal: row.home_goal ? row.home_goal : undefined,
        away_goal: row.away_goal ? row.away_goal : undefined,
        home_pk_goal: row.home_pk_goal ? row.home_pk_goal : undefined,
        away_pk_goal: row.away_pk_goal ? row.away_pk_goal : undefined,
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
        const added = await MODEL.insertMany(toAdd, { ordered: false });

        res.status(StatusCodes.OK).json({
          message: `${added.length}件のデータを追加しました`,
          data: added,
        });
      } catch (err) {
        // console.error("保存エラー:", err);

        // MongoBulkWriteError の場合、失敗した行を取り出せる
        if (err.writeErrors) {
          const failed = err.writeErrors.map((e) => ({
            index: e.index,
            code: e.code,
            errmsg: e.errmsg,
          }));

          res.status(StatusCodes.PARTIAL_CONTENT).json({
            message: `${toAdd.length - failed.length}件追加に成功、${
              failed.length
            }件失敗`,
          });
        } else {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "保存中にエラーが発生しました" });
        }
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
