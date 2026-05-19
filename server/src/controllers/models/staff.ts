import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import moment from "moment";

import { staff as createConfig } from "@dai0413/myorg-shared/models-config";
import { createController } from "../factories/createController.js";
import { StaffModel as Model } from "../../models/staff.js";

const config = createConfig(Model);
const {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  uploadItem,
  updateItems,
} = createController(config);

const { MONGO_MODEL } = config;

const downloadItems = async (req: Request, res: Response) => {
  try {
    const data = await MONGO_MODEL.find();
    if (data.length === 0) {
      return res.status(404).json({ message: "データがありません" });
    }

    const header = `"name","en_name","dob","citizenship","manager_id"\n`;

    const csvContent = data
      .map((item: any) => {
        const dob = item.dob ? moment(item.dob).format("YYYY/MM/DD") : "";

        const citizenship = item.citizenship?.length
          ? item.citizenship
              .map((c: any) => (typeof c === "string" ? c : c.name))
              .join(",")
          : "";

        return `"${item.name}","${
          item.en_name ?? ""
        }","${dob}","${citizenship}","${item.old_id ?? ""}"`;
      })
      .join("\n");

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("staff.csv");
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
  uploadItem,
  updateItems,
};
