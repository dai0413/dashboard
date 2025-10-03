import { ModelType } from "../types/models";
import {
  CompetitionStage,
  Competition,
  Country,
  Injury,
  MatchFormat,
  Match,
  Player,
  Referee,
  Season,
  Stadium,
  TeamCompetitionSeason,
  Team,
  Transfer,
  NationalCallup,
  NationalMatchSeries,
} from "./ModelTable";
import {
  CompetitionStageDetail,
  CompetitionDetail,
  CountryDetail,
  InjuryDetail,
  MatchFormatDetail,
  MatchDetail,
  PlayerDetail,
  RefereeDetail,
  SeasonDetail,
  StadiumDetail,
  TeamCompetitionSeasonDetail,
  TeamDetail,
  TransferDetail,
  NationalCallupDetail,
  NationalMatchSeriesDetail,
} from "./ModelDetail";

const models = {
  [ModelType.COMPETITION_STAGE]: {
    table: CompetitionStage,
    detail: CompetitionStageDetail,
  },
  [ModelType.COMPETITION]: { table: Competition, detail: CompetitionDetail },
  [ModelType.COUNTRY]: { table: Country, detail: CountryDetail },
  [ModelType.INJURY]: { table: Injury, detail: InjuryDetail },
  [ModelType.MATCH_FORMAT]: { table: MatchFormat, detail: MatchFormatDetail },
  [ModelType.MATCH]: { table: Match, detail: MatchDetail },
  [ModelType.PLAYER]: { table: Player, detail: PlayerDetail },
  [ModelType.REFEREE]: { table: Referee, detail: RefereeDetail },
  [ModelType.SEASON]: { table: Season, detail: SeasonDetail },
  [ModelType.STADIUM]: { table: Stadium, detail: StadiumDetail },
  [ModelType.TEAM_COMPETITION_SEASON]: {
    table: TeamCompetitionSeason,
    detail: TeamCompetitionSeasonDetail,
  },
  [ModelType.TEAM]: { table: Team, detail: TeamDetail },
  [ModelType.TRANSFER]: { table: Transfer, detail: TransferDetail },
  [ModelType.NATIONAL_CALLUP]: {
    table: NationalCallup,
    detail: NationalCallupDetail,
  },
  [ModelType.NATIONAL_MATCH_SERIES]: {
    table: NationalMatchSeries,
    detail: NationalMatchSeriesDetail,
  },
};
export default models;
