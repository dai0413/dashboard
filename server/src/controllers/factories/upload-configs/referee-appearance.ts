import { refereeAppearance } from "@dai0413/myorg-shared/models-config";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import z from "zod";
import { RefereeAppearanceModel } from "../../../models/referee-appearance.js";
import { MatchModel } from "../../../models/match.js";
import { RefereeModel } from "../../../models/referee.js";
import { UploadConfig } from "../../../types/upload.js";
import { resolveOldIds } from "../helpers/upload/resolveOldIds.js";

const {
  SCHEMA: { DATA },
} = refereeAppearance(RefereeAppearanceModel);

type TYPE = z.infer<typeof DATA>;

type INPUT_CSV_TYPE = Omit<
  TYPE,
  "_id" | "match" | "createdAt" | "updatedAt"
> & {
  match?: string;
  match_old_id?: string;
  referee_old_id?: string;
};

export const refereeAppearanceConfig: UploadConfig = {
  createValidRows: async (rows: any[]) => {
    let csvRows: INPUT_CSV_TYPE[] = rows;

    const reslovedOldIds = await resolveOldIds(csvRows, [
      {
        key: "match",
        oldKey: "match_old_id",
        model: MatchModel,
      },
      {
        key: "referee",
        oldKey: "referee_old_id",
        model: RefereeModel,
      },
    ]);

    const normalized = normalizeRows(reslovedOldIds, [
      { field: ["match", "referee"], parserKey: ParserKey.ObjectId },
    ]);

    return normalized;
  },
};
