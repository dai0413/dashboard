import { fieldDefinition } from "../../../../lib/model-fields";
import { ModelType } from "../../../../types/models";
import { convertFieldDefinition } from "../../../../utils/displayField/convertFieldDefinition";

export const statsLFieldDefinition = convertFieldDefinition<ModelType.STATS_L>(
  ["team", "xgFor", "xgAgainst"],
  fieldDefinition[ModelType.STATS_L],
);

export const playerAppearanceFieldDefinition =
  convertFieldDefinition<ModelType.PLAYER_APPEARANCE>(
    ["number", "play_status", "player", "time"],
    fieldDefinition[ModelType.PLAYER_APPEARANCE],
  );
