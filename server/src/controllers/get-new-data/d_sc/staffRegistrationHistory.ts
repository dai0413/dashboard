import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getStaffRegistrationHistories as get } from "@dai0413/scraping-logic/D";
import { CreateItemResponse } from "@dai0413/myorg-shared";
import { Form } from "@dai0413/myorg-shared/types/get-new-data/models/staff-registration-history";
import BadRequestError from "../../../errors/bad-request.js";
import InternalServerError from "../../../errors/internal-server.js";
import { resolveStaffRegistrationRelations } from "./utils/index.js";

const getStaffRegistrationHistories = async (
  req: Request,
  res: Response<CreateItemResponse<Partial<Form>[]>>,
) => {
  try {
    const result = await get();

    if (result.ok) {
      const resolved = await resolveStaffRegistrationRelations(result.data);
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "成功", data: resolved });
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
