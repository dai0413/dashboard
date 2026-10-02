import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player/statistic";
import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { NationalCallup } from "../../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../../types/models/national-match-series";
import { PanelSummary, ServerDepPanelSummary, UseSummary } from "../../types";
import { FormationCounts } from "../ClubTeam/types";
import { GroupedPlayers } from "../../../../components/dataView/DataViewContent/DataView/Matrix/type";
import { QuickFilterData } from "../../../../types/table";

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
  series: PanelSummary<GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES][]>;

  playerPlot: ServerDepPanelSummary<{
    playerStatistics: PlayerStatistic[];
    nationalCallUp: NationalCallup[];
    nationalMatchSeries: NationalMatchSeries[];
    playerAppearance: GettedModelDataMap[ModelType.PLAYER_APPEARANCE][];
    formationCounts: FormationCounts[];
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
