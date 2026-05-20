import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
// import { getPositions as get } from "@dai0413/scraping-logic/L";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/site/l_m/team-match-formation";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { result } from "./sample_data/formation.js";

const getFormation = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) throw new BadRequestError("urlを送信してください");

    // const result = await get(url);
    if (result.ok) {
      const positionDatas: Scraped = result.data;
      res.status(StatusCodes.OK).json({ data: positionDatas });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getFormation:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch Positions");
  }
};

export { getFormation };
