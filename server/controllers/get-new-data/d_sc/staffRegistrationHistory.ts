import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getStaffRegistrationHistories as get } from "@dai0413/scraping-logic/D";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { resolveStaffRegistrationRelations } from "./utils/index.js";

const getStaffRegistrationHistories = async (req: Request, res: Response) => {
  try {
    const result = await get();

    if (result.ok) {
      const resolved = await resolveStaffRegistrationRelations(result.data);
      res.status(StatusCodes.OK).json({ data: resolved });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getStaffRegistrationHistories:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch staffs");
  }
};

export { getStaffRegistrationHistories };
