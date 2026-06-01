import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { nationalMatchSeries as createConfig } from "@dai0413/myorg-shared/models-config";
import { NationalMatchSeriesModel as Model } from "../../models/national-match-series.js";
import { createController } from "../factories/createController.js";

const config = createConfig(Model);
const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  updateItems,
  deleteItems,
} = createController(config);

const { MONGO_MODEL } = config;

const downloadItems = async (req: Request, res: Response) => {
  try {
    const items = await MONGO_MODEL.find();
    if (items.length === 0) {
      return res.status(404).json({ message: "データがありません" });
    }

    const header = `"_id","name","abbr","country","age_group","joined_at","left_at","urls"\n`;

    const csvContent = items
      .map((item: any) => {
        return `"${item._id}","${item.name}","${item.abbr}","${item.country}","${item.age_group}","${item.joined_at}","${item.left_at}","${item.urls}"`;
      })
      .join("\n");

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("national-match-series.csv");
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
  downloadItems,
  updateItems,
  deleteItems,
};
