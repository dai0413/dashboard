import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  NotFoundError,
  BadRequestError,
  InternalServerError,
} from "../../errors/index.js";
import { getNest } from "../helpers/getNest.js";
import { convertObjectIdToString } from "../helpers/crud/convertObjectIdToString.js";
import z from "zod";
import { buildMatchStage } from "../helpers/crud/query/buildMatchStage.js";
import {
  ControllerConfig,
  FilterableFieldDefinition,
  SortableFieldDefinition,
} from "@dai0413/myorg-shared";

import { addPositionGroup } from "../../order/position.js";
import { addPositionGroupOrder } from "../../order/position_group.js";
import {
  buildUpdateObject,
  buildBulkUpdateMessage,
  nullToUndefined,
} from "../helpers/crud/index.js";
import {
  buildMongoFilter,
  parseSort,
  buildJsonSort,
} from "../helpers/crud/query/index.js";

type SuccessReturn<DATA> = {
  success: true;
  data: DATA;
};
type FailedReturn = {
  success: false;
};

type Result<DATA> = SuccessReturn<DATA> | FailedReturn;

type ResDataBase<DATA> = {
  data: DATA;
};

type FailedItem<DATA> = {
  _id?: string;
  data: DATA;
  error: string;
};

type BulkResult<DATA> = {
  totalCount: number;
  successCount: number;
  failedCount: number;
  modifiedCount: number;
  failedItems: FailedItem<DATA>[];
};

// read
export type ReadItemResponse<DATA> = ResDataBase<DATA>;
export type ReadItemsResponse<DATA> = ResDataBase<DATA> & {
  totalCount: number;
  page: number;
  pageSize: number;
};

// create
export type CreateItemResponse<DATA> = Result<DATA> & {
  message: string;
};
export type CreateItemsResponse<DATA> = Result<DATA> & {
  message: string;
} & BulkResult<DATA>;

// update
export type UpdateItemResponse<DATA> = Result<DATA> & {
  message: string;
};
export type UpdateItemsResponse<DATA> = Result<DATA> & {
  message: string;
} & BulkResult<DATA>;

// delete
export type DeleteItemResponse = {
  success: boolean;
  message: string;
};

const crudFactory = <
  TData extends z.ZodObject<any>,
  TForm extends z.ZodObject<any>,
  TResponse extends z.ZodObject<any>,
  TPopulated extends z.ZodObject<any>,
