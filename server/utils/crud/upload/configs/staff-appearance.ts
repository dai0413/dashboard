import { staffAppearance } from "@dai0413/myorg-shared";
import { MatchModel } from "../../../../models/match.js";
import { StaffModel } from "../../../../models/staff.js";
import { TeamModel } from "../../../../models/team.js";
import { StaffAppearanceModel } from "../../../../models/staff-appearance.js";
import { ParserKey, UploadConfig } from "../types.js";
import { resolveOldIds } from "../services/resolveOldIds.js";
import { normalizeRows } from "../parsers/index.js";

const { TYPE } = staffAppearance(StaffAppearanceModel);

type INPUT_CSV_TYPE = Omit<
  typeof TYPE,
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
