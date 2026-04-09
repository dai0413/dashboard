import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPosition as get } from "@dai0413/scraping-logic/SN";
import { Scraped } from "@dai0413/myorg-shared/types/sn_m/position";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";

const getPositions = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) throw new BadRequestError("urlを送信してください");

    const result = await get(url);
    if (result.ok) {
      const positionDatas: Scraped = result.data;
      res.status(StatusCodes.OK).json({ data: positionDatas });
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
