import { statsL } from "@dai0413/myorg-shared";
import { normalizeRows, ParserKey } from "@dai0413/myorg-shared/normalizer";
import { MatchModel } from "../../../../models/match.js";
import { TeamModel } from "../../../../models/team.js";
import { StatsLModel } from "../../../../models/stats-l.js";
import { UploadConfig } from "../types.js";
import { resolveOldIds } from "../services/resolveOldIds.js";

const { TYPE } = statsL(StatsLModel);

type INPUT_CSV_TYPE = Omit<
  typeof TYPE,
  "_id" | "match" | "team" | "createdAt" | "updatedAt"
> & {
  match?: string;
  team?: string;
  match_old_id?: string;
  team_old_id?: string;
};

export const statsLConfig: UploadConfig = {
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
    ]);

    const normalized = normalizeRows(reslovedOldIds, [
      { field: numberFields, parserKey: ParserKey.Number },
      { field: ["match", "team", "player"], parserKey: ParserKey.ObjectId },
    ]);

    return normalized;
  },
};

const numberFields = [
  "xgFor",
  "shootFor",
  "onTargetFor",
  "pkShootFor",
  "passFor",
  "crossFor",
  "directFkFor",
  "indirectFkFor",
  "cornerKickFor",
  "throwInFor",
  "dribbleFor",
  "tackleFor",
  "clearFor",
  "interceptFor",
  "offsideFor",
  "yellowCardFor",
  "redCardFor",
  "entryAtk3rdFor",
  "entryPenaltyAreaFor",
  "distanceFor",
  "sprintFor",
  "attackCountFor",
  "chanceCreationRateFor",
  "shootSuccessRateFor",
  "passSuccessRateFor",
  "crossSuccessRateFor",
  "throwInSuccessRateFor",
  "dribbleSuccessRateFor",
  "tackleSuccessRateFor",

  "possession",
  "acc_time",

  "xgAgainst",
  "shootAgainst",
  "onTargetAgainst",
  "pkShootAgainst",
  "passAgainst",
  "crossAgainst",
  "directFkAgainst",
  "indirectFkAgainst",
  "cornerKickAgainst",
  "throwInAgainst",
  "dribbleAgainst",
  "tackleAgainst",
  "clearAgainst",
  "interceptAgainst",
  "offsideAgainst",
  "yellowCardAgainst",
  "redCardAgainst",
  "entryAtk3rdAgainst",
  "entryPenaltyAreaAgainst",
  "distanceAgainst",
  "sprintAgainst",
  "attackCountAgainst",
  "chanceCreationRateAgainst",
  "shootSuccessRateAgainst",
  "passSuccessRateAgainst",
  "crossSuccessRateAgainst",
  "throwInSuccessRateAgainst",
  "dribbleSuccessRateAgainst",
  "tackleSuccessRateAgainst",
];