>(
  config: ControllerConfig<TData, TForm, TResponse, TPopulated>,
) => {
  const {
    name,
    SCHEMA: { DATA, RESPONSE, POPULATED, FORM },
    MONGO_MODEL,
    POPULATE_PATHS,
    getAllConfig: getAllConfig,
    bulk,
    convertFun,
  } = config;

  type DATA_TYPE = z.infer<typeof DATA>;
  type RESPONSE_TYPE = z.infer<typeof RESPONSE>;
  type POPULATED_TYPE = z.infer<typeof POPULATED>;
  const UPDATE_ITEM_SCHEMA = FORM.partial().extend({
    _id: z.string(),
  });
  type UPDATE_TYPE = z.infer<typeof UPDATE_ITEM_SCHEMA>;
  const UPDATE = FORM.partial();

  const getResponseData = (populated: unknown): RESPONSE_TYPE => {
    const plain = convertObjectIdToString(populated);
    if (convertFun) {
      const parsed = POPULATED.parse(plain);
      const convertedData = convertFun(parsed);
      const responseData = RESPONSE.parse(convertedData);

      return responseData;
    } else {
      const responseData = RESPONSE.parse(plain);

      return responseData;
    }
  };

  // --- GET all ---
  const getAllItems = async (
    req: Request,
    res: Response<ReadItemsResponse<RESPONSE_TYPE[]>>,
  ) => {
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

      const data: POPULATED_TYPE[] = results[0]?.data || [];
      const totalCount = results[0]?.metadata?.[0]?.totalCount || data.length;

      const processed: RESPONSE_TYPE[] = data.map((item) =>
        getResponseData(item),
      );

      const resObj: ReadItemsResponse<RESPONSE_TYPE[]> = {
        data: processed,
        totalCount: totalCount,
        page: page,
        pageSize: limit,
      };

      res.status(StatusCodes.OK).json(resObj);
    } catch (err) {
      console.error(`[${name}] getAll error:`, err);
      throw new BadRequestError();
    }
  };

  // --- CREATE ---
  const createItem = async (
    req: Request,
    res: Response<CreateItemResponse<RESPONSE_TYPE | RESPONSE_TYPE[]>>,
  ) => {
    if (Array.isArray(req.body)) {
      if (!bulk) {
        throw new InternalServerError("サーバーサイド設定ミス");
      }

      const parsed = req.body.map((item) => FORM.parse(item));
      const docs = (await MONGO_MODEL.insertMany(
        parsed,
      )) as unknown as UPDATE_TYPE[];
      const ids = docs.map((doc) => doc._id);
      const populatedData: POPULATED_TYPE[] = await MONGO_MODEL.find({
        _id: { $in: ids },
      })
        .populate(POPULATE_PATHS)
        .lean();

      // 配列の場合
      const processed = populatedData.map((item) => getResponseData(item));

      res.status(StatusCodes.CREATED).json({
        data: processed,
        success: true,
        message: "追加しました",
      });
    } else {
      const parsed = FORM.parse(req.body);
      const data: DATA_TYPE = await MONGO_MODEL.create(parsed);
      const populated: POPULATED_TYPE = await MONGO_MODEL.findById(data._id)
        .populate(POPULATE_PATHS)
        .lean();

      const responseData = getResponseData(populated);

      res.status(StatusCodes.CREATED).json({
        data: responseData,
        success: true,
        message: "追加しました",
      });
    }
  };

  // --- GET by id ---
  const getItem = async (
    req: Request,
    res: Response<ReadItemResponse<RESPONSE_TYPE>>,
  ) => {
    const { id } = req.params;
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("正しいIDを入力してください");
    }
    const populated = await MONGO_MODEL.findById(id)
      .populate(POPULATE_PATHS)
      .lean();

    if (!populated) {
      throw new NotFoundError(`${name} が見つかりません`);
    }

    const data = getResponseData(populated);
    res.status(StatusCodes.OK).json({ data });
  };

  // --- UPDATE ---
  const updateItem = async (
    req: Request,
    res: Response<UpdateItemResponse<RESPONSE_TYPE>>,
  ) => {
    const { id } = req.params;
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("正しいIDを入力してください");
    }
    const data = nullToUndefined(req.body);

    const parsed = UPDATE.parse(data);

    const updateObj = buildUpdateObject(parsed);

    const updated: POPULATED_TYPE = await MONGO_MODEL.findByIdAndUpdate(
      id,
      updateObj,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate(POPULATE_PATHS)
      .lean();

    if (!updated) {
      throw new NotFoundError(`${name} データが見つかりません`);
    }

    const responseData = getResponseData(updated);

    const message = `${name}を更新しました`;

    res
      .status(StatusCodes.OK)
      .json({ data: responseData, message, success: true });
  };

  const updateItems = async (
    req: Request,
    res: Response<UpdateItemsResponse<UPDATE_TYPE[]>>,
  ) => {
    if (!bulk) {
      throw new InternalServerError("サーバーサイド設定ミス");
    }

    if (!Array.isArray(req.body)) {
      throw new BadRequestError("配列で送信してください");
    }

    const failedItems: UpdateItemsResponse<UPDATE_TYPE[]>["failedItems"] = [];
    const ops: any[] = [];

    for (const item of req.body) {
      try {
        const data = nullToUndefined(item);

        const parsed = UPDATE_ITEM_SCHEMA.parse(data);
        const { _id, ...rest } = parsed;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
          throw new Error(`不正なID: ${_id}`);
        }

        const updateObj = buildUpdateObject(rest);

        ops.push({
          updateOne: {
            filter: { _id },
            update: updateObj,
            upsert: false,
          },
        });
      } catch (err: any) {
        failedItems.push({
          _id: item?._id,
          data: item,
          error: err.message,
        });
      }
    }

    let result = {
      matchedCount: 0,
      modifiedCount: 0,
    };

    if (ops.length > 0) {
      result = await MONGO_MODEL.bulkWrite(ops, { ordered: false });
    }

    const totalCount = req.body.length;
    const successCount = ops.length;
    const failedCount = totalCount - successCount;

    const successIds = ops
      .map((op) => op.updateOne.filter._id)
      .filter(
        (id) => !failedItems.some((f) => f._id?.toString() === id.toString()),
      );

    const updatedDocs = await MONGO_MODEL.find({
      _id: { $in: successIds },
    })
      .populate(POPULATE_PATHS)
      .lean();

    const responseData = updatedDocs.map(getResponseData);

    res.status(StatusCodes.OK).json({
      data: responseData,
      success: true,
      message: buildBulkUpdateMessage(totalCount, successCount, failedCount),
      totalCount,
      successCount,
      failedCount,
      modifiedCount: result.modifiedCount,
      failedItems,
    });
  };

  // --- DELETE ---
  const deleteItem = async (
    req: Request,
    res: Response<DeleteItemResponse>,
  ) => {
    const { id } = req.params;
    if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("正しいIDを入力してください");
    }
    const deleted = await MONGO_MODEL.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundError(`${name} データが見つかりません`);
    const message = `${name}を削除しました`;
    res.status(StatusCodes.OK).json({ message, success: true });
  };

  return {
    getItem,
    getAllItems,
    createItem,
    updateItem,
    updateItems,
    deleteItem,
  };
};

export { crudFactory };
