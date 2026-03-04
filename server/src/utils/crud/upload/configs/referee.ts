import { referee } from "@dai0413/myorg-shared";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import { RefereeModel } from "../../../../models/referee.js";
import { CountryModel } from "../../../../models/country.js";
import { UploadConfig } from "../types.js";
import { resolveOldIds } from "../services/resolveOldIds.js";

const { TYPE } = referee(RefereeModel);

type INPUT_CSV_TYPE = Omit<
  typeof TYPE,
  "_id" | "match" | "createdAt" | "updatedAt"
> & {
  citizenship_old_id?: string;
};

export const refereeConfig: UploadConfig = {
  createValidRows: async (rows: any[]) => {
    let csvRows: INPUT_CSV_TYPE[] = rows;

    const reslovedOldIds = await resolveOldIds(csvRows, [
      {
        key: "citizenship",
        oldKey: "citizenship_old_id",
        model: CountryModel,
      },
    ]);

    const normalized = normalizeRows(reslovedOldIds, [
      {
        field: ["citizenship"],
        parserKey: ParserKey.ObjectId,
      },
    ]);

    return normalized;
  },
};
