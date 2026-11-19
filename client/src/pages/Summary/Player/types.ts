import { PlayerStatistic } from "@dai0413/myorg-shared/types/aggregate/player";
import { FormationItem } from "../../../types/formation";
import { GettedModelDataMap, ModelType } from "../../../types/models";
import { PanelSummary, UseSummary } from "../types";
import { StatisticsDatas } from "../../../types/table";
import { Data } from "../../../types/types";

export const PLAYER_TAB = {
  TOP: "top",
  POSITION: "position",
  TRANSFER: "transfer",
  INJURY: "injury",
  PLAYER_REGISTRATION: "playerRegistration",
  NATIONAL_CALLUP: "nationalCallup",
  STATISTICS: "statistics",
} as const;

export type PlayerTab = (typeof PLAYER_TAB)[keyof typeof PLAYER_TAB];

export type TopPanelRows = {
  season: StatisticsDatas;
  competition: StatisticsDatas;
  teams: StatisticsDatas;
  starts: StatisticsDatas;
  subs: StatisticsDatas;
  bench: StatisticsDatas;
  goals: StatisticsDatas;
  assists: StatisticsDatas;
};

export type TopPanelItems = {
  doughnut: {
    start: number;
    sub: number;
    bench: number;
  };
  table: {
    rows: TopPanelRows[];
    footerRows: TopPanelRows[];
  };
  positions: FormationItem[];
};

type PlayerPanels = {
  top: PanelSummary<TopPanelItems>;
  position: PanelSummary<FormationItem[]>;
  transfer: PanelSummary<GettedModelDataMap[ModelType.TRANSFER][]>;
  injury: PanelSummary<GettedModelDataMap[ModelType.INJURY][]>;
  playerRegistration: PanelSummary<
    GettedModelDataMap[ModelType.PLAYER_REGISTRATION][]
  >;
  nationalCallup: PanelSummary<GettedModelDataMap[ModelType.NATIONAL_CALLUP][]>;
  statistics: PanelSummary<PlayerStatistic[]>;
};

export type UsePlayerSummary = UseSummary<
  GettedModelDataMap[ModelType.PLAYER],
  PlayerTab,
  PlayerPanels
>;

export type PlayerSummaryCache = {
  selectedTab: PlayerTab;
  transfer: Data<GettedModelDataMap[ModelType.TRANSFER]>;
  injury: Data<GettedModelDataMap[ModelType.INJURY]>;
  playerRegistration: Data<GettedModelDataMap[ModelType.PLAYER_REGISTRATION]>;
  nationalCallup: Data<GettedModelDataMap[ModelType.NATIONAL_CALLUP]>;
  statistics: Data<PlayerStatistic>;
};
