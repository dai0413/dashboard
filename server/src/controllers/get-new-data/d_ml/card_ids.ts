import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getCardIds as get } from "@dai0413/scraping-logic/D";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { result } from "./sample_data/sample.js";

const getCardIds = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) throw new BadRequestError("urlを送信してください");

    // const result = await get(url);

    if (result.ok) {
      res.status(StatusCodes.OK).json({ data: result.data });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getCardIds:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch match");
  }
};

export { getCardIds };
