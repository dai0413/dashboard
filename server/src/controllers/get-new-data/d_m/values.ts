import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
// import { getValues as get } from "@dai0413/scraping-logic/D";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { result } from "./sample_data/sample.js";

const getValues = async (req: Request, res: Response) => {
  try {
    const { url, id } = req.body;
    if (!url && !id) throw new BadRequestError("urlまたはidを送信してください");

    // const result = await get({url, id});

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
