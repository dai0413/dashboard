import { ModelType } from "../../types/models";
import { transfer } from "./transfer";
import { injury } from "./injury";
import { player } from "./player";
import { team } from "./team";
import { country } from "./country";
import { nationalMatchSeries } from "./national-match-series";

export const fieldDefinition = {
  [ModelType.COUNTRY]: country,
  [ModelType.INJURY]: injury,
  [ModelType.NATIONAL_MATCH_SERIES]: nationalMatchSeries,
  [ModelType.PLAYER]: player,
  [ModelType.TEAM]: team,
  [ModelType.TRANSFER]: transfer,
};
