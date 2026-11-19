import type { StaffSummaryCache } from "../types";
import { useSummaryCache } from "../../../../utils/summary/useSummaryCache";

const STAFF_CACHE_KEYS = [
  "staffRegistration",
] as const satisfies (keyof StaffSummaryCache)[];

export const useStaffSummaryCache = () => {
  return useSummaryCache<StaffSummaryCache>(STAFF_CACHE_KEYS);
};
