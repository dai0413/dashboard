import { transfer } from "@dai0413/myorg-shared/models-config";
import { TransferModel } from "../../../../models/transfer.js";
import z from "zod";
import { getResponseData } from "../../../../utils/getResponseData.js";
import { NationalitySquadResult } from "../types.js";

const { SCHEMA, POPULATE_PATHS, convertFun } = transfer();
type Response = z.infer<typeof SCHEMA.RESPONSE>;
type Populated = z.infer<typeof SCHEMA.POPULATED>;

export const getTransferResponse = async (result: NationalitySquadResult[]) => {
  const populated = await TransferModel.populate<Populated>(
    result.map((item) => item.transfer),
    POPULATE_PATHS,
  );

  const response: Response[] = populated.map((item) => {
    return getResponseData({
      populated: item,
      SCHEMA,
      convertFun,
    });
  });

  return response;
};
