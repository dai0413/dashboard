import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { NotFoundError, BadRequestError } from "../errors/index.js";
import { getNest } from "./getNest.js";
import { convertObjectIdToString } from "./convertObjectIdToString.js";
import z from "zod";
import { buildMatchStage } from "./buildMatchStage.js";
import {
  ControllerConfig,
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";
import { buildMongoFilter } from "./buildFilter.js";
import { parseSort } from "./parseSort.js";
import { buildJsonSort } from "./buildJsonSort.js";
import { addPositionGroup } from "../order/position.js";
import { addPositionGroupOrder } from "../order/position_group.js";

const crudFactory = <TDoc, TData, TForm, TRes, TPopulated>(
  config: ControllerConfig<TDoc, TData, TForm, TRes, TPopulated>,
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
      const getAll = req.query.getAll === "true";
      const page = Number(req.query.page) || 1;
      const limit = getAll ? 0 : Number(req.query.limit) || 10;
      const skip = getAll ? 0 : (page - 1) * limit;

      // ===== 🔹 Filters =====
      let filters: Record<string, any> = {};
      if (req.query.filters) {
        filters = buildMongoFilter(
          JSON.parse(
            req.query.filters as string,
          ) as FilterableFieldDefinition[],
        );
      }

      // ===== 🔹 Sort =====
      let mongoSort: Record<string, 1 | -1> = { _id: 1 };

      let jsonSort: Record<string, 1 | -1> = {};
      if (req.query.sorts) {
        jsonSort = buildJsonSort(
          JSON.parse(req.query.sorts as string) as SortableFieldDefinition[],
        );
      }

      let stringSort: Record<string, 1 | -1> = {};
      if (req.query.sort) {
        stringSort = parseSort(req.query.sort as string);
      }

      mongoSort =
        Object.keys(jsonSort).length > 0
          ? jsonSort
          : Object.keys(stringSort).length > 0
            ? stringSort
            : getAllConfig?.sort && Object.keys(getAllConfig.sort).length > 0
              ? getAllConfig.sort
              : { _id: 1 };

      // 最終フォールバック
      if (!mongoSort || Object.keys(mongoSort).length === 0) {
        mongoSort = { _id: 1 };
      }

      // ===== 🔹 Match Stages =====
      const beforeMatch = buildMatchStage(
        req.query,
        getAllConfig?.query?.filter((q) => !q.populateAfter),
        getAllConfig?.buildCustomMatch,
      );

      const afterMatch = buildMatchStage(
        req.query,
        getAllConfig?.query?.filter((q) => q.populateAfter),
      );

      const beforePaths = POPULATE_PATHS.filter((path) => path.matchBefore);
      const afterPaths = POPULATE_PATHS.filter((path) => !path.matchBefore);

      const needsPositionSort =
        mongoSort && mongoSort.hasOwnProperty("position_group_order");

      const results = await MONGO_MODEL.aggregate([
        ...getNest(false, beforePaths),
        ...(Object.keys(beforeMatch).length > 0
          ? [{ $match: beforeMatch }]
          : []),
        ...getNest(false, afterPaths),
        ...(Object.keys(afterMatch).length > 0 ? [{ $match: afterMatch }] : []),
        ...(filters && Object.keys(filters).length > 0
          ? [{ $match: filters }]
          : []),
        ...(getAllConfig?.project &&
        Object.keys(getAllConfig.project).length > 0
          ? [{ $project: getAllConfig.project }]
          : []),
        {
          $facet: {
            metadata: [{ $count: "totalCount" }],
            data: [
              ...(needsPositionSort ? [addPositionGroup] : []),
              ...(needsPositionSort ? [addPositionGroupOrder] : []),
              { $sort: mongoSort },
              ...(needsPositionSort
                ? [{ $project: { position_group_order: 0 } }]
                : []),
              ...(getAll ? [] : [{ $skip: skip }, { $limit: limit }]),
            ],
          },
        },
      ]).allowDiskUse(true);

      const data: any[] = results[0]?.data || [];
      const totalCount = results[0]?.metadata?.[0]?.totalCount || data.length;

      const processed = data.map((item) => {
        const plain = convertObjectIdToString(item);
        const parsed = POPULATED.parse(plain);
        return convertFun ? convertFun(parsed) : parsed;
      });

      res.status(StatusCodes.OK).json({
        data: processed,
        totalCount: totalCount,
        page: page,
        pageSize: limit,
      });
    } catch (err) {
      console.error(`[${name}] getAll error:`, err);
      throw new BadRequestError();
    }
  };

  // --- CREATE ---
  const createItem = async (req: Request, res: Response) => {
    let populatedData;
    if (bulk && Array.isArray(req.body)) {
      const parsed = req.body.map((item) => FORM.parse(item));
      const docs = (await MONGO_MODEL.insertMany(
        parsed,
      )) as unknown as (TDoc & {
        _id: Types.ObjectId;
      })[];
      const ids = docs.map((doc) => doc._id);
      populatedData = await MONGO_MODEL.find({ _id: { $in: ids } }).populate(
        POPULATE_PATHS,
      );
    } else {
      const parsed = FORM.parse(req.body);
      const data = await MONGO_MODEL.create(parsed);
      populatedData = await MONGO_MODEL.findById(data._id).populate(
        POPULATE_PATHS,
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
  const nullToUndefined = (obj: any): any => {
    if (obj === null) return undefined;
    if (Array.isArray(obj)) return obj.map(nullToUndefined);
    if (typeof obj === "object" && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, nullToUndefined(v)]),
      );
    }
    return obj;
  };

  const updateItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("正しいIDを入力してください");
    }
    const data = nullToUndefined(req.body);

    const parsed = (FORM as z.ZodObject<any>).partial().parse(data);

    // parsed を $set / $unset に分離する
    const setFields: Record<string, any> = {};
    const unsetFields: Record<string, "" | 1> = {};

    Object.entries(parsed).forEach(([key, val]) => {
      if (val === undefined) {
        // undefined はフィールドを削除したい意図
        unsetFields[key] = "";
      } else {
        setFields[key] = val;
      }
    });

    // 作成する更新オブジェクト
    const updateObj: any = {};
    if (Object.keys(setFields).length > 0) updateObj.$set = setFields;
    if (Object.keys(unsetFields).length > 0) updateObj.$unset = unsetFields;

    // もし updateObj が空ならエラー/何もしない
    if (Object.keys(updateObj).length === 0) {
      // 何も更新する項目がない
      const current = await MONGO_MODEL.findById(id);
      return res.json({ data: current });
    }

    const updated = await MONGO_MODEL.findByIdAndUpdate(id, updateObj, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw new NotFoundError(`${name} データが見つかりません`);
    const populated = await MONGO_MODEL.findById(updated._id).populate(
      POPULATE_PATHS,
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
