import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { NationalCallup } from "../../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../../types/models/national-match-series";
import { PanelSummary, UseSummary } from "../../types";

export const NATIONAL_TEAM_TAB = {
  SERIES: "series",
  MATCH: "match",
  PLAYER: "player",
  PLAYER_PLOT: "playerPlot",
} as const;

export type NationalTeamTab =
  (typeof NATIONAL_TEAM_TAB)[keyof typeof NATIONAL_TEAM_TAB];

type NationalTeamPanels = {
  match: PanelSummary<GettedModelDataMap[ModelType.MATCH][]>;
  player: PanelSummary<GettedModelDataMap[ModelType.PLAYER][]>;
  series: PanelSummary<GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES][]>;

  playerPlot: PanelSummary<{
    nationalCallUp: NationalCallup[];
    nationalMatchSeries: NationalMatchSeries[];
    playerAppearance: GettedModelDataMap[ModelType.PLAYER_APPEARANCE][];
  }>;
};

export type UseNationalTeamSummary = UseSummary<
  GettedModelDataMap[ModelType.TEAM],
  NationalTeamTab,
  NationalTeamPanels
>;
