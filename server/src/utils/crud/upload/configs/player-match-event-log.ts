import { playerMatchEventLog } from "@dai0413/myorg-shared/models-config";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import { MatchModel } from "../../../../models/match.js";
import { PlayerModel } from "../../../../models/player.js";
import { TeamModel } from "../../../../models/team.js";
import { PlayerAppearanceModel } from "../../../../models/player-appearance.js";
import { MatchEventTypeModel } from "../../../../models/match-event-type.js";
import { UploadConfig } from "../types.js";
import { resolveOldIds } from "../services/resolveOldIds.js";
import z from "zod";

const {
  SCHEMA: { DATA },
} = playerMatchEventLog(PlayerAppearanceModel);
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
  match_event_type_old_id?: string;
};

export const playerMatchEventLogConfig: UploadConfig = {
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
      {
        key: "match_event_type",
        oldKey: "match_event_type_old_id",
        model: MatchEventTypeModel,
      },
    ]);

    const normalized = normalizeRows(reslovedOldIds, [
      { field: ["time", "add_time", "order"], parserKey: ParserKey.Number },
      {
        field: ["match", "team", "player", "match_event_type"],
        parserKey: ParserKey.ObjectId,
      },
    ]);

    return normalized;
  },
};
