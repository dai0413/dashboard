import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { Form } from "@dai0413/myorg-shared/types/get-new-data/models/player-registration-history";
import { getPlayerRegistrationHistories as get } from "@dai0413/scraping-logic/D";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { resolvePlayerRegistrationRelations } from "./utils/index.js";

const getPlayerRegistrationHistories = async (
  req: Request,
  res: Response<CreateItemResponse<Partial<Form>[]>>,
) => {
  try {
    const result = await get();

    if (result.ok) {
      const resolved = await resolvePlayerRegistrationRelations(result.data);
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "成功", data: resolved });
    } else {
      throw new InternalServerError(result.error);
    }
  } catch (error) {
    console.error("Error in getPlayerRegistrationHistories:", error);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Failed to fetch players");
  }
};

export { getPlayerRegistrationHistories };
