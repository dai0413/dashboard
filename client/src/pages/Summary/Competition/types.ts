import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { RadarKey } from "../../../components/plot/RadarChart/types";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../../types/models";
import { PanelSummary, ServerDepPanelSummary, UseSummary } from "../types";
import { Label } from "@dai0413/myorg-shared";
import { Data } from "../../../types/types";

export type StatsBaseData = Record<string, any> & {
  [K in RadarKey]?: number;
};

export type StatsValue = Omit<
  ModelDataMap[ModelType.STATS_L],
  RadarKey | "match"
> & {
  [K in RadarKey]?: number;
};

export type StatsActual = Omit<
  GettedModelDataMap[ModelType.STATS_L],
  RadarKey | "match"
> & {
  teamColor?: string;
} & {
  [K in RadarKey]?: { actual?: number; deviation?: number; rank?: number };
};

export type GoalStats = {
  team: Label;
  match: Label;
  goal?: number;
  against_goal?: number;
};

export const COMPETITION_TAB = {
  COMPETITION_STAGE: "competitionStage",
  TEAM_COMPETITION_SEASON: "teamCompetitionSeason",
  MATCH: "match",
  PLAYER_REGISTRATION: "playerRegistration",
  STAFF_REGISTRATION: "staffRegistration",
  SEASON: "season",
  STATS_L_ACTUAL: "statsLActual",
  STATS_L: "statsL",
  PLAYER_STATISTICS: "playerStatistics",
} as const;

export type CompetitionTab =
  (typeof COMPETITION_TAB)[keyof typeof COMPETITION_TAB];

type CompetitionPanels = {
  competitionStage: PanelSummary<
    GettedModelDataMap[ModelType.COMPETITION_STAGE][]
  >;
  teamCompetitionSeason: PanelSummary<
    GettedModelDataMap[ModelType.TEAM_COMPETITION_SEASON][]
  >;
  match: PanelSummary<GettedModelDataMap[ModelType.MATCH][]>;
  playerRegistration: PanelSummary<
    GettedModelDataMap[ModelType.PLAYER_REGISTRATION][]
  >;
  staffRegistration: PanelSummary<
    GettedModelDataMap[ModelType.STAFF_REGISTRATION][]
  >;
  season: PanelSummary<GettedModelDataMap[ModelType.SEASON][]>;

  statsL: PanelSummary<{
    raw: GettedModelDataMap[ModelType.STATS_L][];
    values: StatsActual[];
  }>;

  playerStatistics: ServerDepPanelSummary<PlayerStatistic[]>;
};

export type UseCompetitionSummary = UseSummary<
  GettedModelDataMap[ModelType.COMPETITION],
  CompetitionTab,
  CompetitionPanels,
  GettedModelDataMap[ModelType.SEASON]
>;

export type CompetitionSummaryCache = {
  selectedSeason: GettedModelDataMap[ModelType.SEASON] | null;

  season: Data<GettedModelDataMap[ModelType.SEASON]>;
  competitionStage: Data<GettedModelDataMap[ModelType.COMPETITION_STAGE]>;
  teamCompetitionSeason: Data<
    GettedModelDataMap[ModelType.TEAM_COMPETITION_SEASON]
  >;
  match: Data<GettedModelDataMap[ModelType.MATCH]>;
  playerRegistration: Data<GettedModelDataMap[ModelType.PLAYER_REGISTRATION]>;
  staffRegistration: Data<GettedModelDataMap[ModelType.STAFF_REGISTRATION]>;
  statsL: {
    raw: GettedModelDataMap[ModelType.STATS_L][];
    values: StatsActual[];
  };
  playerStatistic: Data<PlayerStatistic>;
};
