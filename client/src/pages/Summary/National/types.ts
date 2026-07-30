import { GettedModelDataMap, ModelType } from "../../../types/models";
import { PanelSummary, UseSummary } from "../types";

export const NATIONAL_TAB = {
  COMPETITION: "competition",
  TEAM: "team",
} as const;

export type NationalTab = (typeof NATIONAL_TAB)[keyof typeof NATIONAL_TAB];

type NationalPanels = {
  competition: PanelSummary<GettedModelDataMap[ModelType.COMPETITION][]>;
  team: PanelSummary<GettedModelDataMap[ModelType.TEAM][]>;
};

export type UseNationalSummary = UseSummary<
  GettedModelDataMap[ModelType.COUNTRY],
  NationalTab,
  NationalPanels
>;
