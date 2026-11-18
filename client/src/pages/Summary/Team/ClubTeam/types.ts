import { Data, ObjectData, TeamMatch } from "../../../../types/types";
import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { TeamCompetitionSeason } from "../../../../types/models/team-competition-season";
import { PanelSummary, ServerDepPanelSummary, UseSummary } from "../../types";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { GroupedPlayers } from "../../../../components/dataView/DataViewContent/DataView/Matrix/type";
import { QuickFilterData, StatisticsDatas } from "../../../../types/table";
import { StatsActual } from "../../Competition/types";
import { SeasonDates } from "../../../../types/seasonDates";

export const CLUB_TEAM_TAB = {
  TOP: "top",
  PLAYER: "player",
  FUTURE_IN: "future_in",
  TRANSFER_IN: "transfer_in",
  TRANSFER_OUT: "transfer_out",
  LOAN: "loan",
  INJURY: "injury",
  MATCH: "match",
  PLAYER_REGISTRATION: "playerRegistration",
  STAFF_REGISTRATION: "staffRegistration",
  TEAM_COMPETITION_SEASON: "teamCompetitionSeason",
  STATS_L: "statsL",
  LINE_PLOT: "linePlot",
  PIE_PLOT_ATTACK: "piePlot_attack",
  PIE_PLOT_DEFENCE: "piePlot_defence",
  APPEARANCE_PLOT: "appearancePlot",
  PLAYER_STATISTICS: "playerStatistics",
  FORMATION_PLOT: "formationPlot",
  BIRTH_YEAR_POSITION_MATRIX: "birthYearPositionMatrix",
} as const;

export type ClubTeamTab = (typeof CLUB_TEAM_TAB)[keyof typeof CLUB_TEAM_TAB];

export type FormationCounts = GettedModelDataMap[ModelType.FORMATION] & {
  count: number;
};

export type TopPanelRows = {
  competition: StatisticsDatas;
  total: StatisticsDatas;
  win: StatisticsDatas;
  draw: StatisticsDatas;
  lose: StatisticsDatas;
  winRate: StatisticsDatas;
};

export type TopPanelItems = {
  doughnut: {
    win: number;
    draw: number;
    lose: number;
  };
  table: {
    rows: TopPanelRows[];
    footerRows: TopPanelRows[];
  };
};

type ClubTeamPanels = {
  top: PanelSummary<TopPanelItems>;
  player: PanelSummary<GettedModelDataMap[ModelType.TRANSFER][]>;
  future_in: PanelSummary<GettedModelDataMap[ModelType.TRANSFER][]>;
  transfer_in: PanelSummary<GettedModelDataMap[ModelType.TRANSFER][]>;
  transfer_out: PanelSummary<GettedModelDataMap[ModelType.TRANSFER][]>;
  loan: PanelSummary<GettedModelDataMap[ModelType.TRANSFER][]>;
  injury: PanelSummary<GettedModelDataMap[ModelType.INJURY][]>;
  match: PanelSummary<GettedModelDataMap[ModelType.MATCH][]>;
  playerRegistration: PanelSummary<
    GettedModelDataMap[ModelType.PLAYER_REGISTRATION][]
  >;
  staffRegistration: PanelSummary<
    GettedModelDataMap[ModelType.STAFF_REGISTRATION][]
  >;
  teamCompetitionSeason: PanelSummary<TeamCompetitionSeason[]>;
  statsL: PanelSummary<GettedModelDataMap[ModelType.STATS_L][]>;

  linePlot: PanelSummary<LinePlotData>;

  radarData: PanelSummary<RadarData>;

  appearancePlot: ServerDepPanelSummary<{
    playerAppearance: GettedModelDataMap[ModelType.PLAYER_APPEARANCE][];
    injuries: GettedModelDataMap[ModelType.INJURY][];
    playerRegistrations: GettedModelDataMap[ModelType.PLAYER_REGISTRATION][];
    matches: GettedModelDataMap[ModelType.MATCH][];
    groupedPlayers: GroupedPlayers[];
    defaultOpenPositions: Set<string>;
    topHeaderText: string;
    quickFilterDatas: QuickFilterData[];
  }>;

  playerStatistics: ServerDepPanelSummary<{
    playerStatistics: PlayerStatistic[];
    quickFilterDatas: QuickFilterData[];
  }>;

  formationPlot: ServerDepPanelSummary<{
    teamMatchFormations: GettedModelDataMap[ModelType.TEAM_MATCH_FORMATION][];
    groupedPlayers: GroupedPlayers[];
    quickFilterDatas: QuickFilterData[];
  }>;

  birthYearPositionMatrix: ServerDepPanelSummary<{
    playerAppearance: GettedModelDataMap[ModelType.PLAYER_APPEARANCE][];
    playerStatistics: PlayerStatistic[];
    playerRegistrations: GettedModelDataMap[ModelType.PLAYER_REGISTRATION][];
    matches: GettedModelDataMap[ModelType.MATCH][];
    groupedPlayers: GroupedPlayers[];
    defaultOpenPositions: Set<string>;
    topHeaderText: string;
    quickFilterDatas: QuickFilterData[];
    transferOuts: GettedModelDataMap[ModelType.TRANSFER][];
    transferIns: GettedModelDataMap[ModelType.TRANSFER][];
    baseDate?: Date;
  }>;
};

