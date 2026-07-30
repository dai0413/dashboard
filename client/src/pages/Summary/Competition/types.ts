import { RadarKey } from "../../../components/plot/RadarChart/types";
import { GettedModelDataMap, ModelType } from "../../../types/models";
import { PanelSummary, UseSummary } from "../types";

type StatsBase = Omit<
  GettedModelDataMap[ModelType.STATS_L],
  RadarKey | "match"
>;

export type StatsActual = Omit<GettedModelDataMap[ModelType.STATS_L], "match">;
export type StatsDeviation = StatsBase & {
  [K in RadarKey]?: number;
};
export type StatsRank = StatsBase & {
  [K in RadarKey]?: number;
};

export const COMPETITION_TAB = {
  COMPETITION_STAGE: "competitionStage",
  TEAM_COMPETITION_SEASON: "teamCompetitionSeason",
  MATCH: "match",
  PLAYER_REGISTRATION: "playerRegistration",
  STAFF_REGISTRATION: "staffRegistration",
  SEASON: "season",
  STATS_L_ACTUAL: "statsLActual",
  STATS_L_DEVIATION: "statsLDeviation",
  STATS_L_RANK: "statsLRank",
  STATS_L: "statsL",
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
    actual: StatsActual[];
    deviation: StatsDeviation[];
    rank: StatsRank[];
  }>;
};

export type UseCompetitionSummary = UseSummary<
  GettedModelDataMap[ModelType.COMPETITION],
  GettedModelDataMap[ModelType.SEASON],
  CompetitionTab,
  CompetitionPanels
>;
