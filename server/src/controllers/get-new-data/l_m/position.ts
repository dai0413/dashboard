import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPositions as get } from "@dai0413/scraping-logic/L";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/position";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { CreateItemResponse } from "@dai0413/myorg-shared";

const getPositions = async (
  req: Request,
  res: Response<CreateItemResponse<Scraped>>,
) => {
  try {
    const { date, alph } = req.body;
    if (!date || !alph)
      throw new BadRequestError("date , alphを送信してください");

    const result = await get({ date, alph });
    if (result.ok) {
      const data: Scraped = result.data;

      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "成功", data: data });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getPositions:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch Positions");
  }
};

export { getPositions };
