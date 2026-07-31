import { GettedModelDataMap, ModelType } from "../../../types/models";
import { PanelSummary, UseSummary } from "../types";

export const STAFF_TAB = {
  STAFF_REGISTRATION: "staffRegistration",
} as const;

export type StaffTab = (typeof STAFF_TAB)[keyof typeof STAFF_TAB];

type StaffPanels = {
  staffRegistration: PanelSummary<
    GettedModelDataMap[ModelType.STAFF_REGISTRATION][]
  >;
};

export type UseStaffSummary = UseSummary<
  GettedModelDataMap[ModelType.STAFF],
  StaffTab,
  StaffPanels
>;
