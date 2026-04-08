import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";
import { TeamModel } from "src/models/team.js";
import { MatchFormatModel } from "src/models/match-format.js";
import { StadiumModel } from "src/models/stadium.js";
import { ResolveField } from "../types.js";
import { resolve } from "../utils/resolve.js";
import { Select } from "@dai0413/myorg-shared";

type ResolveData = ResolveInput<{
  home_team: Select.MODEL;
  away_team: Select.MODEL;
  match_format: Select.MODEL;
  stadium: Select.MODEL;
}>;

const resolveFields: ResolveField<ResolveData>[] = [
  {
    key: "home_team",
    model: TeamModel,
  },
  {
    key: "away_team",
    model: TeamModel,
  },
  {
    key: "match_format",
    model: MatchFormatModel,
  },
  {
    key: "stadium",
    model: StadiumModel,
    delete: "stadium_name",
  },
];

const removeFields: string[] = [];

export const match = async (data: ResolveData[]): Promise<ResolveOutput[]> => {
  const resolved = await resolve<ResolveData, ResolveOutput>(
    data,
    resolveFields,
    removeFields,
  );
  return resolved;
};
