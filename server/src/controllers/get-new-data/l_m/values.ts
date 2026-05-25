import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { result } from "./sample_data/values.js";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/site/draftData";

const getValues = async (req: Request, res: Response) => {
  try {
    const { getParams } = req.body;
    if (!getParams) throw new BadRequestError("date , alphを送信してください");

    // const result = await get(getParams);

    if (result.ok) {
      const data: Scraped = result.data;
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "成功", data: data });
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
