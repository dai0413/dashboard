import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { Scraped } from "@dai0413/myorg-shared/types/get-new-data/models/staff";
import { getStaffs as get } from "@dai0413/scraping-logic/D";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { filter } from "./utils/index.js";

const getStaffs = async (
  req: Request,
  res: Response<CreateItemResponse<Scraped[]>>,
) => {
  try {
    const result = await get();
    if (result.ok) {
      const filtered = await filter(result.data);
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "成功", data: filtered });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getStaffs:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch staffs");
  }
};

export { getStaffs };
