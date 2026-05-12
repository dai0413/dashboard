import { staffAppearance } from "@dai0413/myorg-shared/models-config";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import z from "zod";
import { StaffAppearanceModel } from "../../../models/staff-appearance.js";
import { MatchModel } from "../../../models/match.js";
import { StaffModel } from "../../../models/staff.js";
import { TeamModel } from "../../../models/team.js";
import { UploadConfig } from "../../../types/upload.js";
import { resolveOldIds } from "../helpers/upload/resolveOldIds.js";

const {
  SCHEMA: { DATA },
} = staffAppearance(StaffAppearanceModel);
type TYPE = z.infer<typeof DATA>;

type INPUT_CSV_TYPE = Omit<
  TYPE,
  "_id" | "match" | "team" | "createdAt" | "updatedAt"
> & {
  match?: string;
  team?: string;
  match_old_id?: string;
  staff_old_id?: string;
  team_old_id?: string;
};

export const staffAppearanceConfig: UploadConfig = {
  createValidRows: async (rows: any[]) => {
    let csvRows: INPUT_CSV_TYPE[] = rows;

    const reslovedOldIds = await resolveOldIds(csvRows, [
      {
        key: "match",
        oldKey: "match_old_id",
        model: MatchModel,
      },
      {
        key: "staff",
        oldKey: "staff_old_id",
        model: StaffModel,
      },
      {
        key: "team",
        oldKey: "team_old_id",
        model: TeamModel,
      },
    ]);

    const normalized = normalizeRows(reslovedOldIds, [
      { field: ["match", "team", "staff"], parserKey: ParserKey.ObjectId },
    ]);

    return normalized;
  },
};
