import { GettedModelDataMap, ModelType } from "../../../types/models";
import { UseSummary } from "../types";

export const REFEREE_TAB = {} as const;

export type RefereeTab = (typeof REFEREE_TAB)[keyof typeof REFEREE_TAB];

type RefereePanels = {};

export type UseRefereeSummary = UseSummary<
  GettedModelDataMap[ModelType.REFEREE],
  RefereeTab,
  RefereePanels
>;
