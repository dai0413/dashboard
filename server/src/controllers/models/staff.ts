import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import moment from "moment";

import { staff } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { uploadItemHandler } from "../../utils/crud/upload/handler.js";
import { StaffModel } from "../../models/staff.js";
import { DecodedRequest } from "../../types.js";

const { MONGO_MODEL } = staff(StaffModel);

const getAllItems = crudFactory(staff(StaffModel)).getAllItems;
const createItem = crudFactory(staff(StaffModel)).createItem;
const getItem = crudFactory(staff(StaffModel)).getItem;
const updateItem = crudFactory(staff(StaffModel)).updateItem;
const deleteItem = crudFactory(staff(StaffModel)).deleteItem;

const uploadItem = async (req: DecodedRequest, res: Response) =>
  uploadItemHandler(staff(StaffModel), req, res);

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
};
