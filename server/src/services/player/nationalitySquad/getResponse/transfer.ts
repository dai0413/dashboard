import { transfer } from "@dai0413/myorg-shared/models-config";
import { TransferModel } from "../../../../models/transfer.js";
import z from "zod";
import { getResponseData } from "../../../../utils/getResponseData.js";
import { NationalitySquadResult } from "@dai0413/myorg-shared/types/aggregate/player";

const { SCHEMA, POPULATE_PATHS, convertFun } = transfer();
type Response = z.infer<typeof SCHEMA.RESPONSE>;
type Populated = z.infer<typeof SCHEMA.POPULATED>;

export const getTransferResponse = async (
  transfers: NationalitySquadResult["transfer"][],
) => {
  const populated = await TransferModel.populate<Populated>(
    transfers,
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
