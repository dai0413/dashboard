import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { NotFoundError, BadRequestError } from "../errors/index.ts";
import { getNest } from "./getNest.ts";
import { ControllerConfig } from "../modelsConfig/types/type.ts";
import { convertObjectIdToString } from "./convertObjectIdToString.ts";
import z from "zod";
import { buildMatchStage } from "./buildMatchStage.ts";

const parseSort = (sortParam?: string) => {
  if (!sortParam) return {};

  const sortFields = sortParam.split(",").map((f) => f.trim());
  const sortObj: Record<string, 1 | -1> = {};

  for (const field of sortFields) {
    if (!field) continue;
    if (field.startsWith("-")) {
      sortObj[field.slice(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  }
  return sortObj;
};

const crudFactory = <TDoc, TData, TForm, TRes, TPopulated>(
  config: ControllerConfig<TDoc, TData, TForm, TRes, TPopulated>
) => {
  const {
    name,
    SCHEMA: { POPULATED, FORM },
    MONGO_MODEL,
    POPULATE_PATHS,
    getAllConfig: getAllConfig,
    bulk,
    convertFun,
  } = config;

  // --- GET all ---
  const getAllItems = async (req: Request, res: Response) => {
    try {
      const sortQuery = parseSort(req.query.sort as string);

      const beforeMatch = buildMatchStage(
        req.query,
        getAllConfig?.query?.filter((q) => !q.populateAfter),
        getAllConfig?.buildCustomMatch
      );

      const afterMatch = buildMatchStage(
        req.query,
        getAllConfig?.query?.filter((q) => q.populateAfter)
      );

      const beforePaths = POPULATE_PATHS.filter((path) => path.matchBefore);
      const afterPaths = POPULATE_PATHS.filter((path) => !path.matchBefore);

      const sort =
        Object.keys(sortQuery).length > 0
          ? sortQuery
          : getAllConfig?.sort || { _id: 1 };

      const data = await MONGO_MODEL.aggregate([
        ...getNest(false, beforePaths),
        ...(Object.keys(beforeMatch).length > 0
          ? [{ $match: beforeMatch }]
          : []),
        ...getNest(false, afterPaths),
        ...(Object.keys(afterMatch).length > 0 ? [{ $match: afterMatch }] : []),
        { $sort: sort },
        ...(getAllConfig?.project &&
        Object.keys(getAllConfig.project).length > 0
          ? [{ $project: getAllConfig.project }]
          : []),
        ...[{ $limit: 100000 }],
      ]);

      const processed = data.map((item) => {
        const plain = convertObjectIdToString(item);
        const parsed = POPULATED.parse(plain);
        return convertFun ? convertFun(parsed) : parsed;
      });

      res.status(StatusCodes.OK).json({ data: processed });
    } catch (err) {
      console.error(`[${name}] getAll error:`, err);
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: (err as Error).message });
    }
  };

  // --- CREATE ---
  const createItem = async (req: Request, res: Response) => {
    let populatedData;
    if (bulk && Array.isArray(req.body)) {
      const parsed = req.body.map((item) => FORM.parse(item));
      const docs = (await MONGO_MODEL.insertMany(
        parsed
      )) as unknown as (TDoc & {
        _id: Types.ObjectId;
      })[];
      const ids = docs.map((doc) => doc._id);
      populatedData = await MONGO_MODEL.find({ _id: { $in: ids } }).populate(
        POPULATE_PATHS
      );
    } else {
      const parsed = FORM.parse(req.body);
      const data = await MONGO_MODEL.create(parsed);
      populatedData = await MONGO_MODEL.findById(data._id).populate(
        POPULATE_PATHS
      );
    }

    if (!populatedData) throw new BadRequestError();

    if (Array.isArray(populatedData)) {
      // 配列の場合
      const processed = populatedData.map((item) => {
        const plain = convertObjectIdToString(item.toObject());
        const parsed = POPULATED.parse(plain);
        return convertFun ? convertFun(parsed) : parsed;
      });

      res.status(StatusCodes.CREATED).json({
        message: "追加しました",
        data: processed,
      });
    } else {
      // 単数の場合
      const plain = convertObjectIdToString(populatedData.toObject());
      const parsed = POPULATED.parse(plain);
      const response = convertFun ? convertFun(parsed) : parsed;

      res.status(StatusCodes.CREATED).json({
        message: "追加しました",
        data: response,
      });
    }
  };

  // --- GET by id ---
  const getItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid ID");
    }
    const populated = await MONGO_MODEL.findById(id).populate(POPULATE_PATHS);

    if (!populated) {
      throw new NotFoundError(`${name} データ取得中にエラーが発生しました`);
    }

    const plain = convertObjectIdToString(populated.toObject());
    const parsedResult = POPULATED.parse(plain);
    const response = convertFun ? convertFun(parsedResult) : parsedResult;

    res.status(StatusCodes.OK).json({ data: response });
  };

  // --- UPDATE ---
  const updateItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("正しいIDを入力してください");
    }

    const parsed = (FORM as z.ZodObject<any>).partial().parse(req.body);

    const updated = await MONGO_MODEL.findByIdAndUpdate(id, parsed, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundError(`${name} データが見つかりません`);
    const populated = await MONGO_MODEL.findById(updated._id).populate(
      POPULATE_PATHS
    );
    if (!populated) {
      throw new NotFoundError(`${name} データ取得中にエラーが発生しました`);
    }

    const plain = convertObjectIdToString(populated.toObject());
    const parsedResult = POPULATED.parse(plain);
    const response = convertFun ? convertFun(parsedResult) : parsedResult;

    res
      .status(StatusCodes.OK)
      .json({ message: "編集しました", data: response });
  };

  // --- DELETE ---
  const deleteItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("正しいIDを入力してください");
    }
    const deleted = await MONGO_MODEL.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError(`${name} データが見つかりません`);
    res.status(StatusCodes.OK).json({ message: "削除しました" });
  };

  return { getAllItems, createItem, getItem, updateItem, deleteItem };
};

export { crudFactory };
