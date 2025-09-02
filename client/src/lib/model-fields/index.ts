import { ModelType } from "../../types/models";
import { transfer } from "./transfer";
import { injury } from "./injury";
import { player } from "./player";
import { team } from "./team";
import { country } from "./country";
import { nationalMatchSeries } from "./national-match-series";
import { nationalCallUp } from "./national-callup";
import { referee } from "./referee";
import { competition } from "./competition";
import { season } from "./season";

export const fieldDefinition = {
  [ModelType.COMPETITION]: competition,
  [ModelType.COUNTRY]: country,
  [ModelType.INJURY]: injury,
  [ModelType.NATIONAL_CALLUP]: nationalCallUp,
  [ModelType.NATIONAL_MATCH_SERIES]: nationalMatchSeries,
  [ModelType.PLAYER]: player,
  [ModelType.REFEREE]: referee,
  [ModelType.SEASON]: season,
  [ModelType.TEAM]: team,
  [ModelType.TRANSFER]: transfer,
};
