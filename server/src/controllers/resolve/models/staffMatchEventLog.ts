import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/staffMatchEventLog";
import { Select } from "@dai0413/myorg-shared";
import { resolve } from "../utils/resolve.js";
import { ResolveField } from "../types.js";
import { MatchEventTypeModel } from "../../../models/match-event-type.js";
import { StaffModel } from "../../../models/staff.js";

type ResolveData = ResolveInput<{
  staff: Select.MODEL;
  match_event_type: Select.MODEL;
}>;

const resolveFields: ResolveField<ResolveData>[] = [
  { key: "staff", model: StaffModel, delete: "staff_name" },
  {
    key: "match_event_type",
    model: MatchEventTypeModel,
  },
];

const removeFields: string[] = ["key", "candidateStaffs"];

export const staffMatchEventLog = async (
  data: ResolveData[],
): Promise<ResolveOutput[]> => {
  const resolvedMatchEventType = await resolve<ResolveData, ResolveOutput>(
    data,
    resolveFields,
    removeFields,
  );

  return resolvedMatchEventType;
};
