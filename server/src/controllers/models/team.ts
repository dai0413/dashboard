import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { team as createConfig } from "@dai0413/myorg-shared/models-config";
import { crudFactory } from "../../utils/crudFactory.js";
import { TeamModel as Model } from "../../models/team.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

const { MONGO_MODEL } = config;

const downloadItem = async (req: Request, res: Response) => {
  try {
    const data = await MONGO_MODEL.find();
    if (data.length === 0) {
      return res.status(404).json({ message: "データがありません" });
    }

    const header = `"id","team","abbr","enTeam","country","genre","jdataid","labalph","transferurl","sofaurl"\n`;

    const csvContent = data
      .map((team: any) => {
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
