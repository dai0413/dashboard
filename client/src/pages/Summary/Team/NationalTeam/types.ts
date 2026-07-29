import { GettedModelDataMap, ModelType } from "../../../../types/models";
import { NationalCallup } from "../../../../types/models/national-callup";
import { NationalMatchSeries } from "../../../../types/models/national-match-series";

export const NATIONAL_TEAM_TAB = {
  SERIES: "series",
  MATCH: "match",
  PLAYER: "player",
  PLAYER_PLOT: "playerPlot",
} as const;

export type NationalTeamTab =
  (typeof NATIONAL_TEAM_TAB)[keyof typeof NATIONAL_TEAM_TAB];

type SummarySection<T> = {
  text: string;
  key: string;
  items: T;
  reloadFun: () => Promise<void>;
};

export type UseNationalTeamSummary = {
  id: string;
  info: {
    selected: GettedModelDataMap[ModelType.TEAM] | null;
    isLoading: boolean;
  };
  selectedTab: NationalTeamTab;
  handleSelectedTab: (value: string | number | Date | undefined) => void;

  match: SummarySection<GettedModelDataMap[ModelType.MATCH][]>;
  player: SummarySection<GettedModelDataMap[ModelType.PLAYER][]>;
  series: SummarySection<GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES][]>;

  playerPlot: {
    text: string;
    items: {
      nationalCallUp: NationalCallup[];
      nationalMatchSeries: NationalMatchSeries[];
      playerAppearance: GettedModelDataMap[ModelType.PLAYER_APPEARANCE][];
    };
    reloadFun: () => Promise<void>;
  };
};
