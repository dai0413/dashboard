import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { convertObjectIdToString } from "../utils/convertObjectIdToString.js";
import { buildMatchStage } from "../utils/buildMatchStage.js";
import { transfer as transferConfig } from "../../shared/dist/models-config/transfer.js";
import { injury as injuryConfig } from "../../shared/dist/models-config/injury.js";
import { getNest } from "../utils/getNest.js";
import { ParsedQs } from "qs";
import { ControllerConfig } from "@myorg/shared";
import { TransferModel } from "../models/transfer.js";
import { InjuryModel } from "../models/injury.js";

const createData = async <
  TDoc,
  TData,
  TForm = TData,
  TResponse = TData,
  TPopulated = TData
>(
  config: ControllerConfig<TDoc, TData, TForm, TResponse, TPopulated>,
  query: ParsedQs
): Promise<(TResponse | TPopulated)[]> => {
  const limit: number = query.limit ? parseInt(query.limit as string, 10) : 5;

  const {
    SCHEMA: { POPULATED },
    MONGO_MODEL,
    POPULATE_PATHS,
    getAllConfig: getAllConfig,
    convertFun,
  } = config;

  const beforeMatch = buildMatchStage(
    query,
    getAllConfig?.query?.filter((q) => !q.populateAfter),
    getAllConfig?.buildCustomMatch
  );
  const afterMatch = buildMatchStage(
    query,
    getAllConfig?.query?.filter((q) => q.populateAfter),
    getAllConfig?.buildCustomMatch
  );

  const beforePaths = POPULATE_PATHS.filter((path) => path.matchBefore);
  const afterPaths = POPULATE_PATHS.filter((path) => !path.matchBefore);

  const data = await MONGO_MODEL.aggregate([
    ...getNest(false, beforePaths),
    ...(Object.keys(beforeMatch).length > 0 ? [{ $match: beforeMatch }] : []),
    ...getNest(false, afterPaths),
    { $sort: { doa: -1, _id: -1 } },
    ...(Object.keys(afterMatch).length > 0 ? [{ $match: afterMatch }] : []),
    ...(getAllConfig?.project && Object.keys(getAllConfig.project).length > 0
      ? [{ $project: getAllConfig.project }]
      : []),
    ...[{ $limit: limit }],
  ]);

  const processed = data.map((item: any) => {
    const plain = convertObjectIdToString(item);
    const parsed = POPULATED.parse(plain);
    return convertFun ? convertFun(parsed) : parsed;
  });

  return processed;
};

const getTopPageData = async (req: Request, res: Response) => {
  const transferData = await createData(
    transferConfig(TransferModel),
    req.query
  );
  const injuryData = await createData(injuryConfig(InjuryModel), req.query);

  res
    .status(StatusCodes.OK)
    .json({ transferData: transferData, injuryData: injuryData });
};

export { getTopPageData };
