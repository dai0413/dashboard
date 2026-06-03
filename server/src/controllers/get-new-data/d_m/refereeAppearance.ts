import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/data/draftData";
import { getRefereeAppearance as get } from "@dai0413/scraping-logic/D";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";

const getRefereeAppearance = async (
  req: Request,
  res: Response<CreateItemResponse<Scraped[any]["refereeAppearance"]>>,
) => {
  try {
    const { url, cardId } = req.body;
    if (!url && !cardId)
      throw new BadRequestError("urlまたはcardIdを送信してください");

    const result = await get({ url, cardId });

    if (result.ok) {
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "成功", data: result.data });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getRefereeAppearance:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch refereeAppearance");
  }
};

export { getRefereeAppearance };
