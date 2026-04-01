import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/match";
import { TeamModel } from "src/models/team.js";
import { MatchFormatModel } from "src/models/match-format.js";
import { StadiumModel } from "src/models/stadium.js";
import { ResolveField } from "../types.js";
import { resolve } from "../utils/resolve.js";

const resolveFields: ResolveField<ResolveInput>[] = [
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

const removeFields: string[] = ["competition_stage"];

export const match = async (data: ResolveInput[]): Promise<ResolveOutput[]> => {
  const resolved = await resolve<ResolveInput, ResolveOutput>(
    data,
    resolveFields,
    removeFields,
  );
  return resolved;
};
