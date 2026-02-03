import { Request, Response } from "express";

import { getNoCallUpService } from "../../services/index.js";
import { StatusCodes } from "http-status-codes";

export const getNoCallUp = async (req: Request, res: Response) => {
  try {
    const result = await getNoCallUpService(req);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Error in getNoNumberByCountry:", error);

    throw new Error("サーバーエラー");
  }
};
