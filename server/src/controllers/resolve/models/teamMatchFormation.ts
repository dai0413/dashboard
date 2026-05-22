import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/teamMatchFormation";

import { ResolveField } from "../types.js";
import { resolve } from "../utils/resolve.js";
import { Select } from "@dai0413/myorg-shared";
import { FormationModel } from "../../../models/formation.js";

type ResolveData = ResolveInput<{
  team: Select.LABEL;
  match: Select.LABEL;
  formation: Select.MODEL;
}>;

const resolveFields: ResolveField<ResolveData>[] = [
  {
    key: "formation",
    model: FormationModel,
  },
];

const removeFields: string[] = [];

export const teamMatchFormation = async (
  data: ResolveData[],
): Promise<ResolveOutput[]> => {
  const resolved = await resolve<ResolveData, ResolveOutput>(
    data,
    resolveFields,
    removeFields,
  );
  return resolved;
};
