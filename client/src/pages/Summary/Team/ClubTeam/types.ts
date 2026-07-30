import { TeamMatch } from "../../../../types/types";
import { RadarData } from "../../../../components/plot/RadarChart/types";
import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { TeamCompetitionSeason } from "../../../../types/models/team-competition-season";
import { PanelSummary, UseSummary } from "../../types";

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
} as const;

export type ClubTeamTab = (typeof CLUB_TEAM_TAB)[keyof typeof CLUB_TEAM_TAB];

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
};

export type UseClubTeamSummary = UseSummary<
  GettedModelDataMap[ModelType.TEAM],
  ClubTeamTab,
  ClubTeamPanels,
  TeamCompetitionSeason
>;
