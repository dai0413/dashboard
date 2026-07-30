import { GettedModelDataMap, ModelType } from "../../../types/models";
import { PanelSummary, UseSummary } from "../types";

export const NATIONAL_MATCH_SERIES_TAB = {
  MATCH: "match",
  NATIONAL_CALLUP: "nationalCallup",
} as const;

export type NationalMatchSeriesTab =
  (typeof NATIONAL_MATCH_SERIES_TAB)[keyof typeof NATIONAL_MATCH_SERIES_TAB];

type NationalMatchSeriesPanels = {
  match: PanelSummary<GettedModelDataMap[ModelType.MATCH][]>;
  nationalCallup: PanelSummary<GettedModelDataMap[ModelType.NATIONAL_CALLUP][]>;
};

export type UseNationalMatchSeriesSummary = UseSummary<
  GettedModelDataMap[ModelType.NATIONAL_MATCH_SERIES],
  NationalMatchSeriesTab,
  NationalMatchSeriesPanels
>;
