import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import {
  GettedModelDataMap,
  ModelDataMap,
  ModelType,
} from "../../../../types/models";
import { NationalCallup } from "../../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../../types/models/national-match-series";
import { PanelSummary, ServerDepPanelSummary, UseSummary } from "../../types";
import { FormationCounts } from "../ClubTeam/types";
import { GroupedPlayers } from "../../../../components/dataView/DataViewContent/DataView/Matrix/type";
import { QuickFilterData } from "../../../../types/table";
import {
  MonthleyCalendarHeaderItem,
  MonthlyCalendarGroup,
} from "../../../../types/calendar";
import { Data } from "../../../../types/types";

export const NATIONAL_TEAM_TAB = {
  SERIES: "series",
  MATCH: "match",
  PLAYER: "player",
  PLAYER_PLOT: "playerPlot",
  FORMATION_PLOT: "formationPlot",
} as const;

export type NationalTeamTab =
  (typeof NATIONAL_TEAM_TAB)[keyof typeof NATIONAL_TEAM_TAB];

type NationalTeamPanels = {
  match: PanelSummary<GettedModelDataMap[ModelType.MATCH][]>;
  player: PanelSummary<GettedModelDataMap[ModelType.PLAYER][]>;
  series: ServerDepPanelSummary<{
    series: GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES][];
    monthlyCalendar: {
      groups: MonthlyCalendarGroup[];
      headerItems: MonthleyCalendarHeaderItem[];
      selectedKey: string;
      headerOnChange: (key: string) => void;
    };
  }>;

  playerPlot: ServerDepPanelSummary<{
    playerStatistics: PlayerStatistic[];
    nationalCallUp: NationalCallup[];
    nationalMatchSeries: NationalMatchSeries[];
    playerAppearance: GettedModelDataMap[ModelType.PLAYER_APPEARANCE][];
    formationCounts: FormationCounts[];
    quickFilterDatas: QuickFilterData[];
    groupedPlayers: GroupedPlayers[];
    defaultOpenPositions: Set<string>;
    topHeaderText: string;
  }>;

  formationPlot: ServerDepPanelSummary<{
    groupedPlayers: GroupedPlayers[];
    quickFilterDatas: QuickFilterData[];
  }>;
};

export type UseNationalTeamSummary = UseSummary<
  GettedModelDataMap[ModelType.TEAM],
  NationalTeamTab,
  NationalTeamPanels
>;

export type SeriesData = {
  isLoading: boolean;

  series: Data<GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES]>;
  selectedKey: string;
};

export type PlayerPlot = {
  isLoading: boolean;
  competitions: GettedModelDataMap[ModelType.COMPETITION][];
  selectedCompetitions: string[];
  formationCounts: FormationCounts[];
  selectedFormation: string;
  playerStatistics: PlayerStatistic[];
  startBaseDate: Date | undefined;
  endBaseDate: Date | undefined;

  playerAppearance: GettedModelDataMap[ModelType.PLAYER_APPEARANCE][];
  nationalCallUp: ModelDataMap[ModelType.NATIONAL_CALLUP][];
};

export type FormationPlot = {
  isLoading: boolean;

  formationCounts: FormationCounts[];
  selectedFormation: string;
  playerStatistics: PlayerStatistic[];
  selectedDateKey: string;
};

export type NationalTeamSummaryCache = {
  selectedTab: NationalTeamTab;

  match: Data<GettedModelDataMap[ModelType.MATCH]>;
  player: Data<GettedModelDataMap[ModelType.PLAYER]>;
  series: SeriesData;
  playerPlot: PlayerPlot;

  formationPlot: FormationPlot;
};
