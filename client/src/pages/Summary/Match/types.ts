import { FormationItem } from "../../../types/formation";
import { GettedModelDataMap, ModelType } from "../../../types/models";
import { PanelSummary, UseSummary } from "../types";

export const MATCH_TAB = {
  HOME_STARTING_MEMBER: "homeStartingMember",
  HOME_SUB_MEMBER: "homeSubMember",
  AWAY_STARTING_MEMBER: "awayStartingMember",
  AWAY_SUB_MEMBER: "awaySubMember",
  STAFF_APPEARANCE: "staffAppearance",
  PLAYER_MATCH_EVENT_LOG: "playerMatchEventLog",
  STAFF_MATCH_EVENT_LOG: "staffMatchEventLog",
  TEAM_MATCH_FORMATION: "teamMatchFormation",
  HOME_STATS_L: "homeStatsL",
  AWAY_STATS_L: "awayStatsL",
  REFEREE_APPEARANCE: "refereeAppearance",
} as const;

export type MatchTab = (typeof MATCH_TAB)[keyof typeof MATCH_TAB];

type MatchPanels = {
  startingMember: PanelSummary<{
    home: FormationItem[];
    away: FormationItem[];
  }>;
  homeSubMember: PanelSummary<
    GettedModelDataMap[ModelType.PLAYER_APPEARANCE][]
  >;
  awaySubMember: PanelSummary<
    GettedModelDataMap[ModelType.PLAYER_APPEARANCE][]
  >;
  staffAppearance: PanelSummary<
    GettedModelDataMap[ModelType.STAFF_APPEARANCE][]
  >;
  playerMatchEventLog: PanelSummary<
    GettedModelDataMap[ModelType.PLAYER_MATCH_EVENT_LOG][]
  >;
  staffMatchEventLog: PanelSummary<
    GettedModelDataMap[ModelType.STAFF_MATCH_EVENT_LOG][]
  >;
  teamMatchFormation: PanelSummary<
    GettedModelDataMap[ModelType.TEAM_MATCH_FORMATION][]
  >;
  homeStatsL: PanelSummary<GettedModelDataMap[ModelType.STATS_L][]>;
  awayStatsL: PanelSummary<GettedModelDataMap[ModelType.STATS_L][]>;
  refereeAppearance: PanelSummary<
    GettedModelDataMap[ModelType.REFEREE_APPEARANCE][]
  >;
};

export type UseMatchSummary = UseSummary<
  GettedModelDataMap[ModelType.MATCH],
  MatchTab,
  MatchPanels
>;
