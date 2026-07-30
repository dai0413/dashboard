import { FormationItem } from "../../../types/formation";
import { GettedModelDataMap, ModelType } from "../../../types/models";
import { PanelSummary, UseSummary } from "../types";

export const PLAYER_TAB = {
  POSITION: "position",
  TRANSFER: "transfer",
  INJURY: "injury",
  PLAYER_REGISTRATION: "playerRegistration",
  NATIONAL_CALLUP: "nationalCallup",
} as const;

export type PlayerTab = (typeof PLAYER_TAB)[keyof typeof PLAYER_TAB];

type PlayerPanels = {
  position: PanelSummary<FormationItem[]>;
  transfer: PanelSummary<GettedModelDataMap[ModelType.TRANSFER][]>;
  injury: PanelSummary<GettedModelDataMap[ModelType.INJURY][]>;
  playerRegistration: PanelSummary<
    GettedModelDataMap[ModelType.PLAYER_REGISTRATION][]
  >;
  nationalCallup: PanelSummary<GettedModelDataMap[ModelType.NATIONAL_CALLUP][]>;
};

export type UsePlayerSummary = UseSummary<
  GettedModelDataMap[ModelType.PLAYER],
  PlayerTab,
  PlayerPanels
>;
