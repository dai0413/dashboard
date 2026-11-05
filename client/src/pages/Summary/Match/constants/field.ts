import { getFields } from "../../../../lib/model-fields";
import { ModelType } from "../../../../types/models";
import { PlayerAppearanceGet } from "../../../../types/models/player-appearance";
import { StatsLGet } from "../../../../types/models/stats-l";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";

export const statsLFieldDefinition = convertFieldDefinition<StatsLGet>(
  ["team", "xgFor", "xgAgainst"],
  getFields(ModelType.STATS_L),
);

export const playerAppearanceFieldDefinition =
  convertFieldDefinition<PlayerAppearanceGet>(
    ["number", "play_status", "player", "time"],
    getFields(ModelType.PLAYER_APPEARANCE),
  );
