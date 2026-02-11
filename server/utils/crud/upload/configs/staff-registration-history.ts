import { staffRegistrationHistory } from "@dai0413/myorg-shared";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import { StaffModel } from "../../../../models/staff.js";
import { TeamModel } from "../../../../models/team.js";
import { StaffRegistrationHistoryModel } from "../../../../models/staff-registration-history.js";
import { UploadConfig } from "../types.js";
import { resolveOldIds } from "../services/resolveOldIds.js";

const { TYPE } = staffRegistrationHistory(StaffRegistrationHistoryModel);

type INPUT_CSV_TYPE = Omit<
  typeof TYPE,
  | "_id"
  | "competition"
  | "staff"
  | "changes"
  | "team"
  | "createdAt"
  | "updatedAt"
> & {
  team?: string;
  "changes.name"?: string;
  "changes.en_name"?: string;
  "changes.role"?: string;
  staff_old_id?: string;
  team_old_id?: string;
  staff?: string;
};

export const staffRegistrationHistoryConfig: UploadConfig = {
  createValidRows: async (rows: any[]) => {
    let csvRows: INPUT_CSV_TYPE[] = rows;

    const createChanges = csvRows.map((c) => {
      const newObj = {
        ...c,
        changes: {
          name: c["changes.name"],
          en_name: c["changes.en_name"],
          role: c["changes.role"],
        },
      };
      return newObj;
    });

    const reslovedOldIds = await resolveOldIds(createChanges, [
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
      {
        field: ["match", "team", "staff"],
        parserKey: ParserKey.ObjectId,
      },
    ]);

    return normalized;
  },
};
