import { playerAppearance } from "@dai0413/myorg-shared/models-config";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import z from "zod";
import { PlayerAppearanceModel } from "../../../models/player-appearance.js";
import { MatchModel } from "../../../models/match.js";
import { PlayerModel } from "../../../models/player.js";
import { TeamModel } from "../../../models/team.js";
import { UploadConfig } from "../../../types/upload.js";
import { resolveOldIds } from "../helpers/upload/resolveOldIds.js";

const {
  SCHEMA: { DATA },
} = playerAppearance(PlayerAppearanceModel);

type TYPE = z.infer<typeof DATA>;

type INPUT_CSV_TYPE = Omit<
  TYPE,
  "_id" | "match" | "team" | "createdAt" | "updatedAt"
> & {
  match?: string;
  team?: string;
  match_old_id?: string;
  player_old_id?: string;
  team_old_id?: string;
};

export const playerAppearanceConfig: UploadConfig = {
  createValidRows: async (rows: any[]) => {
    let csvRows: INPUT_CSV_TYPE[] = rows;

    const reslovedOldIds = await resolveOldIds(csvRows, [
      {
        key: "match",
        oldKey: "match_old_id",
        model: MatchModel,
      },
      {
        key: "player",
        oldKey: "player_old_id",
        model: PlayerModel,
      },
      {
        key: "team",
        oldKey: "team_old_id",
        model: TeamModel,
      },
    ]);

    const normalized = normalizeRows(reslovedOldIds, [
      { field: ["number", "time"], parserKey: ParserKey.Number },
      { field: ["match", "team", "player"], parserKey: ParserKey.ObjectId },
    ]);

    return normalized;
  },
};
