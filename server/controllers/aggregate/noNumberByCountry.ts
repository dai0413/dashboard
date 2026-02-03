import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getNoNumberService } from "../../services/index.js";

export const getNoNumberByCountry = async (req: Request, res: Response) => {
  try {
    const result = await getNoNumberService(req);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Error in getNoNumberByCountry:", error);

    throw new Error("サーバーエラー");
  }
};
