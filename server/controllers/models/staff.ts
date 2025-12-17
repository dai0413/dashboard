import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import moment from "moment";
import csv from "csv-parser";

import { staff } from "@dai0413/myorg-shared";
import { crudFactory } from "../../utils/crudFactory.js";
import { StaffModel } from "../../models/staff.js";
import { CountryModel } from "../../models/country.js";
import { DecodedRequest } from "types.js";
import { parseObjectId } from "../../csvImport/utils/parseObjectId.js";
import { parseDateJST } from "../../csvImport/utils/parseDateJST.js";
import { getNest } from "../../utils/getNest.js";
import { convertObjectIdToString } from "../../utils/convertObjectIdToString.js";

const {
  MONGO_MODEL,
  TYPE,
  POPULATE_PATHS,
  SCHEMA: { POPULATED },
} = staff(StaffModel);

const getAllItems = crudFactory(staff(StaffModel)).getAllItems;
const createItem = crudFactory(staff(StaffModel)).createItem;
const getItem = crudFactory(staff(StaffModel)).getItem;
const updateItem = crudFactory(staff(StaffModel)).updateItem;
const deleteItem = crudFactory(staff(StaffModel)).deleteItem;

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

const uploadItem = async (req: DecodedRequest, res: Response) => {
  const rows: (typeof TYPE & {
    manager_id?: string;
    citizenship?: string;
  })[] = [];

  const countries = await CountryModel.find({});
  const countryMap = new Map(countries.map((c) => [c.name, c._id]));

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
      const toAdd = rows.map((row) => {
        const citizenshipIds =
          row.citizenship !== "" && row.citizenship
            ? row.citizenship
                .split(",")
                .map((name) => countryMap.get(name.trim()))
                .filter(Boolean)
            : undefined;

        return {
          name: row.name,
          en_name: row.en_name ? row.en_name : undefined,
          citizenship: citizenshipIds,
          dob: row.dob ? parseDateJST(row.dob as unknown as string) : undefined,
          pob: row.pob ? row.pob : undefined,
          player: row.player ? parseObjectId(row.player) : undefined,
          old_id: row.manager_id ? row.manager_id : undefined,
        };
      });

      try {
        const added = await MONGO_MODEL.insertMany(toAdd, { ordered: false });

        // populate用にIDを集めて find する
        const populatedAdded = await MONGO_MODEL.find({
          _id: { $in: added.map((a: any) => a._id) },
        }).populate(getNest(true, POPULATE_PATHS));

        const processed = populatedAdded.map((item: any) => {
          const plain = convertObjectIdToString(item);
          const parsed = POPULATED.parse(plain);
          return parsed;
        });

        res.status(StatusCodes.OK).json({
          message: `${populatedAdded.length}件のデータを追加しました`,
          data: processed,
        });
      } catch (err: any) {
        // console.error("保存エラー:", err);

        // MongoBulkWriteError の場合、失敗した行を取り出せる
        if (err.writeErrors) {
          const failed = err.writeErrors.map((e: any) => ({
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

export {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  downloadItems,
  uploadItem,
};
