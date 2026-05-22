import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/staffMatchEventLog";
import { Select } from "@dai0413/myorg-shared";
import { resolve } from "../utils/resolve.js";
import { ResolveField } from "../types.js";
import { MatchEventTypeModel } from "../../../models/match-event-type.js";

type ResolveData = ResolveInput<{
  match_event_type: Select.MODEL;
}>;

const resolveFields: ResolveField<ResolveData>[] = [
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
