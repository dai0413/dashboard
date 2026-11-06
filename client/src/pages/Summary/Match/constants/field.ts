import { ModelType } from "../../../../types/models";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";

export const statsLFieldDefinition = convertFieldDefinition({
  keys: ["team", "xgFor", "xgAgainst"],
  getFieldsKey: ModelType.STATS_L,
});

export const playerAppearanceFieldDefinition = convertFieldDefinition({
  keys: ["number", "play_status", "player", "time"],
  getFieldsKey: ModelType.PLAYER_APPEARANCE,
});
