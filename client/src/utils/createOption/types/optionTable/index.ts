import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { OptionArray, OptionTable } from "../../../../types/form/option";
import { Competition } from "./competition";
import { CompetitionStage } from "./competition-stage";
import { Country } from "./country";
import { Formation } from "./formation";
import { Match } from "./match";
import { MatchEventType } from "./match-event-type";
import { MatchFormat } from "./match-format";
import { NationalMatchSeries } from "./national-match-series";
import { Player } from "./player";
import { Season } from "./season";
import { Stadium } from "./stadium";
import { Staff } from "./staff";
import { Team } from "./team";

type ModelDataOption = {
  [ModelType.COMPETITION_STAGE]: CompetitionStage;
  [ModelType.COMPETITION]: Competition;
  [ModelType.COUNTRY]: Country;
  [ModelType.FORMATION]: Formation;
  [ModelType.MATCH_EVENT_TYPE]: MatchEventType;
  [ModelType.MATCH_FORMAT]: MatchFormat;
  [ModelType.MATCH]: Match;
  [ModelType.NATIONAL_MATCH_SERIES]: NationalMatchSeries;
  [ModelType.PLAYER]: Player;
  [ModelType.SEASON]: Season;
  [ModelType.STADIUM]: Stadium;
  [ModelType.STAFF]: Staff;
  [ModelType.TEAM]: Team;
};

type OptionTableMap = {
  [K in keyof ModelDataOption]: OptionArray | OptionTable<ModelDataOption[K]>;
};

export type ModelDataOptionConfigMap = {
  [K in keyof ModelDataOption]: {
    input: GettedModelDataMap[K][];
    option: OptionTableMap[K];
  };
};