export type UseClubTeamSummary = UseSummary<
  GettedModelDataMap[ModelType.TEAM],
  ClubTeamTab,
  ClubTeamPanels,
  TeamCompetitionSeason
>;

export type RadarData = ObjectData<{
  offRadarData?: StatsActual;
  defRadarData?: StatsActual;
  matchCounts?: number;
}>;

export type LinePlotData = ObjectData<{
  teamMatchs: TeamMatch[];
  plotData: {
    label: string[];
    value: number[];
  };
}>;

export type SeasonDate = {
  normalSeason: SeasonDates;
  transferWindow: SeasonDates;
  future: SeasonDates;
};

export type AppearancePlotData = {
  isLoading: boolean;

  matches: GettedModelDataMap[ModelType.MATCH][];
  selectedCompetitions: string[];
  selectedFormation: string;
  formationCounts: FormationCounts[];
  playerStatistics: PlayerStatistic[];
  injuries: GettedModelDataMap[ModelType.INJURY][];
  playerAppearance: GettedModelDataMap[ModelType.PLAYER_APPEARANCE][];
  playerRegistration: GettedModelDataMap[ModelType.PLAYER_REGISTRATION][];
};

export type FormationPlotData = {
  isLoading: boolean;

  matches: GettedModelDataMap[ModelType.MATCH][];
  selectedCompetitions: string[];
  selectedFormation: GettedModelDataMap[ModelType.FORMATION] | undefined;
  formationCounts: FormationCounts[];
  playerStatistics: PlayerStatistic[];
  teamMatchFormations: GettedModelDataMap[ModelType.TEAM_MATCH_FORMATION][];
};

export type PlayerStatisticsData = {
  isLoading: boolean;

  matches: GettedModelDataMap[ModelType.MATCH][];
  playerStatistics: PlayerStatistic[];
  formationCounts: FormationCounts[];
  selectedCompetitions: string[];
};

export type ClubTeamSummaryCache = {
  seasonDate: SeasonDate;
  selectedteamCompetitionSeason: TeamCompetitionSeason | null;

  player: Data<GettedModelDataMap[ModelType.TRANSFER]>;
  future_in: Data<GettedModelDataMap[ModelType.TRANSFER]>;
  transfer_in: Data<GettedModelDataMap[ModelType.TRANSFER]>;
  transfer_out: Data<GettedModelDataMap[ModelType.TRANSFER]>;
  loan: Data<GettedModelDataMap[ModelType.TRANSFER]>;
  injury: Data<GettedModelDataMap[ModelType.INJURY]>;
  match: Data<GettedModelDataMap[ModelType.MATCH]>;
  playerRegistration: Data<GettedModelDataMap[ModelType.PLAYER_REGISTRATION]>;
  statsL: Data<GettedModelDataMap[ModelType.STATS_L]>;
  staffRegistration: Data<GettedModelDataMap[ModelType.STAFF_REGISTRATION]>;
  radarData: RadarData;
  linePlot: LinePlotData;
  teamCompetitionSeason: Data<TeamCompetitionSeason>;
  appearancePlot: AppearancePlotData;
  birthYearPositionMatrix: AppearancePlotData;
  formationPlot: FormationPlotData;
  playerStatistics: PlayerStatisticsData;
};
