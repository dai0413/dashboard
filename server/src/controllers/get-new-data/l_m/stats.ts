import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getStat as get } from "@dai0413/scraping-logic/L";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/stats-l";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { CreateItemResponse } from "@dai0413/myorg-shared";

type Output = Record<string, Scraped>;

const getStats = async (
  req: Request,
  res: Response<CreateItemResponse<Output>>,
) => {
  try {
    const { getParams } = req.body;
    if (!getParams)
      throw new BadRequestError("getParams(date , alph)を送信してください");

    console.log("getParams", getParams);

    const result = await get(getParams);
    if (result.ok) {
      const data: Output = result.data;

      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "成功", data: data });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getStats:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch Positions");
  }
};

export { getStats };
