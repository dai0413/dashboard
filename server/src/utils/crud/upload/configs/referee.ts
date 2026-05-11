import { referee } from "@dai0413/myorg-shared/models-config";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import { RefereeModel } from "../../../../models/referee.js";
import { CountryModel } from "../../../../models/country.js";
import { UploadConfig } from "../types.js";
import { resolveOldIds } from "../services/resolveOldIds.js";
import z from "zod";

const {
  SCHEMA: { DATA },
} = referee(RefereeModel);
type TYPE = z.infer<typeof DATA>;

type INPUT_CSV_TYPE = Omit<
  TYPE,
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
