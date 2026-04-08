import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/playerMatchEventLog";
import { Select } from "@dai0413/myorg-shared";
import { MatchEventTypeModel } from "src/models/match-event-type.js";
import { resolve } from "../utils/resolve.js";
import { ResolveField } from "../types.js";

type ResolveData = ResolveInput<{
  match_event_type: Select.MODEL;
}>;

const resolveFields: ResolveField<ResolveData>[] = [
  {
    key: "match_event_type",
    model: MatchEventTypeModel,
  },
];

const removeFields: string[] = ["key", "candidatePlayers"];

export const playerMatchEventLog = async (
  data: ResolveData[],
): Promise<ResolveOutput[]> => {
  const resolvedMatchEventType = await resolve<ResolveData, ResolveOutput>(
    data,
    resolveFields,
    removeFields,
  );

  return resolvedMatchEventType;
};
