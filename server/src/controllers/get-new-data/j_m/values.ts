import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/draftData";
import { getValues as get } from "@dai0413/scraping-logic/J";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";

const getValues = async (
  req: Request,
  res: Response<CreateItemResponse<Scraped>>,
) => {
  try {
    const { url } = req.body;
    if (!url) throw new BadRequestError("urlを送信してください");

    const result = await get(url);

    if (result.ok) {
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "成功", data: result.data });
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
