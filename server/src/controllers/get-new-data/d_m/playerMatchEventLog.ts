import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/draftData";
import { getPlayerMatchEventLog as get } from "@dai0413/scraping-logic/D";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";

const getPlayerMatchEventLog = async (
  req: Request,
  res: Response<CreateItemResponse<Scraped[any]["playerMatchEventLog"]>>,
) => {
  try {
    const { url, id } = req.body;
    if (!url && !id) throw new BadRequestError("urlまたはidを送信してください");

    const result = await get(url, id);

    if (result.ok) {
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "成功", data: result.data });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getPlayerMatchEventLog:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch playerMatchEventLog");
  }
};

export { getPlayerMatchEventLog };
