import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getPlayers as get } from "@dai0413/scraping-logic/D";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { filter } from "./utils/index.js";

const getPlayers = async (req: Request, res: Response) => {
  try {
    const result = await get();
    if (result.ok) {
      const filtered = await filter(result.data);
      res.status(StatusCodes.OK).json({ data: filtered });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getPlayers:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch players");
  }
};

export { getPlayers };
