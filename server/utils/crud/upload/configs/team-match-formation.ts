import { teamMatchFormation } from "@dai0413/myorg-shared";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import { MatchModel } from "../../../../models/match.js";
import { TeamModel } from "../../../../models/team.js";
import { TeamMatchFormationModel } from "../../../../models/team-match-formation.js";
import { FormationModel } from "../../../../models/formation.js";
import { UploadConfig } from "../types.js";
import { resolveOldIds } from "../services/resolveOldIds.js";

const { TYPE } = teamMatchFormation(TeamMatchFormationModel);

type INPUT_CSV_TYPE = Omit<
  typeof TYPE,
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
