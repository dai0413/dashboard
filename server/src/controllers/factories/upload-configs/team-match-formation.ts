import { teamMatchFormation } from "@dai0413/myorg-shared/models-config";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import z from "zod";
import { UploadConfig } from "../../../types/upload.js";
import { resolveOldIds } from "../helpers/upload/resolveOldIds.js";
import { TeamMatchFormationModel } from "../../../models/team-match-formation.js";
import { MatchModel } from "../../../models/match.js";
import { TeamModel } from "../../../models/team.js";
import { FormationModel } from "../../../models/formation.js";

const {
  SCHEMA: { DATA },
} = teamMatchFormation(TeamMatchFormationModel);
type TYPE = z.infer<typeof DATA>;

type INPUT_CSV_TYPE = Omit<
  TYPE,
  "_id" | "match" | "team" | "formation" | "createdAt" | "updatedAt"
> & {
  match?: string;
  team?: string;
  formation?: string;
  match_old_id?: string;
  team_old_id?: string;
  formation_old_id?: string;
};

export const teamMatchFormationConfig: UploadConfig = {
  createValidRows: async (rows: any[]) => {
    let csvRows: INPUT_CSV_TYPE[] = rows;

    const reslovedOldIds = await resolveOldIds(csvRows, [
      {
        key: "match",
        oldKey: "match_old_id",
        model: MatchModel,
      },
      {
        key: "team",
        oldKey: "team_old_id",
        model: TeamModel,
      },
      {
        key: "formation",
        oldKey: "formation_old_id",
        model: FormationModel,
      },
    ]);

    const normalized = normalizeRows(reslovedOldIds, [
      {
        field: ["match", "team", "formation"],
        parserKey: ParserKey.ObjectId,
      },
    ]);

    return normalized;
  },
};
