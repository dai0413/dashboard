import { TeamMatch } from "../../../../types/types";
import { RadarData } from "../../../../components/plot/RadarChart/types";
import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { TeamCompetitionSeason } from "../../../../types/models/team-competition-season";
import { PanelSummary, ServerDepPanelSummary, UseSummary } from "../../types";
import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { PlayerAppearanceGet } from "../../../../types/models/player-appearance";
import { PlayerRegistrationGet } from "../../../../types/models/player-registration";
import { MatchGet } from "../../../../types/models/match";
import { Formation } from "../../../../types/models/formation";

export const CLUB_TEAM_TAB = {
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
} as const;

export type ClubTeamTab = (typeof CLUB_TEAM_TAB)[keyof typeof CLUB_TEAM_TAB];

export type FormationCounts = {
  formation: Formation;
  count: number;
};

type ClubTeamPanels = {
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

  linePlot: PanelSummary<{
    teamMatchs: TeamMatch[];
    plotData: {
      label: string[];
      value: number[];
    };
  }>;

  piePlot: PanelSummary<{
    offRadarData: RadarData | null;
    defRadarData: RadarData | null;
    isLoading: boolean;
  }>;

  appearancePlot: ServerDepPanelSummary<{
    playerStatistics: PlayerStatistic[];
    playerAppearance: PlayerAppearanceGet[];
    playerRegistrations: PlayerRegistrationGet[];
    matches: MatchGet[];
    formationCounts: FormationCounts[];
  }>;

  playerStatistics: PanelSummary<PlayerStatistic[]>;
};

export type UseClubTeamSummary = UseSummary<
  GettedModelDataMap[ModelType.TEAM],
  ClubTeamTab,
  ClubTeamPanels,
  TeamCompetitionSeason
>;
