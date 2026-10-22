import { Request } from "express";
import { CreateItemsResponse } from "@dai0413/myorg-shared";
import { TransferModel } from "../../../models/transfer.js";
import { customPipeline } from "./pipeline.js";
import {
  CITIZENSHIP_IDS,
  SEASON_END,
  SEASON_START,
  TARGET_COUNTRY_IDS,
} from "./constants.js";
import { NationalitySquadResult } from "./types.js";
import { getResponse } from "./getResponse/index.js";

export const getNationalitySquad = async (
  req: Request,
): Promise<CreateItemsResponse<NationalitySquadResult[]>> => {
  const result = await TransferModel.aggregate<NationalitySquadResult>(
    customPipeline({
      seasonStart: SEASON_START,
      seasonEnd: SEASON_END,
      targetCountryIds: TARGET_COUNTRY_IDS,
      citizenshipIds: CITIZENSHIP_IDS,
    }),
  ).allowDiskUse(true);

  const responseData = await getResponse(result);

  return {
    data: responseData,
    totalCount: responseData.length,
    success: true,
    message: "取得しました",
    successCount: responseData.length,
    failedCount: 0,
    failedItems: [],
  };
};
