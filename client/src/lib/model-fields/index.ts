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
import { teamCompetitionSeason } from "./team-competition-season";
import { stadium } from "./stadium";
import { competitionStage } from "./competition-stage";

export const fieldDefinition = {
  [ModelType.COMPETITION_STAGE]: competitionStage,
  [ModelType.COMPETITION]: competition,
  [ModelType.COUNTRY]: country,
  [ModelType.INJURY]: injury,
  [ModelType.NATIONAL_CALLUP]: nationalCallUp,
  [ModelType.NATIONAL_MATCH_SERIES]: nationalMatchSeries,
  [ModelType.PLAYER]: player,
  [ModelType.REFEREE]: referee,
  [ModelType.SEASON]: season,
  [ModelType.STADIUM]: stadium,
  [ModelType.TEAM_COMPETITION_SEASON]: teamCompetitionSeason,
  [ModelType.TEAM]: team,
  [ModelType.TRANSFER]: transfer,
};
