import { OptionArray } from "@dai0413/myorg-shared";
import { Data, TeamMatch } from "../../../../types/types";
import { RadarData } from "../../../../components/plot/RadarChart/types";
import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { TeamCompetitionSeason } from "../../../../types/models/team-competition-season";

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

type SummarySection<T> = {
  text: string;
  key: string;
  items: T;
  reloadFun: () => Promise<void>;
};

export type UseClubTeamSummary = {
  id: string;
  info: {
    selected: GettedModelDataMap[ModelType.TEAM] | null;
    teamCompetitionSeason: Data<TeamCompetitionSeason>;
    selectedteamCompetitionSeason: TeamCompetitionSeason | null;
    seasonOptions: OptionArray;
    handleSetSelectedSeason: (
      seasonId: string | number | Date | undefined,
    ) => void;
  };
  selectedTab: ClubTeamTab;
  handleSelectedTab: (value: string | number | Date | undefined) => void;

  player: SummarySection<GettedModelDataMap[ModelType.TRANSFER][]>;
  future_in: SummarySection<GettedModelDataMap[ModelType.TRANSFER][]>;
  transfer_in: SummarySection<GettedModelDataMap[ModelType.TRANSFER][]>;
  transfer_out: SummarySection<GettedModelDataMap[ModelType.TRANSFER][]>;
  loan: SummarySection<GettedModelDataMap[ModelType.TRANSFER][]>;
  injury: SummarySection<GettedModelDataMap[ModelType.INJURY][]>;
  match: SummarySection<GettedModelDataMap[ModelType.MATCH][]>;
  playerRegistration: SummarySection<
    GettedModelDataMap[ModelType.PLAYER_REGISTRATION][]
  >;
  staffRegistration: SummarySection<
    GettedModelDataMap[ModelType.STAFF_REGISTRATION][]
  >;
  teamCompetitionSeason: SummarySection<TeamCompetitionSeason[]>;
  statsL: SummarySection<GettedModelDataMap[ModelType.STATS_L][]>;

  linePlot: {
    text: string;
    items: {
      teamMatchs: TeamMatch[];
      plotData: {
        label: string[];
        value: number[];
      };
    };
  };

  piePlot: {
    text: string;
    items: {
      offRadarData: RadarData | null;
      defRadarData: RadarData | null;
      isLoading: boolean;
    };
    reloadFun: () => Promise<void>;
  };
};
