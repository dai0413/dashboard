import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getValues as get } from "@dai0413/scraping-logic/J";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";

import mongoose from "mongoose";
import { result } from "./sample.js";

const getValues = async (req: Request, res: Response) => {
  try {
    const { url, season } = req.body;
    if (!url) throw new BadRequestError("urlを送信してください");
    if (
      !season ||
      typeof season !== "string" ||
      !mongoose.Types.ObjectId.isValid(season)
    ) {
      throw new BadRequestError("seasonを送信してください");
    }

    // const result = await get(url);

    if (result.ok) {
      res.status(StatusCodes.OK).json({ data: { ...result.data } });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getValues:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch match");
  }
};

export { getValues };
