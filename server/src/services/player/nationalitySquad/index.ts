import { Request } from "express";
import { ReadItemsResponse } from "@dai0413/myorg-shared";
import BadRequestError from "../../../errors/bad-request.js";
import { TransferModel } from "../../../models/transfer.js";
import { customPipeline } from "./pipeline.js";
import { NationalitySquadResult } from "@dai0413/myorg-shared/types/aggregate/player";
import { getResponse } from "./getResponse/index.js";

export const getNationalitySquad = async (
  req: Request,
): Promise<ReadItemsResponse<NationalitySquadResult[]>> => {
  const { targetCountryIds, citizenshipIds, seasonStart, seasonEnd } =
    req.query;

  if (!targetCountryIds) {
    throw new BadRequestError("targetCountryIdsを指定してください");
  }

  if (!citizenshipIds) {
    throw new BadRequestError("citizenshipIdsを指定してください");
  }

  if (!seasonStart || !(typeof seasonStart === "string")) {
    throw new BadRequestError("seasonStartを指定してください");
  }

  if (!seasonEnd || !(typeof seasonEnd === "string")) {
    throw new BadRequestError("seasonEnddsを指定してください");
  }

  const targetCountry = Array.isArray(targetCountryIds)
    ? targetCountryIds
    : [targetCountryIds];

  const citizenship = Array.isArray(citizenshipIds)
    ? citizenshipIds
    : [citizenshipIds];

  const start = new Date(seasonStart);
  const end = new Date(seasonEnd);

  const result = await TransferModel.aggregate<NationalitySquadResult>(
    customPipeline({
      seasonStart: start,
      seasonEnd: end,
      targetCountryIds: targetCountry as string[],
      citizenshipIds: citizenship as string[],
    }),
  ).allowDiskUse(true);

  const responseData = await getResponse(result);

  return {
    data: responseData,
    totalCount: responseData.length,
    page: 1,
    pageSize: 0,
  };
};
